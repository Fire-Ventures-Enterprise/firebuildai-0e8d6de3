-- Create enhanced invoices table
CREATE TABLE IF NOT EXISTS public.invoices_enhanced (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL,
  po_number TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  
  -- Dates
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  days_to_payment INTEGER DEFAULT 30,
  
  -- Customer Info  
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  customer_city TEXT,
  customer_province TEXT DEFAULT 'Ontario',
  customer_postal_code TEXT,
  
  -- Financial
  subtotal NUMERIC NOT NULL DEFAULT 0,
  markup_total NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  discount_type TEXT,
  discount_amount NUMERIC DEFAULT 0,
  deposit_request NUMERIC DEFAULT 0,
  deposit_type TEXT,
  deposit_amount NUMERIC DEFAULT 0,
  tax_rate NUMERIC DEFAULT 13,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  balance NUMERIC DEFAULT 0,
  
  -- Payment
  accept_online_payments BOOLEAN DEFAULT true,
  cover_processing_fee BOOLEAN DEFAULT false,
  
  -- Contract & Signatures
  contract_required BOOLEAN DEFAULT false,
  contract_url TEXT,
  contract_text TEXT,
  
  -- Notes
  notes TEXT,
  private_notes TEXT,
  
  -- Metadata
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice items table
CREATE TABLE IF NOT EXISTS public.invoice_items_enhanced (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices_enhanced(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity NUMERIC NOT NULL DEFAULT 1,
  rate NUMERIC NOT NULL,
  markup NUMERIC DEFAULT 0,
  markup_type TEXT,
  markup_amount NUMERIC DEFAULT 0,
  tax BOOLEAN DEFAULT true,
  amount NUMERIC NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment schedule table
CREATE TABLE IF NOT EXISTS public.invoice_payment_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices_enhanced(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  percentage NUMERIC,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  paid_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice photos table
CREATE TABLE IF NOT EXISTS public.invoice_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices_enhanced(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice attachments table
CREATE TABLE IF NOT EXISTS public.invoice_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices_enhanced(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT,
  size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice signatures table
CREATE TABLE IF NOT EXISTS public.invoice_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices_enhanced(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('client', 'company')),
  name TEXT NOT NULL,
  signature_data TEXT,
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address TEXT
);

-- Enable RLS
ALTER TABLE public.invoices_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_payment_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_signatures ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invoices
CREATE POLICY "Users can view own invoices" ON public.invoices_enhanced
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own invoices" ON public.invoices_enhanced
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON public.invoices_enhanced
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices" ON public.invoices_enhanced
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for invoice items
CREATE POLICY "Users can manage own invoice items" ON public.invoice_items_enhanced
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invoices_enhanced 
      WHERE id = invoice_items_enhanced.invoice_id 
      AND user_id = auth.uid()
    )
  );

-- Create RLS policies for payment schedule
CREATE POLICY "Users can manage own payment schedules" ON public.invoice_payment_schedule
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invoices_enhanced 
      WHERE id = invoice_payment_schedule.invoice_id 
      AND user_id = auth.uid()
    )
  );

-- Create RLS policies for photos
CREATE POLICY "Users can manage own invoice photos" ON public.invoice_photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invoices_enhanced 
      WHERE id = invoice_photos.invoice_id 
      AND user_id = auth.uid()
    )
  );

-- Create RLS policies for attachments
CREATE POLICY "Users can manage own invoice attachments" ON public.invoice_attachments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invoices_enhanced 
      WHERE id = invoice_attachments.invoice_id 
      AND user_id = auth.uid()
    )
  );

-- Create RLS policies for signatures
CREATE POLICY "Users can manage own invoice signatures" ON public.invoice_signatures
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invoices_enhanced 
      WHERE id = invoice_signatures.invoice_id 
      AND user_id = auth.uid()
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_invoices_enhanced_updated_at
  BEFORE UPDATE ON public.invoices_enhanced
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();