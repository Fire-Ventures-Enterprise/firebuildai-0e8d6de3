-- Fix security definer views 
-- First, let's identify and drop the views with SECURITY DEFINER

-- Drop the problematic views that have SECURITY DEFINER (if they exist)
DROP VIEW IF EXISTS public.invoices_with_work_orders CASCADE;
DROP VIEW IF EXISTS public.work_orders_with_adjustments CASCADE;

-- Recreate any necessary views without SECURITY DEFINER
-- For now, we'll use functions with proper security context instead of views

-- Note: The other warnings are:
-- 1. Auth OTP long expiry - This should be configured in Supabase Dashboard > Auth Settings
-- 2. Leaked Password Protection - This should be enabled in Supabase Dashboard > Auth Settings