-- Create estimates table
CREATE TABLE public.estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  estimate_number TEXT NOT NULL,
  customer_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiration_date TIMESTAMP WITH TIME ZONE,
  
  -- Financial fields
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 13, -- Ontario HST
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  deposit_amount DECIMAL(10,2),
  deposit_percentage DECIMAL(5,2),
  
  -- Signature fields
  signature_required BOOLEAN DEFAULT true,
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_data TEXT,
  signed_by_name TEXT,
  signed_by_email TEXT,
  signature_ip TEXT,
  
  -- Conversion tracking
  converted_to_invoice BOOLEAN DEFAULT false,
  invoice_id UUID,
  
  -- Content
  scope_of_work TEXT,
  notes TEXT,
  terms_conditions TEXT,
  contract_attached BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create estimate items table
CREATE TABLE public.estimate_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES public.estimates(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  rate DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment stages table
CREATE TABLE public.payment_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES public.estimates(id) ON DELETE CASCADE,
  invoice_id UUID,
  stage_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  percentage DECIMAL(5,2),
  amount DECIMAL(10,2),
  due_date TIMESTAMP WITH TIME ZONE,
  milestone TEXT,
  status TEXT DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  estimate_id UUID REFERENCES public.estimates(id),
  invoice_number TEXT NOT NULL,
  customer_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  
  -- Financial fields
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 13,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Contract fields
  contract_attached BOOLEAN DEFAULT true,
  contract_accepted BOOLEAN DEFAULT false,
  contract_accepted_at TIMESTAMP WITH TIME ZONE,
  
  notes TEXT,
  terms_conditions TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice items table  
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  rate DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  province TEXT DEFAULT 'Ontario',
  postal_code TEXT,
  notes TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create proposals table (similar structure to estimates)
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  proposal_number TEXT NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  status TEXT NOT NULL DEFAULT 'draft',
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiration_date TIMESTAMP WITH TIME ZONE,
  
  -- Financial fields
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 13,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  deposit_amount DECIMAL(10,2),
  
  -- Signature fields
  signature_required BOOLEAN DEFAULT true,
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_data TEXT,
  signed_by_name TEXT,
  
  -- Conversion tracking
  converted_to_invoice BOOLEAN DEFAULT false,
  invoice_id UUID REFERENCES public.invoices(id),
  
  content TEXT,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create change work orders table
CREATE TABLE public.change_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id),
  order_number TEXT NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  status TEXT NOT NULL DEFAULT 'pending',
  
  -- Financial fields
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Signature fields
  signature_required BOOLEAN DEFAULT true,
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_data TEXT,
  
  description TEXT NOT NULL,
  reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase orders table
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  po_number TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  vendor_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  expected_delivery TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for estimates
CREATE POLICY "Users can view own estimates" ON public.estimates
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own estimates" ON public.estimates
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own estimates" ON public.estimates
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own estimates" ON public.estimates
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for estimate items
CREATE POLICY "Users can view own estimate items" ON public.estimate_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.estimates 
      WHERE estimates.id = estimate_items.estimate_id 
      AND estimates.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage own estimate items" ON public.estimate_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.estimates 
      WHERE estimates.id = estimate_items.estimate_id 
      AND estimates.user_id = auth.uid()
    )
  );

-- Create RLS policies for payment stages
CREATE POLICY "Users can view own payment stages" ON public.payment_stages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.estimates 
      WHERE estimates.id = payment_stages.estimate_id 
      AND estimates.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = payment_stages.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage own payment stages" ON public.payment_stages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.estimates 
      WHERE estimates.id = payment_stages.estimate_id 
      AND estimates.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = payment_stages.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

-- Create RLS policies for invoices
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own invoices" ON public.invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invoices" ON public.invoices
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invoices" ON public.invoices
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for invoice items
CREATE POLICY "Users can view own invoice items" ON public.invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage own invoice items" ON public.invoice_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

-- Create RLS policies for customers
CREATE POLICY "Users can view own customers" ON public.customers
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own customers" ON public.customers
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own customers" ON public.customers
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own customers" ON public.customers
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for proposals
CREATE POLICY "Users can manage own proposals" ON public.proposals
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for change orders
CREATE POLICY "Users can manage own change orders" ON public.change_orders
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for purchase orders
CREATE POLICY "Users can manage own purchase orders" ON public.purchase_orders
  FOR ALL USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_estimates_updated_at BEFORE UPDATE ON public.estimates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_change_orders_updated_at BEFORE UPDATE ON public.change_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();