-- Fix consultation_bookings security completely
-- First, let's see what policies currently exist and clean them up

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Admins can manage bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Users can view own booking via token" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Authenticated users can view own bookings by email" ON public.consultation_bookings;

-- Create secure RLS policies

-- 1. Admins can do everything with bookings
CREATE POLICY "Admins can manage all bookings" 
ON public.consultation_bookings 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- 2. Anyone can create bookings (needed for public form)
CREATE POLICY "Public can create bookings" 
ON public.consultation_bookings 
FOR INSERT 
WITH CHECK (true);

-- 3. Authenticated users can view their own bookings by email
CREATE POLICY "Users can view own bookings by email" 
ON public.consultation_bookings 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND auth.email() IS NOT NULL
  AND email = auth.email()
);

-- NO PUBLIC SELECT POLICY - This is critical!
-- Public access is ONLY through the secure functions below

-- Ensure public_token column exists and is properly configured
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consultation_bookings' 
    AND column_name = 'public_token'
  ) THEN
    ALTER TABLE public.consultation_bookings 
    ADD COLUMN public_token uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL;
  END IF;
END $$;

-- Update any existing rows without tokens
UPDATE public.consultation_bookings 
SET public_token = gen_random_uuid() 
WHERE public_token IS NULL;

-- Create secure function for token-based access (with proper return type)
CREATE OR REPLACE FUNCTION public.get_consultation_by_token(p_token uuid)
RETURNS SETOF public.consultation_bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function bypasses RLS but requires exact token match
  -- No enumeration possible as it requires the exact UUID
  RETURN QUERY
  SELECT * FROM public.consultation_bookings
  WHERE public_token = p_token
  LIMIT 1;
END;
$$;

-- Create minimal public confirmation function
CREATE OR REPLACE FUNCTION public.get_booking_confirmation(p_token uuid)
RETURNS TABLE(
  booking_name text,
  booking_status text,
  appointment_date date,
  appointment_time time
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Returns only minimal data for confirmation pages
  -- No email, phone, or company data exposed
  RETURN QUERY
  SELECT 
    cb.name as booking_name,
    cb.status as booking_status,
    cs.slot_date as appointment_date,
    cs.slot_time as appointment_time
  FROM public.consultation_bookings cb
  LEFT JOIN public.consultation_slots cs ON cs.id = cb.slot_id
  WHERE cb.public_token = p_token
  LIMIT 1;
END;
$$;

-- Add security documentation
COMMENT ON TABLE public.consultation_bookings IS 
'Consultation bookings with enhanced security.
- Direct table access restricted to admins and authenticated users (own bookings only)
- Public access ONLY via secure token-based functions
- Prevents competitor data theft and enumeration attacks';

COMMENT ON FUNCTION public.get_consultation_by_token IS 
'Secure token-based access to consultation bookings.
Requires exact UUID token - prevents enumeration.
For use in admin panels and detailed views.';

COMMENT ON FUNCTION public.get_booking_confirmation IS 
'Minimal public-safe booking confirmation.
Returns only name and appointment time - no contact details.
For use in public confirmation pages.';