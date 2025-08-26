-- Fix security warnings: Set search_path for all functions

-- Update existing functions with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.check_trial_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.update_trial_and_subscription_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Update expired trials in profiles
  UPDATE public.profiles
  SET 
    trial_status = 'expired',
    subscription_status = 'expired',
    updated_at = now()
  WHERE 
    trial_ends_at < now() 
    AND trial_status = 'active'
    AND is_subscribed = false;

  -- Update subscription status based on subscribers table
  UPDATE public.profiles p
  SET 
    subscription_status = s.status,
    is_subscribed = (s.status = 'active'),
    updated_at = now()
  FROM public.subscribers s
  WHERE 
    p.id = s.user_id
    AND s.status != p.subscription_status;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid DEFAULT NULL::uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Use provided user_id or current user
  target_user_id := COALESCE(check_user_id, auth.uid());
  
  -- Check if user exists in admin_users table
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = target_user_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_role(check_user_id uuid DEFAULT NULL::uuid)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  target_user_id UUID;
  user_role TEXT;
BEGIN
  target_user_id := COALESCE(check_user_id, auth.uid());
  
  SELECT role INTO user_role
  FROM public.admin_users
  WHERE user_id = target_user_id;
  
  RETURN user_role;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;