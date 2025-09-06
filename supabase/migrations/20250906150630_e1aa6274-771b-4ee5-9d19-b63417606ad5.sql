-- Create a test user for Manus
-- Note: This creates a user in the profiles table
-- The actual auth user needs to be created through Supabase Dashboard

-- First, let's ensure we have a test user profile ready
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  company_name,
  trial_starts_at,
  trial_ends_at,
  trial_status,
  is_subscribed,
  data_retention_until
)
VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'test@firebuildai.com',
  'Test User',
  'Test Company',
  now(),
  now() + interval '30 days',
  'active',
  false,
  now() + interval '120 days'
)
ON CONFLICT (id) DO UPDATE SET
  trial_ends_at = now() + interval '30 days',
  trial_status = 'active';