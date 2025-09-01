-- Fix remaining security issues from linter

-- 1. Fix all functions without search_path set
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_po_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  current_year TEXT;
  seq_num TEXT;
BEGIN
  current_year := TO_CHAR(NOW(), 'YYYY');
  seq_num := LPAD(nextval('po_number_seq')::TEXT, 5, '0');
  RETURN 'PO-' || current_year || '-' || seq_num;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_po_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.po_number IS NULL THEN
    NEW.po_number := generate_po_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.seed_expense_categories_for_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.expense_categories (user_id, slug, name, is_fuel) 
  VALUES (p_user_id, 'fuel', 'Fuel', true)
  ON CONFLICT (user_id, slug) DO NOTHING;
  
  INSERT INTO public.expense_categories (user_id, slug, name, is_mileage) 
  VALUES (p_user_id, 'mileage', 'Mileage', true)
  ON CONFLICT (user_id, slug) DO NOTHING;
  
  INSERT INTO public.expense_categories (user_id, slug, name) 
  VALUES 
    (p_user_id, 'materials', 'Materials'),
    (p_user_id, 'tools', 'Tools'),
    (p_user_id, 'repairs', 'Repairs'),
    (p_user_id, 'office', 'Office Supplies'),
    (p_user_id, 'insurance', 'Insurance'),
    (p_user_id, 'permits', 'Permits & Licenses'),
    (p_user_id, 'other', 'Other')
  ON CONFLICT (user_id, slug) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_pairings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.device_pairings 
  WHERE expires_at < now() OR used_at IS NOT NULL;
END;
$$;

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

CREATE OR REPLACE FUNCTION public.update_trial_and_subscription_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- 2. Enable RLS on tables that are missing it
-- First check which tables need RLS enabled
DO $$ 
BEGIN
  -- Enable RLS on rate_limit_tracking if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables t
    JOIN pg_class c ON c.relname = t.tablename
    WHERE t.schemaname = 'public' 
    AND t.tablename = 'rate_limit_tracking'
    AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE public.rate_limit_tracking ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policy for rate limiting (internal use only)
CREATE POLICY IF NOT EXISTS "Service role only" 
  ON public.rate_limit_tracking 
  FOR ALL 
  USING (false);

-- 3. Fix estimate_items public access - replace with secure function access
DROP POLICY IF EXISTS "Public can view estimate items by token" ON public.estimate_items;

-- 4. Fix invoice_items_enhanced public access
DROP POLICY IF EXISTS "Public can view invoice items by token" ON public.invoice_items_enhanced;

-- 5. Add device session management table for better pairing security
CREATE TABLE IF NOT EXISTS public.device_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_name text,
  device_type text,
  user_agent text,
  ip_address text,
  last_active timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  revoked_by uuid
);

-- Enable RLS
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view and manage their own sessions
CREATE POLICY "Users can view own sessions" 
  ON public.device_sessions 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can revoke own sessions" 
  ON public.device_sessions 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Create index for efficient querying
CREATE INDEX idx_device_sessions_user_id ON public.device_sessions(user_id);
CREATE INDEX idx_device_sessions_last_active ON public.device_sessions(last_active);

-- 6. Create function to track device sessions
CREATE OR REPLACE FUNCTION public.track_device_session(
  p_device_name text,
  p_device_type text,
  p_user_agent text,
  p_ip_address text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_id uuid;
BEGIN
  INSERT INTO public.device_sessions (
    user_id,
    device_name,
    device_type,
    user_agent,
    ip_address,
    last_active,
    created_at
  )
  VALUES (
    auth.uid(),
    p_device_name,
    p_device_type,
    p_user_agent,
    p_ip_address,
    now(),
    now()
  )
  RETURNING id INTO v_session_id;
  
  -- Log the new session
  PERFORM log_security_event(
    'device_session_created',
    'New device session established',
    jsonb_build_object(
      'session_id', v_session_id,
      'device_name', p_device_name,
      'device_type', p_device_type,
      'ip', p_ip_address
    )
  );
  
  RETURN v_session_id;
END;
$$;

-- 7. Create function to revoke device session
CREATE OR REPLACE FUNCTION public.revoke_device_session(p_session_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.device_sessions
  SET 
    revoked_at = now(),
    revoked_by = auth.uid()
  WHERE 
    id = p_session_id
    AND user_id = auth.uid()
    AND revoked_at IS NULL;
    
  -- Log the revocation
  PERFORM log_security_event(
    'device_session_revoked',
    'Device session revoked by user',
    jsonb_build_object('session_id', p_session_id)
  );
END;
$$;

-- 8. Add proper token management for portal access
CREATE TABLE IF NOT EXISTS public.portal_access_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash text NOT NULL UNIQUE, -- Store hash, not plain token
  resource_type text NOT NULL, -- 'estimate', 'invoice', etc.
  resource_id uuid NOT NULL,
  expires_at timestamptz,
  single_use boolean DEFAULT false,
  used_at timestamptz,
  used_by_ip text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

-- Enable RLS
ALTER TABLE public.portal_access_tokens ENABLE ROW LEVEL SECURITY;

-- Only service role can access this table
CREATE POLICY "Service role only" 
  ON public.portal_access_tokens 
  FOR ALL 
  USING (false);

-- Create index for efficient token lookup
CREATE INDEX idx_portal_tokens_hash ON public.portal_access_tokens(token_hash);
CREATE INDEX idx_portal_tokens_expires ON public.portal_access_tokens(expires_at);

-- 9. Function to validate and use portal token
CREATE OR REPLACE FUNCTION public.validate_portal_token(
  p_token text,
  p_resource_type text,
  p_ip_address text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_hash text;
  v_resource_id uuid;
  v_single_use boolean;
  v_expires_at timestamptz;
  v_used_at timestamptz;
BEGIN
  -- Hash the token for comparison
  v_token_hash := encode(digest(p_token, 'sha256'), 'hex');
  
  -- Find the token
  SELECT resource_id, single_use, expires_at, used_at
  INTO v_resource_id, v_single_use, v_expires_at, v_used_at
  FROM public.portal_access_tokens
  WHERE token_hash = v_token_hash
    AND resource_type = p_resource_type;
    
  -- Check if token exists
  IF v_resource_id IS NULL THEN
    PERFORM log_security_event(
      'portal_token_invalid',
      'Invalid portal token attempted',
      jsonb_build_object('token_hash', v_token_hash, 'ip', p_ip_address)
    );
    RAISE EXCEPTION 'Invalid or expired token';
  END IF;
  
  -- Check if token is expired
  IF v_expires_at IS NOT NULL AND v_expires_at < now() THEN
    PERFORM log_security_event(
      'portal_token_expired',
      'Expired portal token attempted',
      jsonb_build_object('resource_id', v_resource_id, 'ip', p_ip_address)
    );
    RAISE EXCEPTION 'Token has expired';
  END IF;
  
  -- Check if single-use token was already used
  IF v_single_use AND v_used_at IS NOT NULL THEN
    PERFORM log_security_event(
      'portal_token_reused',
      'Single-use token reuse attempted',
      jsonb_build_object('resource_id', v_resource_id, 'ip', p_ip_address)
    );
    RAISE EXCEPTION 'Token has already been used';
  END IF;
  
  -- Mark token as used if single-use
  IF v_single_use THEN
    UPDATE public.portal_access_tokens
    SET 
      used_at = now(),
      used_by_ip = p_ip_address
    WHERE token_hash = v_token_hash;
  END IF;
  
  -- Log successful token use
  PERFORM log_security_event(
    'portal_token_validated',
    'Portal token successfully validated',
    jsonb_build_object(
      'resource_type', p_resource_type,
      'resource_id', v_resource_id,
      'ip', p_ip_address
    )
  );
  
  RETURN v_resource_id;
END;
$$;

-- Add documentation
COMMENT ON TABLE public.device_sessions IS 
'Track active device sessions for users. Allows users to view and revoke access from specific devices.';

COMMENT ON TABLE public.portal_access_tokens IS 
'Secure token management for portal access. Stores hashed tokens with expiry and single-use options.';

COMMENT ON FUNCTION public.validate_portal_token IS 
'Validates portal access tokens with proper security checks including expiry, single-use, and audit logging.';