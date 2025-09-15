-- Create project_estimates table if not exists
CREATE TABLE IF NOT EXISTS project_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  estimate_number TEXT UNIQUE,
  total_materials DECIMAL(12,2) DEFAULT 0,
  total_labor DECIMAL(12,2) DEFAULT 0,
  markup_percentage DECIMAL(5,2) DEFAULT 0,
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 13,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) DEFAULT 0,
  status estimate_status DEFAULT 'draft',
  valid_until DATE,
  notes TEXT,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create project_invoices table if not exists
CREATE TABLE IF NOT EXISTS project_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  invoice_number TEXT UNIQUE,
  proposal_id UUID,
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) DEFAULT 0,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  balance_due DECIMAL(12,2) DEFAULT 0,
  status invoice_status DEFAULT 'draft',
  due_date DATE,
  payment_terms TEXT DEFAULT 'Net 30',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create work_orders_mvp table if not exists
CREATE TABLE IF NOT EXISTS work_orders_mvp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  invoice_id UUID REFERENCES project_invoices(id),
  order_number TEXT UNIQUE,
  assigned_to UUID REFERENCES profiles(id),
  scope_description TEXT NOT NULL,
  materials_list JSONB,
  start_date DATE,
  end_date DATE,
  status work_order_status DEFAULT 'pending',
  progress_percentage INTEGER DEFAULT 0,
  completion_notes TEXT,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create project_messages table if not exists
CREATE TABLE IF NOT EXISTS project_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE project_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders_mvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_estimates
CREATE POLICY "View project estimates" ON project_estimates
  FOR SELECT USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_estimates.project_id 
            AND (projects.owner_id = auth.uid() OR 
                 EXISTS (SELECT 1 FROM project_contractors 
                         WHERE project_contractors.project_id = projects.id 
                         AND project_contractors.contractor_id = auth.uid())))
  );

CREATE POLICY "Create and manage estimates" ON project_estimates
  FOR ALL USING (created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_estimates.project_id 
            AND projects.owner_id = auth.uid())
  );

-- RLS Policies for project_invoices
CREATE POLICY "View invoices" ON project_invoices
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects 
            WHERE projects.id = project_invoices.project_id 
            AND (projects.owner_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM project_contractors 
                         WHERE project_contractors.project_id = projects.id 
                         AND project_contractors.contractor_id = auth.uid())))
  );

CREATE POLICY "Manage invoices" ON project_invoices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects 
            WHERE projects.id = project_invoices.project_id 
            AND projects.owner_id = auth.uid())
  );

-- RLS Policies for work_orders_mvp
CREATE POLICY "View work orders" ON work_orders_mvp
  FOR SELECT USING (
    assigned_to = auth.uid() OR
    EXISTS (SELECT 1 FROM projects 
            WHERE projects.id = work_orders_mvp.project_id 
            AND projects.owner_id = auth.uid())
  );

CREATE POLICY "Manage work orders" ON work_orders_mvp
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects 
            WHERE projects.id = work_orders_mvp.project_id 
            AND projects.owner_id = auth.uid())
  );

-- RLS Policies for project_messages
CREATE POLICY "View project messages" ON project_messages
  FOR SELECT USING (
    sender_id = auth.uid() OR
    EXISTS (SELECT 1 FROM projects 
            WHERE projects.id = project_messages.project_id 
            AND (projects.owner_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM project_contractors 
                         WHERE project_contractors.project_id = projects.id 
                         AND project_contractors.contractor_id = auth.uid())))
  );

CREATE POLICY "Send messages" ON project_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (SELECT 1 FROM projects 
            WHERE projects.id = project_messages.project_id 
            AND (projects.owner_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM project_contractors 
                         WHERE project_contractors.project_id = projects.id 
                         AND project_contractors.contractor_id = auth.uid())))
  );

-- Now add the foreign key to proposals for project_invoices
ALTER TABLE project_invoices ADD CONSTRAINT fk_proposal_id 
  FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE SET NULL;

-- Create necessary indexes
CREATE INDEX IF NOT EXISTS idx_project_estimates_project ON project_estimates(project_id);
CREATE INDEX IF NOT EXISTS idx_project_invoices_project ON project_invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_mvp_project ON work_orders_mvp(project_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_mvp_assigned ON work_orders_mvp(assigned_to);
CREATE INDEX IF NOT EXISTS idx_project_messages_project ON project_messages(project_id);