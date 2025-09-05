-- Create work_orders table
CREATE TABLE IF NOT EXISTS public.work_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  invoice_id UUID NOT NULL,
  schedule_id UUID,
  title TEXT NOT NULL,
  service_address TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  team_id UUID,
  instructions TEXT,
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'in_progress', 'completed', 'cancelled')),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create work_order_items table
CREATE TABLE IF NOT EXISTS public.work_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  source_invoice_item_id UUID,
  kind TEXT NOT NULL CHECK (kind IN ('task', 'material', 'equipment', 'note')),
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Create work_order_reports table
CREATE TABLE IF NOT EXISTS public.work_order_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  labor_hours NUMERIC NOT NULL DEFAULT 0,
  materials_used JSONB DEFAULT '[]'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  signatures JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create work_order_tokens table for secure access
CREATE TABLE IF NOT EXISTS public.work_order_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all work order tables
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for work_orders
CREATE POLICY "Users can view own work orders" 
ON public.work_orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own work orders" 
ON public.work_orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND auth.uid() = created_by);

CREATE POLICY "Users can update own work orders" 
ON public.work_orders 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own work orders" 
ON public.work_orders 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for work_order_items
CREATE POLICY "Users can view own work order items" 
ON public.work_order_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.work_orders 
  WHERE work_orders.id = work_order_items.work_order_id 
  AND work_orders.user_id = auth.uid()
));

CREATE POLICY "Users can manage own work order items" 
ON public.work_order_items 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.work_orders 
  WHERE work_orders.id = work_order_items.work_order_id 
  AND work_orders.user_id = auth.uid()
));

-- Create RLS policies for work_order_reports
CREATE POLICY "Users can view own work order reports" 
ON public.work_order_reports 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.work_orders 
  WHERE work_orders.id = work_order_reports.work_order_id 
  AND work_orders.user_id = auth.uid()
));

CREATE POLICY "Users can manage own work order reports" 
ON public.work_order_reports 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.work_orders 
  WHERE work_orders.id = work_order_reports.work_order_id 
  AND work_orders.user_id = auth.uid()
));

-- Create RLS policies for work_order_tokens (service functions only)
CREATE POLICY "Service role only for tokens" 
ON public.work_order_tokens 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX idx_work_orders_user_id ON public.work_orders(user_id);
CREATE INDEX idx_work_orders_invoice_id ON public.work_orders(invoice_id);
CREATE INDEX idx_work_orders_status ON public.work_orders(status);
CREATE INDEX idx_work_order_items_work_order_id ON public.work_order_items(work_order_id);
CREATE INDEX idx_work_order_reports_work_order_id ON public.work_order_reports(work_order_id);
CREATE INDEX idx_work_order_tokens_token_hash ON public.work_order_tokens(token_hash);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON public.work_orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_order_reports_updated_at BEFORE UPDATE ON public.work_order_reports
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();