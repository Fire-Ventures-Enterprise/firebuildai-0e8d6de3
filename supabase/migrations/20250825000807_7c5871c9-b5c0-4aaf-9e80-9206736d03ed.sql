-- Create admin roles table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer', -- viewer, manager, super_admin
  permissions JSONB DEFAULT '{"view_subscribers": true, "view_payments": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
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

-- Create function to get admin role
CREATE OR REPLACE FUNCTION public.get_admin_role(check_user_id UUID DEFAULT NULL)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
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

-- RLS Policies for admin_users table
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Super admins can insert admin users" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (public.get_admin_role() = 'super_admin');

CREATE POLICY "Super admins can update admin users" 
ON public.admin_users 
FOR UPDATE 
USING (public.get_admin_role() = 'super_admin');

-- Update RLS policies for subscribers table to allow admin access
CREATE POLICY "Admins can view all subscribers" 
ON public.subscribers 
FOR SELECT 
USING (public.is_admin());

-- Update RLS policies for payment_history to allow admin access
CREATE POLICY "Admins can view all payments" 
ON public.payment_history 
FOR SELECT 
USING (public.is_admin());

-- Update RLS policies for profiles to allow admin access
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin());

-- Update RLS policies for client_companies to allow admin access
CREATE POLICY "Admins can view all companies" 
ON public.client_companies 
FOR SELECT 
USING (public.is_admin());

-- Create an initial super admin (you'll need to update this with your actual user ID)
-- This is commented out - you'll need to run it manually with your user ID
-- INSERT INTO public.admin_users (user_id, role, permissions)
-- VALUES ('YOUR-USER-ID-HERE', 'super_admin', '{"all": true}'::jsonb);