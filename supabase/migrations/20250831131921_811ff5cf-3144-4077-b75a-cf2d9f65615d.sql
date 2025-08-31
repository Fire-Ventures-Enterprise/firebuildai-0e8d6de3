-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  province TEXT DEFAULT 'Ontario',
  postal_code TEXT,
  payment_terms TEXT DEFAULT 'Net 30',
  tax_rate NUMERIC DEFAULT 13,
  default_category TEXT DEFAULT 'materials',
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vendors
CREATE POLICY "Users can manage own vendors" 
ON public.vendors 
FOR ALL 
USING (auth.uid() = user_id);

-- Add new columns to purchase_orders table
ALTER TABLE public.purchase_orders 
ADD COLUMN vendor_id UUID REFERENCES public.vendors(id),
ADD COLUMN job_id UUID,
ADD COLUMN payment_method TEXT DEFAULT 'pending',
ADD COLUMN due_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN payment_terms TEXT DEFAULT 'Net 30',
ADD COLUMN approval_status TEXT DEFAULT 'draft' CHECK (approval_status IN ('draft', 'submitted', 'approved', 'rejected', 'closed')),
ADD COLUMN approved_by TEXT,
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;

-- Create PO sequence for auto-numbering
CREATE SEQUENCE IF NOT EXISTS po_number_seq START 1;

-- Function to generate PO number
CREATE OR REPLACE FUNCTION generate_po_number()
RETURNS TEXT AS $$
DECLARE
  current_year TEXT;
  seq_num TEXT;
BEGIN
  current_year := TO_CHAR(NOW(), 'YYYY');
  seq_num := LPAD(nextval('po_number_seq')::TEXT, 5, '0');
  RETURN 'PO-' || current_year || '-' || seq_num;
END;
$$ LANGUAGE plpgsql;

-- Update PO number generation trigger
CREATE OR REPLACE FUNCTION set_po_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.po_number IS NULL THEN
    NEW.po_number := generate_po_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_po_number_trigger
BEFORE INSERT ON public.purchase_orders
FOR EACH ROW
EXECUTE FUNCTION set_po_number();

-- Create index for performance
CREATE INDEX idx_purchase_orders_vendor_id ON public.purchase_orders(vendor_id);
CREATE INDEX idx_purchase_orders_job_id ON public.purchase_orders(job_id);
CREATE INDEX idx_purchase_orders_approval_status ON public.purchase_orders(approval_status);
CREATE INDEX idx_vendors_user_id ON public.vendors(user_id);

-- Add trigger to update updated_at for vendors
CREATE TRIGGER update_vendors_updated_at
BEFORE UPDATE ON public.vendors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();