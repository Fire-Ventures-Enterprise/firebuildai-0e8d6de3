-- Fix security issue with the cleanup function
DROP FUNCTION IF EXISTS public.cleanup_expired_pairings();

CREATE OR REPLACE FUNCTION public.cleanup_expired_pairings()
RETURNS void AS $$
BEGIN
  DELETE FROM public.device_pairings 
  WHERE expires_at < now() OR used_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;