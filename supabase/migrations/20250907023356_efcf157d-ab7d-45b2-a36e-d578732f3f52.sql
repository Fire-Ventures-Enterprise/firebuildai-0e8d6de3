-- Xactimate Integration Tables for FireBuildAI

-- Xactimate Estimates
CREATE TABLE public.xactimate_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    claim_number VARCHAR(100),
    insured_name VARCHAR(255),
    adjuster_id VARCHAR(100),
    adjuster_email TEXT,
    adjuster_phone TEXT,
    carrier_name VARCHAR(255),
    date_of_loss DATE,
    cause_of_loss TEXT,
    property_address TEXT,
    property_city TEXT,
    property_state VARCHAR(50),
    property_postal_code VARCHAR(20),
    total_rcv DECIMAL(12,2),
    total_acv DECIMAL(12,2),
    deductible DECIMAL(12,2),
    depreciation DECIMAL(12,2),
    overhead_profit DECIMAL(12,2),
    original_file_url TEXT,
    original_file_name TEXT,
    estimate_data JSONB,
    import_status VARCHAR(50) DEFAULT 'pending',
    imported_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Xactimate Line Items
CREATE TABLE public.xactimate_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estimate_id UUID NOT NULL REFERENCES public.xactimate_estimates(id) ON DELETE CASCADE,
    work_order_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
    xactimate_code VARCHAR(20),
    category VARCHAR(100),
    selector VARCHAR(100),
    description TEXT,
    long_description TEXT,
    quantity DECIMAL(10,2),
    unit VARCHAR(50),
    unit_price DECIMAL(10,2),
    total_price DECIMAL(12,2),
    tax_amount DECIMAL(10,2),
    rcv_total DECIMAL(12,2),
    acv_total DECIMAL(12,2),
    depreciation_amount DECIMAL(10,2),
    line_item_type VARCHAR(50),
    trade VARCHAR(100),
    room_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'not_started',
    actual_cost DECIMAL(12,2),
    completion_percentage INTEGER DEFAULT 0,
    completion_date DATE,
    assigned_contractor_id UUID REFERENCES public.customers(id),
    notes TEXT,
    sort_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Xactimate Photo Links
CREATE TABLE public.xactimate_photo_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    line_item_id UUID NOT NULL REFERENCES public.xactimate_line_items(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    photo_caption TEXT,
    stage VARCHAR(20) NOT NULL CHECK (stage IN ('before', 'during', 'after', 'documentation')),
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Xactimate Sync Log
CREATE TABLE public.xactimate_sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    estimate_id UUID REFERENCES public.xactimate_estimates(id) ON DELETE SET NULL,
    sync_type VARCHAR(50), -- 'import', 'export', 'progress_update', 'photo_sync'
    sync_direction VARCHAR(20), -- 'inbound', 'outbound'
    status VARCHAR(20), -- 'success', 'failed', 'pending', 'partial'
    details JSONB,
    error_message TEXT,
    items_synced INTEGER,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Xactimate Change Orders
CREATE TABLE public.xactimate_change_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estimate_id UUID NOT NULL REFERENCES public.xactimate_estimates(id),
    change_order_number VARCHAR(50),
    description TEXT,
    reason TEXT,
    total_amount DECIMAL(12,2),
    status VARCHAR(50) DEFAULT 'pending',
    submitted_date DATE,
    approved_date DATE,
    approved_by VARCHAR(255),
    line_items JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Xactimate Trade Assignments
CREATE TABLE public.xactimate_trade_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estimate_id UUID NOT NULL REFERENCES public.xactimate_estimates(id),
    trade_name VARCHAR(100) NOT NULL,
    contractor_id UUID REFERENCES public.customers(id),
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    assigned_line_items INTEGER,
    completed_line_items INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'not_assigned',
    assigned_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Xactimate Progress Reports
CREATE TABLE public.xactimate_progress_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estimate_id UUID NOT NULL REFERENCES public.xactimate_estimates(id),
    report_date DATE NOT NULL,
    overall_completion_percentage INTEGER DEFAULT 0,
    trades_progress JSONB,
    cost_variance DECIMAL(12,2),
    notes TEXT,
    photos_count INTEGER DEFAULT 0,
    generated_by UUID REFERENCES auth.users(id),
    sent_to_adjuster BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_xactimate_estimates_user_id ON public.xactimate_estimates(user_id);
CREATE INDEX idx_xactimate_estimates_claim_number ON public.xactimate_estimates(claim_number);
CREATE INDEX idx_xactimate_estimates_project_id ON public.xactimate_estimates(project_id);
CREATE INDEX idx_xactimate_line_items_estimate_id ON public.xactimate_line_items(estimate_id);
CREATE INDEX idx_xactimate_line_items_code ON public.xactimate_line_items(xactimate_code);
CREATE INDEX idx_xactimate_line_items_trade ON public.xactimate_line_items(trade);
CREATE INDEX idx_xactimate_line_items_status ON public.xactimate_line_items(status);
CREATE INDEX idx_xactimate_photo_links_line_item ON public.xactimate_photo_links(line_item_id);
CREATE INDEX idx_xactimate_sync_log_estimate ON public.xactimate_sync_log(estimate_id);
CREATE INDEX idx_xactimate_trade_assignments_estimate ON public.xactimate_trade_assignments(estimate_id);

-- Enable RLS
ALTER TABLE public.xactimate_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xactimate_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xactimate_photo_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xactimate_sync_log ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY "Users can view photos for their estimates" ON public.xactimate_photo_links
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.xactimate_line_items li
            JOIN public.xactimate_estimates e ON e.id = li.estimate_id
            WHERE li.id = xactimate_photo_links.line_item_id
            AND e.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage photos for their estimates" ON public.xactimate_photo_links
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.xactimate_line_items li
            JOIN public.xactimate_estimates e ON e.id = li.estimate_id
            WHERE li.id = xactimate_photo_links.line_item_id
            AND e.user_id = auth.uid()
        )
    );

-- RLS Policies for other tables
CREATE POLICY "Users can view own sync logs" ON public.xactimate_sync_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sync logs" ON public.xactimate_sync_log
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

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_xactimate_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_xactimate_estimates_updated_at
    BEFORE UPDATE ON public.xactimate_estimates
    FOR EACH ROW EXECUTE FUNCTION update_xactimate_updated_at();

CREATE TRIGGER update_xactimate_line_items_updated_at
    BEFORE UPDATE ON public.xactimate_line_items
    FOR EACH ROW EXECUTE FUNCTION update_xactimate_updated_at();

CREATE TRIGGER update_xactimate_change_orders_updated_at
    BEFORE UPDATE ON public.xactimate_change_orders
    FOR EACH ROW EXECUTE FUNCTION update_xactimate_updated_at();

CREATE TRIGGER update_xactimate_trade_assignments_updated_at
    BEFORE UPDATE ON public.xactimate_trade_assignments
    FOR EACH ROW EXECUTE FUNCTION update_xactimate_updated_at();