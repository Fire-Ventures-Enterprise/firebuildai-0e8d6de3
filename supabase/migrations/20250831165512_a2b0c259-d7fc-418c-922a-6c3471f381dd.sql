-- Add public tokens for portal access
ALTER TABLE public.estimates 
ADD COLUMN IF NOT EXISTS public_token TEXT UNIQUE DEFAULT gen_random_uuid()::text;

ALTER TABLE public.invoices_enhanced
ADD COLUMN IF NOT EXISTS public_token TEXT UNIQUE DEFAULT gen_random_uuid()::text;

-- Create index for token lookups
CREATE INDEX IF NOT EXISTS idx_estimates_public_token ON public.estimates(public_token);
CREATE INDEX IF NOT EXISTS idx_invoices_public_token ON public.invoices_enhanced(public_token);

-- Add public RLS policies for estimates (allow anonymous read by token)
CREATE POLICY "Public can view estimates by token" 
ON public.estimates 
FOR SELECT 
TO anon
USING (public_token IS NOT NULL AND public_token = current_setting('request.jwt.claims', true)::json->>'token');

CREATE POLICY "Public can view estimate items by token" 
ON public.estimate_items_new 
FOR SELECT 
TO anon
USING (EXISTS (
  SELECT 1 FROM public.estimates 
  WHERE estimates.id = estimate_items_new.estimate_id 
  AND estimates.public_token = current_setting('request.jwt.claims', true)::json->>'token'
));

-- Add public RLS policies for invoices
CREATE POLICY "Public can view invoices by token" 
ON public.invoices_enhanced 
FOR SELECT 
TO anon
USING (public_token IS NOT NULL AND public_token = current_setting('request.jwt.claims', true)::json->>'token');

CREATE POLICY "Public can view invoice items by token" 
ON public.invoice_items_enhanced 
FOR SELECT 
TO anon
USING (EXISTS (
  SELECT 1 FROM public.invoices_enhanced 
  WHERE invoices_enhanced.id = invoice_items_enhanced.invoice_id 
  AND invoices_enhanced.public_token = current_setting('request.jwt.claims', true)::json->>'token'
));

-- Add acceptance tracking columns to estimates
ALTER TABLE public.estimates
ADD COLUMN IF NOT EXISTS accepted_by_name TEXT,
ADD COLUMN IF NOT EXISTS accepted_by_email TEXT,
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS accepted_ip TEXT,
ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMPTZ;

-- Create functions for public actions
CREATE OR REPLACE FUNCTION public.mark_estimate_viewed(p_token TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.estimates 
  SET viewed_at = now(), 
      status = CASE WHEN status = 'sent' THEN 'viewed' ELSE status END
  WHERE public_token = p_token;
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_estimate(
  p_token TEXT, 
  p_name TEXT DEFAULT NULL, 
  p_email TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.estimates 
  SET status = 'accepted',
      accepted_at = now(),
      accepted_by_name = p_name,
      accepted_by_email = p_email
  WHERE public_token = p_token 
  AND status IN ('sent', 'viewed');
END;
$$;