-- Create device pairings table for mobile QR authentication
CREATE TABLE IF NOT EXISTS public.device_pairings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  pairing_token TEXT NOT NULL UNIQUE,
  action_link TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  device_meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.device_pairings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own pairings" ON public.device_pairings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own pairings" ON public.device_pairings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pairings" ON public.device_pairings
  FOR UPDATE USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_device_pairings_token ON public.device_pairings(pairing_token);
CREATE INDEX idx_device_pairings_expires ON public.device_pairings(expires_at);

-- Function to clean up expired pairings
CREATE OR REPLACE FUNCTION public.cleanup_expired_pairings()
RETURNS void AS $$
BEGIN
  DELETE FROM public.device_pairings 
  WHERE expires_at < now() OR used_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;