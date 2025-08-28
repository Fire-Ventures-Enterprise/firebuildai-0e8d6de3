-- Create payment history table for tracking invoice payments
CREATE TABLE public.invoice_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices_enhanced(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- 'stripe', 'paypal', 'cash', 'check', 'credit_card', 'e-transfer'
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  transaction_id TEXT, -- Stripe or PayPal transaction ID
  status TEXT NOT NULL DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view payments for their invoices" 
ON public.invoice_payments 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.invoices_enhanced 
  WHERE invoices_enhanced.id = invoice_payments.invoice_id 
  AND invoices_enhanced.user_id = auth.uid()
));

CREATE POLICY "Users can create payments for their invoices" 
ON public.invoice_payments 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.invoices_enhanced 
  WHERE invoices_enhanced.id = invoice_payments.invoice_id 
  AND invoices_enhanced.user_id = auth.uid()
));

CREATE POLICY "Users can update payments for their invoices" 
ON public.invoice_payments 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.invoices_enhanced 
  WHERE invoices_enhanced.id = invoice_payments.invoice_id 
  AND invoices_enhanced.user_id = auth.uid()
));

-- Create index for performance
CREATE INDEX idx_invoice_payments_invoice_id ON public.invoice_payments(invoice_id);
CREATE INDEX idx_invoice_payments_payment_date ON public.invoice_payments(payment_date);

-- Create function to automatically update invoice balance when payment is made
CREATE OR REPLACE FUNCTION public.update_invoice_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the invoice's paid_amount and balance
  UPDATE public.invoices_enhanced
  SET 
    paid_amount = COALESCE((
      SELECT SUM(amount) 
      FROM public.invoice_payments 
      WHERE invoice_id = NEW.invoice_id 
      AND status = 'completed'
    ), 0),
    balance = total - COALESCE((
      SELECT SUM(amount) 
      FROM public.invoice_payments 
      WHERE invoice_id = NEW.invoice_id 
      AND status = 'completed'
    ), 0),
    status = CASE 
      WHEN total <= COALESCE((
        SELECT SUM(amount) 
        FROM public.invoice_payments 
        WHERE invoice_id = NEW.invoice_id 
        AND status = 'completed'
      ), 0) THEN 'paid'
      WHEN COALESCE((
        SELECT SUM(amount) 
        FROM public.invoice_payments 
        WHERE invoice_id = NEW.invoice_id 
        AND status = 'completed'
      ), 0) > 0 THEN 'partially_paid'
      ELSE status
    END,
    updated_at = now()
  WHERE id = NEW.invoice_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update invoice balance on payment insert or update
CREATE TRIGGER update_invoice_on_payment
AFTER INSERT OR UPDATE ON public.invoice_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_invoice_balance();

-- Add partially_paid status to invoices if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'partially_paid' 
    AND enumtypid = (
      SELECT oid FROM pg_type WHERE typname = 'invoice_status'
    )
  ) THEN
    -- Since we're using TEXT for status, we don't need to alter enum
    -- Just document that 'partially_paid' is a valid status
    NULL;
  END IF;
END $$;