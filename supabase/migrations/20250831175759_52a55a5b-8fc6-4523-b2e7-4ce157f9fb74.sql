-- Add sent metadata columns to estimates and invoices tables
ALTER TABLE public.estimates
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sent_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS last_sent_to TEXT,
  ADD COLUMN IF NOT EXISTS sent_count INTEGER DEFAULT 0;

ALTER TABLE public.invoices_enhanced
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sent_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS last_sent_to TEXT,
  ADD COLUMN IF NOT EXISTS sent_count INTEGER DEFAULT 0;

-- Update accept_estimate function to require sent_at
CREATE OR REPLACE FUNCTION public.accept_estimate(p_token text, p_name text DEFAULT NULL::text, p_email text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  est_id UUID;
BEGIN
  -- Only allow acceptance when estimate was sent and via public token
  SELECT id INTO est_id
  FROM public.estimates
  WHERE public_token = p_token
    AND sent_at IS NOT NULL
    AND status IN ('sent', 'viewed');

  IF est_id IS NULL THEN
    RAISE EXCEPTION 'Estimate not found or not eligible for acceptance';
  END IF;

  UPDATE public.estimates 
  SET status = 'accepted',
      accepted_at = now(),
      accepted_by_name = p_name,
      accepted_by_email = p_email
  WHERE id = est_id;
END;
$function$;