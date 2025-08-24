-- Allow users to insert their own profile if it doesn't exist
CREATE POLICY "insert_own_profile" ON public.profiles
FOR INSERT 
WITH CHECK (id = auth.uid());

-- Insert profile for existing user if missing
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
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'company_name',
  COALESCE((raw_user_meta_data->>'trial_starts_at')::timestamptz, now()),
  COALESCE((raw_user_meta_data->>'trial_ends_at')::timestamptz, now() + interval '30 days'),
  'active',
  false,
  now() + interval '120 days'
FROM auth.users
WHERE id = '74104278-d85d-4b54-9075-df54e548d1fb'
ON CONFLICT (id) DO NOTHING;