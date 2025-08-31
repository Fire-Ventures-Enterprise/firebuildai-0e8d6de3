-- Create estimates table
CREATE TABLE public.estimates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  estimate_number TEXT UNIQUE,
  client_id UUID REFERENCES public.customers(id),
  job_id UUID REFERENCES public.jobs(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired')),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  scope TEXT,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  deposit_required NUMERIC(10,2),
  notes TEXT,
  contract_title TEXT,
  contract_text TEXT,
  signature_data TEXT,
  signed_by_name TEXT,
  signed_by_email TEXT,
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create estimate items table
CREATE TABLE public.estimate_items_new (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 13,
  line_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices enhanced table (extending existing)
ALTER TABLE public.invoices_enhanced 
ADD COLUMN IF NOT EXISTS estimate_id UUID REFERENCES public.estimates(id),
ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES public.jobs(id);

-- Create invoice payments table
CREATE TABLE IF NOT EXISTS public.invoice_payments_new (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices_enhanced(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT,
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reference TEXT,
  receipt_url TEXT,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Auto-numbering for estimates
CREATE SEQUENCE IF NOT EXISTS estimate_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_estimate_number()
RETURNS TEXT AS $$
DECLARE
  current_year TEXT;
  seq_num TEXT;
BEGIN
  current_year := TO_CHAR(NOW(), 'YYYY');
  seq_num := LPAD(nextval('estimate_number_seq')::TEXT, 4, '0');
  RETURN 'EST-' || current_year || '-' || seq_num;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_estimate_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.estimate_number IS NULL THEN
    NEW.estimate_number := generate_estimate_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_estimate_number_trigger
BEFORE INSERT ON public.estimates
FOR EACH ROW
EXECUTE FUNCTION set_estimate_number();

-- Calculate estimate totals trigger
CREATE OR REPLACE FUNCTION calculate_estimate_totals()
RETURNS TRIGGER AS $$
DECLARE
  v_subtotal NUMERIC;
  v_tax NUMERIC;
BEGIN
  -- Calculate subtotal from items
  SELECT COALESCE(SUM(line_total), 0) INTO v_subtotal
  FROM public.estimate_items_new
  WHERE estimate_id = NEW.id;
  
  -- Calculate tax (13% default)
  v_tax := v_subtotal * 0.13;
  
  -- Update the estimate
  UPDATE public.estimates
  SET 
    subtotal = v_subtotal,
    tax_amount = v_tax,
    total = v_subtotal + v_tax,
    updated_at = now()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calculate line totals for estimate items
CREATE OR REPLACE FUNCTION calculate_estimate_item_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.line_total := NEW.quantity * NEW.unit_price;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_estimate_item_total_trigger
BEFORE INSERT OR UPDATE ON public.estimate_items_new
FOR EACH ROW
EXECUTE FUNCTION calculate_estimate_item_total();

CREATE TRIGGER update_estimate_totals_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.estimate_items_new
FOR EACH ROW
EXECUTE FUNCTION calculate_estimate_totals();

-- Update invoice status based on payments
CREATE OR REPLACE FUNCTION update_invoice_payment_status()
RETURNS TRIGGER AS $$
DECLARE
  v_total NUMERIC;
  v_paid NUMERIC;
  v_status TEXT;
BEGIN
  -- Get invoice total
  SELECT total INTO v_total
  FROM public.invoices_enhanced
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  -- Get total paid
  SELECT COALESCE(SUM(amount), 0) INTO v_paid
  FROM public.invoice_payments_new
  WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  -- Determine status
  IF v_paid <= 0 THEN
    v_status := 'sent';
  ELSIF v_paid < v_total THEN
    v_status := 'partially_paid';
  ELSE
    v_status := 'paid';
  END IF;
  
  -- Update invoice
  UPDATE public.invoices_enhanced
  SET 
    status = v_status,
    paid_amount = v_paid,
    balance = v_total - v_paid,
    updated_at = now()
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_invoice_payment_status
AFTER INSERT OR UPDATE OR DELETE ON public.invoice_payments_new
FOR EACH ROW
EXECUTE FUNCTION update_invoice_payment_status();

-- Enable RLS
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_items_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_payments_new ENABLE ROW LEVEL SECURITY;

-- RLS Policies for estimates
CREATE POLICY "Users can view own estimates" ON public.estimates
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own estimates" ON public.estimates
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own estimates" ON public.estimates
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own estimates" ON public.estimates
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for estimate items
CREATE POLICY "Users can view own estimate items" ON public.estimate_items_new
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.estimates
    WHERE estimates.id = estimate_items_new.estimate_id
    AND estimates.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage own estimate items" ON public.estimate_items_new
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.estimates
    WHERE estimates.id = estimate_items_new.estimate_id
    AND estimates.user_id = auth.uid()
  )
);

-- RLS Policies for invoice payments
CREATE POLICY "Users can view own invoice payments" ON public.invoice_payments_new
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.invoices_enhanced
    WHERE invoices_enhanced.id = invoice_payments_new.invoice_id
    AND invoices_enhanced.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage own invoice payments" ON public.invoice_payments_new
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.invoices_enhanced
    WHERE invoices_enhanced.id = invoice_payments_new.invoice_id
    AND invoices_enhanced.user_id = auth.uid()
  )
);

-- Update timestamps trigger
CREATE TRIGGER update_estimates_updated_at
BEFORE UPDATE ON public.estimates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_payments_updated_at
BEFORE UPDATE ON public.invoice_payments_new
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();