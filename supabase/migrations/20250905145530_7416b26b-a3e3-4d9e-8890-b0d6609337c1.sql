-- Add missing columns for deposit workflow
ALTER TABLE estimates 
ADD COLUMN IF NOT EXISTS deposit_due NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS converted_invoice_id UUID REFERENCES invoices_enhanced(id);

ALTER TABLE invoices_enhanced
ADD COLUMN IF NOT EXISTS estimate_id UUID REFERENCES estimates(id),
ADD COLUMN IF NOT EXISTS deposit_paid_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS scheduling_status TEXT DEFAULT 'unscheduled' CHECK (scheduling_status IN ('unscheduled', 'proposed', 'scheduled', 'reschedule_requested', 'completed'));

ALTER TABLE invoice_payments
ADD COLUMN IF NOT EXISTS payment_type TEXT DEFAULT 'other' CHECK (payment_type IN ('deposit', 'final', 'partial', 'other'));

ALTER TABLE work_orders
ADD COLUMN IF NOT EXISTS scheduled_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS scheduled_end TIMESTAMPTZ;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_estimates_converted_invoice_id ON estimates(converted_invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_estimate_id ON invoices_enhanced(estimate_id);
CREATE INDEX IF NOT EXISTS idx_invoices_deposit_paid ON invoices_enhanced(deposit_paid_at);

-- Function to convert estimate to invoice
CREATE OR REPLACE FUNCTION public.convert_estimate_to_invoice(p_estimate_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_est RECORD;
  v_invoice_id UUID;
BEGIN
  -- Get estimate details
  SELECT * INTO v_est FROM estimates WHERE id = p_estimate_id AND user_id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Estimate not found or access denied';
  END IF;

  -- Check if already converted
  IF v_est.converted_invoice_id IS NOT NULL THEN
    RETURN v_est.converted_invoice_id;
  END IF;

  -- Create invoice from estimate
  INSERT INTO invoices_enhanced (
    user_id, customer_id, customer_name, customer_email, customer_phone,
    customer_address, customer_city, customer_postal_code, customer_province,
    service_address, service_city, service_postal_code, service_province,
    estimate_id, deposit_amount, deposit_request, status, scheduling_status,
    subtotal, tax_rate, tax_amount, total, notes, terms_conditions,
    invoice_number, issue_date, due_date
  )
  SELECT
    user_id, customer_id, 
    (SELECT first_name || ' ' || last_name FROM customers WHERE id = e.customer_id),
    (SELECT email FROM customers WHERE id = e.customer_id),
    (SELECT phone FROM customers WHERE id = e.customer_id),
    (SELECT address FROM customers WHERE id = e.customer_id),
    (SELECT city FROM customers WHERE id = e.customer_id),
    (SELECT postal_code FROM customers WHERE id = e.customer_id),
    (SELECT province FROM customers WHERE id = e.customer_id),
    service_address, service_city, service_postal_code, service_province,
    e.id, COALESCE(e.deposit_amount, e.deposit_due, 0), COALESCE(e.deposit_percentage, 0),
    'draft', 'unscheduled',
    subtotal, tax_rate, tax_amount, total, notes, terms_conditions,
    'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTR(gen_random_uuid()::text, 1, 6),
    NOW(), NOW() + INTERVAL '30 days'
  FROM estimates e
  WHERE e.id = p_estimate_id
  RETURNING id INTO v_invoice_id;

  -- Copy estimate items to invoice items
  INSERT INTO invoice_items_enhanced (
    invoice_id, item_name, description, quantity, rate, amount, tax, sort_order
  )
  SELECT
    v_invoice_id, description, description, quantity, rate, amount, 
    CASE WHEN (v_est.tax_rate > 0) THEN true ELSE false END, sort_order
  FROM estimate_items
  WHERE estimate_id = p_estimate_id;

  -- Update estimate with converted invoice ID
  UPDATE estimates
  SET converted_invoice_id = v_invoice_id,
      status = 'accepted',
      accepted_at = NOW()
  WHERE id = p_estimate_id;

  RETURN v_invoice_id;
END;
$$;

-- Function to update invoice after deposit payment
CREATE OR REPLACE FUNCTION public.process_deposit_payment(
  p_invoice_id UUID,
  p_amount NUMERIC,
  p_payment_ref TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Record the payment
  INSERT INTO invoice_payments (
    invoice_id, amount, payment_method, transaction_id, 
    payment_type, status, notes
  )
  VALUES (
    p_invoice_id, p_amount, 'card', p_payment_ref, 
    'deposit', 'completed', 'Deposit payment via Stripe'
  );

  -- Update invoice status and scheduling
  UPDATE invoices_enhanced
  SET 
    status = 'partially_paid',
    deposit_paid_at = NOW(),
    scheduling_status = 'proposed',
    paid_amount = COALESCE(paid_amount, 0) + p_amount,
    balance = total - (COALESCE(paid_amount, 0) + p_amount),
    updated_at = NOW()
  WHERE id = p_invoice_id;
END;
$$;