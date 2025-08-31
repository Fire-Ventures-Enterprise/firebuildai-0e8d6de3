-- Create expense categories table
CREATE TABLE IF NOT EXISTS public.expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  is_mileage BOOLEAN NOT NULL DEFAULT false,
  is_fuel BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, slug)
);

-- Create expenses table with comprehensive tracking
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  category_id UUID NOT NULL REFERENCES public.expense_categories(id),
  vendor_id UUID REFERENCES public.vendors(id),
  po_id UUID REFERENCES public.purchase_orders(id),
  job_locked BOOLEAN NOT NULL DEFAULT false,
  
  txn_date DATE NOT NULL DEFAULT CURRENT_DATE,
  currency TEXT NOT NULL DEFAULT 'CAD',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) GENERATED ALWAYS AS (subtotal + tax) STORED,
  payment_method TEXT CHECK (payment_method IN ('card','etransfer','cash','cheque','ach','other')),
  paid_at TIMESTAMPTZ,
  notes TEXT,
  
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved','reimbursed','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create expense receipts table for OCR processing
CREATE TABLE IF NOT EXISTS public.expense_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  mime TEXT NOT NULL,
  ocr_json JSONB,
  parsed JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create expense job allocations table
CREATE TABLE IF NOT EXISTS public.expense_job_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  percent NUMERIC(6,3) CHECK (percent >= 0 AND percent <= 100),
  amount NUMERIC(12,2),
  cost_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(expense_id, job_id, cost_code)
);

-- Create mileage logs table
CREATE TABLE IF NOT EXISTS public.mileage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  vehicle_name TEXT,
  start_odometer NUMERIC(10,1),
  end_odometer NUMERIC(10,1),
  distance_km NUMERIC(10,2),
  rate_per_km NUMERIC(8,4) NOT NULL DEFAULT 0.68,
  amount NUMERIC(12,2) GENERATED ALWAYS AS (distance_km * rate_per_km) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_job_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mileage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for expense_categories
CREATE POLICY "Users can view own expense categories" ON public.expense_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own expense categories" ON public.expense_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expense categories" ON public.expense_categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expense categories" ON public.expense_categories
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for expenses
CREATE POLICY "Users can view own expenses" ON public.expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own expenses" ON public.expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() = created_by);

CREATE POLICY "Users can update own expenses" ON public.expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses" ON public.expenses
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for expense_receipts
CREATE POLICY "Users can view own expense receipts" ON public.expense_receipts
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.expenses 
    WHERE expenses.id = expense_receipts.expense_id 
    AND expenses.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own expense receipts" ON public.expense_receipts
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.expenses 
    WHERE expenses.id = expense_receipts.expense_id 
    AND expenses.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own expense receipts" ON public.expense_receipts
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.expenses 
    WHERE expenses.id = expense_receipts.expense_id 
    AND expenses.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own expense receipts" ON public.expense_receipts
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.expenses 
    WHERE expenses.id = expense_receipts.expense_id 
    AND expenses.user_id = auth.uid()
  ));

-- RLS Policies for expense_job_allocations
CREATE POLICY "Users can view own expense allocations" ON public.expense_job_allocations
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.expenses 
    WHERE expenses.id = expense_job_allocations.expense_id 
    AND expenses.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own expense allocations" ON public.expense_job_allocations
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.expenses 
    WHERE expenses.id = expense_job_allocations.expense_id 
    AND expenses.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own expense allocations" ON public.expense_job_allocations
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.expenses 
    WHERE expenses.id = expense_job_allocations.expense_id 
    AND expenses.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own expense allocations" ON public.expense_job_allocations
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.expenses 
    WHERE expenses.id = expense_job_allocations.expense_id 
    AND expenses.user_id = auth.uid()
  ));

-- RLS Policies for mileage_logs
CREATE POLICY "Users can view own mileage logs" ON public.mileage_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.expenses 
    WHERE expenses.id = mileage_logs.expense_id 
    AND expenses.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own mileage logs" ON public.mileage_logs
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.expenses 
    WHERE expenses.id = mileage_logs.expense_id 
    AND expenses.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own mileage logs" ON public.mileage_logs
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.expenses 
    WHERE expenses.id = mileage_logs.expense_id 
    AND expenses.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own mileage logs" ON public.mileage_logs
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.expenses 
    WHERE expenses.id = mileage_logs.expense_id 
    AND expenses.user_id = auth.uid()
  ));

-- Create update timestamp triggers
CREATE TRIGGER update_expense_categories_updated_at
  BEFORE UPDATE ON public.expense_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for receipts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for receipts bucket
CREATE POLICY "Users can upload own receipts" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'receipts' AND 
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "Users can view own receipts" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'receipts' AND 
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "Users can update own receipts" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'receipts' AND 
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "Users can delete own receipts" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'receipts' AND 
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Insert default expense categories for each user (will be done in application code)
-- This function helps seed categories for new users
CREATE OR REPLACE FUNCTION public.seed_expense_categories_for_user(p_user_id UUID)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;