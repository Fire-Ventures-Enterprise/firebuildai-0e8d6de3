# Supabase Migration for Trial System

## Instructions
Run this SQL migration in your Supabase SQL Editor to set up the trial system:

```sql
-- Create profiles table to track user trial and subscription information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  company_name TEXT,
  trial_starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
  trial_status TEXT NOT NULL DEFAULT 'active' CHECK (trial_status IN ('active', 'expired', 'suspended', 'upgraded')),
  is_subscribed BOOLEAN NOT NULL DEFAULT false,
  data_retention_until TIMESTAMPTZ DEFAULT (now() + interval '120 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own profile
CREATE POLICY "select_own_profile" ON public.profiles
FOR SELECT
USING (id = auth.uid());

-- Create policy for users to update their own profile
CREATE POLICY "update_own_profile" ON public.profiles
FOR UPDATE
USING (id = auth.uid());

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    company_name,
    trial_starts_at,
    trial_ends_at,
    data_retention_until
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company_name',
    now(),
    now() + interval '30 days',
    now() + interval '120 days'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to check and update trial status
CREATE OR REPLACE FUNCTION public.check_trial_status()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET 
    trial_status = 'expired',
    updated_at = now()
  WHERE 
    trial_ends_at < now() 
    AND trial_status = 'active'
    AND is_subscribed = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for performance
CREATE INDEX idx_profiles_trial_status ON public.profiles(trial_status);
CREATE INDEX idx_profiles_trial_ends_at ON public.profiles(trial_ends_at);
CREATE INDEX idx_profiles_is_subscribed ON public.profiles(is_subscribed);
```

## Next Steps

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the SQL above
4. Run the migration
5. Update the Supabase URL and ANON key in `src/lib/supabase.ts`
```