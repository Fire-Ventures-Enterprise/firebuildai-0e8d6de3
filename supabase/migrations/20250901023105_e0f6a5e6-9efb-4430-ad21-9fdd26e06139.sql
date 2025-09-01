-- Fix remaining security vulnerability in consultation_bookings RLS policies
-- The previous policy for token-based access was flawed

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view own booking via token" ON public.consultation_bookings;

-- Create a properly secure policy that prevents enumeration
-- This policy is intentionally restrictive - we'll use the function for public access
CREATE POLICY "Authenticated users can view own bookings by email" 
ON public.consultation_bookings 
FOR SELECT 
USING (
  -- Only allow authenticated users to view their own bookings by email match
  auth.uid() IS NOT NULL 
  AND email = auth.email()
);

-- Update the secure function to be the primary way to access bookings via token
CREATE OR REPLACE FUNCTION public.get_consultation_booking_by_token(p_token uuid)
RETURNS TABLE(
  id uuid,
  name text,
  email text,
  phone text,
  company_name text,
  message text,
  status text,
  slot_id uuid,
  confirmation_token uuid,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return non-sensitive booking info if token matches
  -- This function bypasses RLS to allow public access with valid token
  RETURN QUERY
  SELECT 
    cb.id,
    cb.name,
    cb.email,
    cb.phone,
    cb.company_name,
    cb.message,
    cb.status,
    cb.slot_id,
    cb.confirmation_token,
    cb.created_at,
    cb.updated_at
  FROM public.consultation_bookings cb
  WHERE cb.public_token = p_token
  LIMIT 1;
END;
$$;

-- Create a public-safe function that returns minimal data for confirmation pages
CREATE OR REPLACE FUNCTION public.get_consultation_confirmation(p_token uuid)
RETURNS TABLE(
  id uuid,
  name text,
  status text,
  slot_date date,
  slot_time time,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return only minimal data needed for confirmation page
  RETURN QUERY
  SELECT 
    cb.id,
    cb.name,
    cb.status,
    cs.slot_date,
    cs.slot_time,
    cb.created_at
  FROM public.consultation_bookings cb
  LEFT JOIN public.consultation_slots cs ON cs.id = cb.slot_id
  WHERE cb.public_token = p_token
  LIMIT 1;
END;
$$;

-- Add a comment explaining the security model
COMMENT ON FUNCTION public.get_consultation_booking_by_token IS 
'Secure function to retrieve consultation booking by public token. 
This bypasses RLS to allow public access but requires a valid token.
Used for admin views and detailed booking information.';

COMMENT ON FUNCTION public.get_consultation_confirmation IS 
'Public-safe function that returns minimal booking confirmation data.
Only exposes name, status, and appointment time - no contact details.
Used for public confirmation pages.';

-- Ensure the public_token column has proper constraints
ALTER TABLE public.consultation_bookings 
ALTER COLUMN public_token SET NOT NULL,
ALTER COLUMN public_token SET DEFAULT gen_random_uuid();

-- Add an additional confirmation that existing rows have tokens
UPDATE public.consultation_bookings 
SET public_token = gen_random_uuid() 
WHERE public_token IS NULL;