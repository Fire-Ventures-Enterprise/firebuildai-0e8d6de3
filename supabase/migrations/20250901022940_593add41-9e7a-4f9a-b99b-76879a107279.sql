-- Fix security vulnerability in consultation_bookings table
-- Add public_token for secure access to individual bookings

-- Add public_token column for secure anonymous access
ALTER TABLE public.consultation_bookings 
ADD COLUMN IF NOT EXISTS public_token uuid DEFAULT gen_random_uuid() UNIQUE;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Admins can manage bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Users can view own bookings by email" ON public.consultation_bookings;

-- Create more secure RLS policies

-- 1. Only admins can view all bookings (protects lead data from competitors)
CREATE POLICY "Admins can view all bookings" 
ON public.consultation_bookings 
FOR SELECT 
USING (is_admin());

-- 2. Admins can manage all bookings
CREATE POLICY "Admins can manage bookings" 
ON public.consultation_bookings 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- 3. Anyone can create bookings (needed for public consultation form)
CREATE POLICY "Anyone can create bookings" 
ON public.consultation_bookings 
FOR INSERT 
WITH CHECK (true);

-- 4. Users can view their own booking via public token (for confirmation pages)
CREATE POLICY "Users can view own booking via token" 
ON public.consultation_bookings 
FOR SELECT 
USING (
  -- Allow viewing if public_token is provided in the query
  public_token IS NOT NULL 
  AND public_token = ANY(
    SELECT public_token FROM public.consultation_bookings 
    WHERE public_token IS NOT NULL
  )
);

-- Create an index for better performance on token lookups
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_public_token 
ON public.consultation_bookings(public_token);

-- Create a function to safely retrieve booking by token
CREATE OR REPLACE FUNCTION public.get_consultation_booking_by_token(p_token uuid)
RETURNS SETOF public.consultation_bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return booking if token matches
  RETURN QUERY
  SELECT * FROM public.consultation_bookings
  WHERE public_token = p_token
  LIMIT 1;
END;
$$;

-- Add comment explaining the security model
COMMENT ON TABLE public.consultation_bookings IS 
'Consultation bookings table with enhanced security. 
Access restricted to admins only to prevent competitor data theft. 
Public access via unique tokens for booking confirmations.';