-- CRITICAL SECURITY FIX: Remove public access to sensitive data tables

-- 1. Fix estimates table - Remove public access
DROP POLICY IF EXISTS "Public can view estimates by token" ON public.estimates;

-- Replace with secure token-based function
CREATE OR REPLACE FUNCTION public.get_estimate_by_token(p_token text)
RETURNS TABLE(
  id uuid,
  estimate_number text,
  customer_name text,
  customer_email text,
  customer_phone text,
  service_address text,
  service_city text,
  service_postal_code text,
  service_province text,
  subtotal numeric,
  tax_rate numeric,
  tax_amount numeric,
  total numeric,
  deposit_amount numeric,
  deposit_percentage numeric,
  status text,
  issue_date timestamptz,
  expiration_date timestamptz,
  scope_of_work text,
  notes text,
  terms_conditions text,
  signature_required boolean,
  signed_at timestamptz,
  signed_by_name text,
  signature_data text,
  accepted_at timestamptz,
  accepted_by_name text,
  contract_attached boolean,
  sent_at timestamptz,
  viewed_at timestamptz,
  public_token text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.estimate_number,
    c.first_name || ' ' || c.last_name as customer_name,
    c.email as customer_email,
    c.phone as customer_phone,
    e.service_address,
    e.service_city,
    e.service_postal_code,
    e.service_province,
    e.subtotal,
    e.tax_rate,
    e.tax_amount,
    e.total,
    e.deposit_amount,
    e.deposit_percentage,
    e.status,
    e.issue_date,
    e.expiration_date,
    e.scope_of_work,
    e.notes,
    e.terms_conditions,
    e.signature_required,
    e.signed_at,
    e.signed_by_name,
    e.signature_data,
    e.accepted_at,
    e.accepted_by_name,
    e.contract_attached,
    e.sent_at,
    e.viewed_at,
    e.public_token
  FROM public.estimates e
  LEFT JOIN public.customers c ON c.id = e.customer_id
  WHERE e.public_token = p_token
    AND e.sent_at IS NOT NULL
  LIMIT 1;
END;
$$;

-- Get estimate items securely
CREATE OR REPLACE FUNCTION public.get_estimate_items_by_token(p_token text)
RETURNS TABLE(
  id uuid,
  description text,
  quantity numeric,
  rate numeric,
  amount numeric,
  sort_order integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_estimate_id uuid;
BEGIN
  -- First verify the token is valid
  SELECT e.id INTO v_estimate_id
  FROM public.estimates e
  WHERE e.public_token = p_token
    AND e.sent_at IS NOT NULL
  LIMIT 1;
  
  IF v_estimate_id IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    ei.id,
    ei.description,
    ei.quantity,
    ei.rate,
    ei.amount,
    ei.sort_order
  FROM public.estimate_items ei
  WHERE ei.estimate_id = v_estimate_id
  ORDER BY ei.sort_order;
END;
$$;

-- 2. Fix invoices_enhanced table - Remove public access
DROP POLICY IF EXISTS "Public can view invoices by token" ON public.invoices_enhanced;

-- Replace with secure token-based function
CREATE OR REPLACE FUNCTION public.get_invoice_by_token(p_token text)
RETURNS TABLE(
  id uuid,
  invoice_number text,
  customer_name text,
  customer_email text,
  customer_phone text,
  customer_address text,
  customer_city text,
  customer_postal_code text,
  customer_province text,
  service_address text,
  service_city text,
  service_postal_code text,
  service_province text,
  subtotal numeric,
  tax_rate numeric,
  tax_amount numeric,
  total numeric,
  paid_amount numeric,
  balance numeric,
  status text,
  issue_date timestamptz,
  due_date timestamptz,
  notes text,
  private_notes text,
  deposit_amount numeric,
  deposit_request numeric,
  public_token text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.invoice_number,
    i.customer_name,
    i.customer_email,
    i.customer_phone,
    i.customer_address,
    i.customer_city,
    i.customer_postal_code,
    i.customer_province,
    i.service_address,
    i.service_city,
    i.service_postal_code,
    i.service_province,
    i.subtotal,
    i.tax_rate,
    i.tax_amount,
    i.total,
    i.paid_amount,
    i.balance,
    i.status,
    i.issue_date,
    i.due_date,
    i.notes,
    NULL::text as private_notes, -- Never expose private notes
    i.deposit_amount,
    i.deposit_request,
    i.public_token
  FROM public.invoices_enhanced i
  WHERE i.public_token = p_token
    AND i.sent_at IS NOT NULL
  LIMIT 1;
END;
$$;

-- Get invoice items securely
CREATE OR REPLACE FUNCTION public.get_invoice_items_by_token(p_token text)
RETURNS TABLE(
  id uuid,
  item_name text,
  description text,
  quantity numeric,
  rate numeric,
  amount numeric,
  tax boolean,
  sort_order integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invoice_id uuid;
BEGIN
  -- First verify the token is valid
  SELECT i.id INTO v_invoice_id
  FROM public.invoices_enhanced i
  WHERE i.public_token = p_token
    AND i.sent_at IS NOT NULL
  LIMIT 1;
  
  IF v_invoice_id IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    ii.id,
    ii.item_name,
    ii.description,
    ii.quantity,
    ii.rate,
    ii.amount,
    ii.tax,
    ii.sort_order
  FROM public.invoice_items_enhanced ii
  WHERE ii.invoice_id = v_invoice_id
  ORDER BY ii.sort_order;
END;
$$;

-- 3. Fix device_pairings security - Add missing indexes and constraints
ALTER TABLE public.device_pairings 
  ADD CONSTRAINT check_expires_future CHECK (expires_at > created_at);

CREATE INDEX IF NOT EXISTS idx_device_pairings_expires_at 
  ON public.device_pairings(expires_at);

CREATE INDEX IF NOT EXISTS idx_device_pairings_used_at 
  ON public.device_pairings(used_at);

-- 4. Fix function search paths for security definer functions
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

-- 5. Add audit logging table for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  event_description text,
  user_id uuid,
  user_email text,
  ip_address text,
  user_agent text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
  ON public.security_audit_log 
  FOR SELECT 
  USING (is_admin());

-- Create index for efficient querying
CREATE INDEX idx_audit_log_created_at ON public.security_audit_log(created_at DESC);
CREATE INDEX idx_audit_log_event_type ON public.security_audit_log(event_type);
CREATE INDEX idx_audit_log_user_id ON public.security_audit_log(user_id);

-- 6. Add function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_event_description text,
  p_metadata jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    event_type,
    event_description,
    user_id,
    user_email,
    metadata,
    created_at
  )
  VALUES (
    p_event_type,
    p_event_description,
    auth.uid(),
    auth.email(),
    p_metadata,
    now()
  );
END;
$$;

-- 7. Add rate limiting table for API protection
CREATE TABLE IF NOT EXISTS public.rate_limit_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- Could be user_id, ip_address, or token
  endpoint text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_rate_limit_identifier ON public.rate_limit_tracking(identifier, endpoint, window_start);

-- Clean up old rate limit entries periodically
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limit_tracking 
  WHERE window_start < now() - interval '1 hour';
END;
$$;

-- 8. Secure the estimate acceptance function
CREATE OR REPLACE FUNCTION public.accept_estimate(
  p_token text, 
  p_name text DEFAULT NULL::text, 
  p_email text DEFAULT NULL::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  est_id UUID;
  v_ip_address text;
BEGIN
  -- Get IP from context if available
  v_ip_address := current_setting('request.headers', true)::json->>'x-forwarded-for';
  
  -- Only allow acceptance when estimate was sent and via public token
  SELECT id INTO est_id
  FROM public.estimates
  WHERE public_token = p_token
    AND sent_at IS NOT NULL
    AND status IN ('sent', 'viewed');

  IF est_id IS NULL THEN
    -- Log failed attempt
    PERFORM log_security_event(
      'estimate_accept_failed',
      'Invalid token or estimate not eligible',
      jsonb_build_object('token', p_token, 'ip', v_ip_address)
    );
    RAISE EXCEPTION 'Estimate not found or not eligible for acceptance';
  END IF;

  UPDATE public.estimates 
  SET status = 'accepted',
      accepted_at = now(),
      accepted_by_name = p_name,
      accepted_by_email = p_email,
      accepted_ip = v_ip_address
  WHERE id = est_id;
  
  -- Log successful acceptance
  PERFORM log_security_event(
    'estimate_accepted',
    'Estimate accepted via portal',
    jsonb_build_object(
      'estimate_id', est_id,
      'accepted_by', p_name,
      'ip', v_ip_address
    )
  );
END;
$$;

-- Add comments for documentation
COMMENT ON FUNCTION public.get_estimate_by_token IS 
'Secure token-based access to estimate data. Prevents enumeration attacks by requiring exact token match.';

COMMENT ON FUNCTION public.get_invoice_by_token IS 
'Secure token-based access to invoice data. Private notes are never exposed.';

COMMENT ON TABLE public.security_audit_log IS 
'Audit log for security-relevant events including logins, data access, and configuration changes.';

COMMENT ON TABLE public.rate_limit_tracking IS 
'Track API request rates to prevent abuse and DDoS attacks.';