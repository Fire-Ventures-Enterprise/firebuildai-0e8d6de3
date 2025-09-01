-- Add company settings for payment feature flags
ALTER TABLE public.company_details 
ADD COLUMN IF NOT EXISTS payment_settings jsonb DEFAULT '{"allow_admin_collect_card": false, "allow_admin_qr_pay": false}'::jsonb;

-- Create or update the invoices_due_view for edge functions
CREATE OR REPLACE VIEW public.invoices_due_view AS
SELECT 
  i.id,
  i.invoice_number AS number,
  i.customer_email,
  'cad' as currency,
  ROUND((i.balance * 100)::numeric)::integer as due_cents,
  i.public_token
FROM public.invoices_enhanced i
WHERE i.balance > 0;

-- Grant access to the view
GRANT SELECT ON public.invoices_due_view TO authenticated;
GRANT SELECT ON public.invoices_due_view TO service_role;

-- Create function to record invoice card payment from webhook
CREATE OR REPLACE FUNCTION public.record_invoice_card_payment(
  p_invoice_id uuid,
  p_amount_cents bigint,
  p_provider text,
  p_reference text
) RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path=public 
AS $$
BEGIN
  -- Insert payment record
  INSERT INTO invoice_payments(invoice_id, amount, payment_method, transaction_id, notes)
  VALUES (
    p_invoice_id, 
    (p_amount_cents::numeric/100.0), 
    'card', 
    p_reference,
    'Payment via ' || p_provider
  );
  
  -- Update invoice status if fully paid
  UPDATE invoices_enhanced 
  SET 
    status = CASE 
      WHEN balance <= 0 THEN 'paid'
      WHEN paid_amount > 0 THEN 'partially_paid'
      ELSE status
    END,
    updated_at = now()
  WHERE id = p_invoice_id;
END $$;