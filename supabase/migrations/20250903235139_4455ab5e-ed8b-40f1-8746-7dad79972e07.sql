-- Email outbox for queuing and tracking all emails
CREATE TABLE IF NOT EXISTS public.email_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template TEXT NOT NULL, -- 'estimate', 'invoice', 'po', 'receipt', 'reminder', 'review_request'
  ref_id UUID, -- reference to estimate/invoice/po/etc
  user_id UUID REFERENCES auth.users(id),
  to_email TEXT NOT NULL,
  cc TEXT[],
  bcc TEXT[],
  subject TEXT NOT NULL,
  payload JSONB NOT NULL, -- template data
  status TEXT NOT NULL DEFAULT 'queued', -- queued|sending|sent|failed|bounced|suppressed
  provider_id TEXT, -- message ID from email provider
  error TEXT,
  retry_count INTEGER DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Email events from provider webhooks
CREATE TABLE IF NOT EXISTS public.email_events (
  id BIGSERIAL PRIMARY KEY,
  provider_id TEXT,
  event TEXT NOT NULL, -- delivered|opened|clicked|bounced|complaint|unsubscribe
  to_email TEXT,
  subject TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Email suppression list
CREATE TABLE IF NOT EXISTS public.email_suppressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL, -- bounce|complaint|unsubscribe|manual
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS public.email_rate_limits (
  email TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER DEFAULT 1,
  PRIMARY KEY (email, window_start)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_outbox_ref ON public.email_outbox(ref_id, template);
CREATE INDEX IF NOT EXISTS idx_email_outbox_status ON public.email_outbox(status, next_retry_at);
CREATE INDEX IF NOT EXISTS idx_email_outbox_user ON public.email_outbox(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_events_provider ON public.email_events(provider_id);
CREATE INDEX IF NOT EXISTS idx_email_events_email ON public.email_events(to_email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_suppressions_email ON public.email_suppressions(email);

-- RLS policies
ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can view their own email outbox
CREATE POLICY "Users can view own emails" ON public.email_outbox
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create email entries for their own records
CREATE POLICY "Users can queue own emails" ON public.email_outbox
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service role can update email status
CREATE POLICY "Service role can update emails" ON public.email_outbox
  FOR UPDATE USING (true);

-- Users can view email events for their emails
CREATE POLICY "Users can view own email events" ON public.email_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.email_outbox
      WHERE email_outbox.provider_id = email_events.provider_id
      AND email_outbox.user_id = auth.uid()
    )
  );

-- Service role manages suppressions
CREATE POLICY "Service role manages suppressions" ON public.email_suppressions
  FOR ALL USING (auth.role() = 'service_role');

-- Service role manages rate limits
CREATE POLICY "Service role manages rate limits" ON public.email_rate_limits
  FOR ALL USING (auth.role() = 'service_role');

-- Function to check rate limits
CREATE OR REPLACE FUNCTION public.check_email_rate_limit(
  p_email TEXT,
  p_limit INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 60
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_count INTEGER;
BEGIN
  v_window_start := date_trunc('hour', now());
  
  -- Clean old windows
  DELETE FROM public.email_rate_limits
  WHERE window_start < now() - INTERVAL '24 hours';
  
  -- Upsert and check
  INSERT INTO public.email_rate_limits (email, window_start, count)
  VALUES (p_email, v_window_start, 1)
  ON CONFLICT (email, window_start)
  DO UPDATE SET count = email_rate_limits.count + 1
  RETURNING count INTO v_count;
  
  RETURN v_count <= p_limit;
END;
$$;

-- Function to check if email is suppressed
CREATE OR REPLACE FUNCTION public.is_email_suppressed(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.email_suppressions
    WHERE email = p_email
  );
END;
$$;

-- Function to process email bounces
CREATE OR REPLACE FUNCTION public.process_email_bounce(
  p_provider_id TEXT,
  p_email TEXT,
  p_reason TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update outbox status
  UPDATE public.email_outbox
  SET status = 'bounced',
      error = p_reason,
      updated_at = now()
  WHERE provider_id = p_provider_id;
  
  -- Add to suppression list for hard bounces
  IF p_reason ILIKE '%hard%' OR p_reason ILIKE '%permanent%' THEN
    INSERT INTO public.email_suppressions (email, reason, meta)
    VALUES (p_email, 'bounce', jsonb_build_object('reason', p_reason))
    ON CONFLICT (email) DO NOTHING;
  END IF;
END;
$$;