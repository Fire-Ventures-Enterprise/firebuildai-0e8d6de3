-- Fix security warnings for functions by setting search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
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
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid DEFAULT NULL::uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  target_user_id := COALESCE(check_user_id, auth.uid());
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
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.update_notification_preferences_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;