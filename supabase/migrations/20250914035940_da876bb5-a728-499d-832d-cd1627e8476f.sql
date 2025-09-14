-- Fix: Require authentication to view industry presets (proprietary business intelligence)
-- This prevents competitors from accessing sensitive pricing data

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view industry presets" ON public.industry_presets;

-- Create new policy requiring authentication
CREATE POLICY "Authenticated users can view industry presets" 
ON public.industry_presets 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Keep the admin management policy as-is
-- The "Admins can manage industry presets" policy already exists and is fine

-- Add a comment to document the security consideration
COMMENT ON TABLE public.industry_presets IS 'Contains proprietary pricing data - requires authentication for access';