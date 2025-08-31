-- Create purchase_order_items table
CREATE TABLE public.purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  rate NUMERIC NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create expenses table for tracking all costs
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  invoice_id UUID,
  purchase_order_id UUID,
  category TEXT NOT NULL CHECK (category IN ('materials', 'labor', 'subcontractor', 'permits', 'equipment', 'other')),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  vendor TEXT,
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add columns to purchase_orders table for invoice linking
ALTER TABLE public.purchase_orders 
ADD COLUMN invoice_id UUID,
ADD COLUMN category TEXT DEFAULT 'materials',
ADD COLUMN paid_amount NUMERIC DEFAULT 0,
ADD COLUMN payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid'));

-- Add profit tracking columns to invoices_enhanced
ALTER TABLE public.invoices_enhanced
ADD COLUMN total_expenses NUMERIC DEFAULT 0,
ADD COLUMN gross_profit NUMERIC DEFAULT 0,
ADD COLUMN profit_margin NUMERIC DEFAULT 0,
ADD COLUMN overhead_percentage NUMERIC DEFAULT 10,
ADD COLUMN net_profit NUMERIC DEFAULT 0;

-- Enable RLS on new tables
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for purchase_order_items
CREATE POLICY "Users can manage own PO items" ON public.purchase_order_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.purchase_orders
    WHERE purchase_orders.id = purchase_order_items.purchase_order_id
    AND purchase_orders.user_id = auth.uid()
  )
);

-- RLS Policies for expenses
CREATE POLICY "Users can create own expenses" ON public.expenses
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own expenses" ON public.expenses
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses" ON public.expenses
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses" ON public.expenses
FOR DELETE USING (auth.uid() = user_id);

-- Create function to calculate invoice profit
CREATE OR REPLACE FUNCTION public.calculate_invoice_profit()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate total expenses for the invoice
  NEW.total_expenses := COALESCE((
    SELECT SUM(amount) 
    FROM public.expenses 
    WHERE invoice_id = NEW.id
  ), 0);
  
  -- Calculate gross profit
  NEW.gross_profit := NEW.total - NEW.total_expenses;
  
  -- Calculate profit margin (as percentage)
  IF NEW.total > 0 THEN
    NEW.profit_margin := ROUND((NEW.gross_profit / NEW.total * 100)::numeric, 2);
  ELSE
    NEW.profit_margin := 0;
  END IF;
  
  -- Calculate net profit (after overhead)
  NEW.net_profit := NEW.gross_profit - (NEW.total * NEW.overhead_percentage / 100);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate profit when invoice or expenses change
CREATE TRIGGER calculate_profit_on_invoice_change
BEFORE INSERT OR UPDATE ON public.invoices_enhanced
FOR EACH ROW EXECUTE FUNCTION public.calculate_invoice_profit();

-- Create function to update invoice profit when expenses change
CREATE OR REPLACE FUNCTION public.update_invoice_profit_on_expense_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the related invoice's profit calculations
  IF NEW.invoice_id IS NOT NULL THEN
    UPDATE public.invoices_enhanced
    SET updated_at = now()
    WHERE id = NEW.invoice_id;
  END IF;
  
  -- If updating, also check old invoice_id
  IF TG_OP = 'UPDATE' AND OLD.invoice_id IS NOT NULL AND OLD.invoice_id != NEW.invoice_id THEN
    UPDATE public.invoices_enhanced
    SET updated_at = now()
    WHERE id = OLD.invoice_id;
  END IF;
  
  -- If deleting, update the old invoice
  IF TG_OP = 'DELETE' AND OLD.invoice_id IS NOT NULL THEN
    UPDATE public.invoices_enhanced
    SET updated_at = now()
    WHERE id = OLD.invoice_id;
    RETURN OLD;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for expense changes
CREATE TRIGGER update_invoice_on_expense_change
AFTER INSERT OR UPDATE OR DELETE ON public.expenses
FOR EACH ROW EXECUTE FUNCTION public.update_invoice_profit_on_expense_change();

-- Create indexes for better performance
CREATE INDEX idx_expenses_invoice_id ON public.expenses(invoice_id);
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_purchase_orders_invoice_id ON public.purchase_orders(invoice_id);
CREATE INDEX idx_purchase_order_items_po_id ON public.purchase_order_items(purchase_order_id);