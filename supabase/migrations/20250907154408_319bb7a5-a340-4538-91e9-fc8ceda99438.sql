-- Xactimate Integration Tables

-- Main estimates table
CREATE TABLE public.xactimate_estimates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  claim_number TEXT,
  insured_name TEXT,
  adjuster_id TEXT,
  adjuster_email TEXT,
  adjuster_phone TEXT,
  carrier_name TEXT,
  date_of_loss TIMESTAMP WITH TIME ZONE,
  cause_of_loss TEXT,
  property_address TEXT,
  property_city TEXT,
  property_state TEXT,
  property_postal_code TEXT,
  total_rcv DECIMAL(12,2),
  total_acv DECIMAL(12,2),
  deductible DECIMAL(12,2),
  depreciation DECIMAL(12,2),
  overhead_profit DECIMAL(12,2),
  original_file_url TEXT,
  original_file_name TEXT,
  estimate_data JSONB,
  import_status TEXT DEFAULT 'pending' CHECK (import_status IN ('pending', 'processing', 'completed', 'failed')),
  imported_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Line items from Xactimate estimates
CREATE TABLE public.xactimate_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID NOT NULL REFERENCES public.xactimate_estimates(id) ON DELETE CASCADE,
  work_order_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
  xactimate_code TEXT,
  category TEXT,
  selector TEXT,
  description TEXT,
  long_description TEXT,
  quantity DECIMAL(10,2),
  unit TEXT,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(12,2),
  tax_amount DECIMAL(10,2),
  rcv_total DECIMAL(12,2),
  acv_total DECIMAL(12,2),
  depreciation_amount DECIMAL(10,2),
  line_item_type TEXT,
  trade TEXT,
  room_name TEXT,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  actual_cost DECIMAL(12,2),
  completion_percentage INTEGER DEFAULT 0,
  completion_date TIMESTAMP WITH TIME ZONE,
  assigned_contractor_id UUID,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Photo documentation linked to line items
CREATE TABLE public.xactimate_photo_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  line_item_id UUID NOT NULL REFERENCES public.xactimate_line_items(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_caption TEXT,
  stage TEXT DEFAULT 'documentation' CHECK (stage IN ('before', 'during', 'after', 'documentation')),
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sync and import logs
CREATE TABLE public.xactimate_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  estimate_id UUID REFERENCES public.xactimate_estimates(id) ON DELETE CASCADE,
  sync_type TEXT CHECK (sync_type IN ('import', 'export', 'progress_update', 'photo_sync')),
  sync_direction TEXT CHECK (sync_direction IN ('inbound', 'outbound')),
  status TEXT CHECK (status IN ('success', 'failed', 'pending', 'partial')),
  details JSONB,
  error_message TEXT,
  items_synced INTEGER,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Change orders for Xactimate estimates
CREATE TABLE public.xactimate_change_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID NOT NULL REFERENCES public.xactimate_estimates(id) ON DELETE CASCADE,
  change_order_number TEXT,
  description TEXT,
  reason TEXT,
  total_amount DECIMAL(12,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'rejected')),
  submitted_date TIMESTAMP WITH TIME ZONE,
  approved_date TIMESTAMP WITH TIME ZONE,
  approved_by TEXT,
  line_items JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trade assignments for contractors
CREATE TABLE public.xactimate_trade_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID NOT NULL REFERENCES public.xactimate_estimates(id) ON DELETE CASCADE,
  trade_name TEXT NOT NULL,
  contractor_id UUID REFERENCES auth.users(id),
  estimated_cost DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  assigned_line_items INTEGER,
  completed_line_items INTEGER,
  status TEXT DEFAULT 'not_assigned' CHECK (status IN ('not_assigned', 'assigned', 'in_progress', 'completed')),
  assigned_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Progress reports for insurance adjusters
CREATE TABLE public.xactimate_progress_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID NOT NULL REFERENCES public.xactimate_estimates(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  overall_completion_percentage INTEGER,
  trades_progress JSONB,
  cost_variance DECIMAL(12,2),
  notes TEXT,
  photos_count INTEGER,
  generated_by UUID REFERENCES auth.users(id),
  sent_to_adjuster BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_xactimate_estimates_user_id ON public.xactimate_estimates(user_id);
CREATE INDEX idx_xactimate_estimates_project_id ON public.xactimate_estimates(project_id);
CREATE INDEX idx_xactimate_estimates_claim_number ON public.xactimate_estimates(claim_number);
CREATE INDEX idx_xactimate_line_items_estimate_id ON public.xactimate_line_items(estimate_id);
CREATE INDEX idx_xactimate_line_items_trade ON public.xactimate_line_items(trade);
CREATE INDEX idx_xactimate_line_items_status ON public.xactimate_line_items(status);
CREATE INDEX idx_xactimate_photo_links_line_item_id ON public.xactimate_photo_links(line_item_id);
CREATE INDEX idx_xactimate_trade_assignments_estimate_id ON public.xactimate_trade_assignments(estimate_id);
CREATE INDEX idx_xactimate_trade_assignments_contractor_id ON public.xactimate_trade_assignments(contractor_id);

-- Enable Row Level Security
ALTER TABLE public.xactimate_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xactimate_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xactimate_photo_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xactimate_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xactimate_change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xactimate_trade_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xactimate_progress_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for xactimate_estimates
CREATE POLICY "Users can view own xactimate estimates" ON public.xactimate_estimates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own xactimate estimates" ON public.xactimate_estimates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own xactimate estimates" ON public.xactimate_estimates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own xactimate estimates" ON public.xactimate_estimates
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for xactimate_line_items
CREATE POLICY "Users can view own xactimate line items" ON public.xactimate_line_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.xactimate_estimates
      WHERE xactimate_estimates.id = xactimate_line_items.estimate_id
      AND xactimate_estimates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own xactimate line items" ON public.xactimate_line_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.xactimate_estimates
      WHERE xactimate_estimates.id = xactimate_line_items.estimate_id
      AND xactimate_estimates.user_id = auth.uid()
    )
  );

-- RLS Policies for xactimate_photo_links
CREATE POLICY "Users can view related photos" ON public.xactimate_photo_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.xactimate_line_items
      JOIN public.xactimate_estimates ON xactimate_estimates.id = xactimate_line_items.estimate_id
      WHERE xactimate_line_items.id = xactimate_photo_links.line_item_id
      AND xactimate_estimates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload photos to their line items" ON public.xactimate_photo_links
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.xactimate_line_items
      JOIN public.xactimate_estimates ON xactimate_estimates.id = xactimate_line_items.estimate_id
      WHERE xactimate_line_items.id = xactimate_photo_links.line_item_id
      AND xactimate_estimates.user_id = auth.uid()
    )
  );

-- RLS Policies for other tables
CREATE POLICY "Users can view own sync logs" ON public.xactimate_sync_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sync logs" ON public.xactimate_sync_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own change orders" ON public.xactimate_change_orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.xactimate_estimates
      WHERE xactimate_estimates.id = xactimate_change_orders.estimate_id
      AND xactimate_estimates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own trade assignments" ON public.xactimate_trade_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.xactimate_estimates
      WHERE xactimate_estimates.id = xactimate_trade_assignments.estimate_id
      AND xactimate_estimates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own progress reports" ON public.xactimate_progress_reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.xactimate_estimates
      WHERE xactimate_estimates.id = xactimate_progress_reports.estimate_id
      AND xactimate_estimates.user_id = auth.uid()
    )
  );

-- Create update trigger function
CREATE OR REPLACE FUNCTION public.update_xactimate_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers for updated_at
CREATE TRIGGER update_xactimate_estimates_updated_at
    BEFORE UPDATE ON public.xactimate_estimates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_xactimate_updated_at();

CREATE TRIGGER update_xactimate_line_items_updated_at
    BEFORE UPDATE ON public.xactimate_line_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_xactimate_updated_at();

CREATE TRIGGER update_xactimate_change_orders_updated_at
    BEFORE UPDATE ON public.xactimate_change_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_xactimate_updated_at();

CREATE TRIGGER update_xactimate_trade_assignments_updated_at
    BEFORE UPDATE ON public.xactimate_trade_assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_xactimate_updated_at();