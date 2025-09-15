-- Create enum types
CREATE TYPE user_role AS ENUM ('project_owner', 'contractor', 'subcontractor');
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE estimate_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired');
CREATE TYPE proposal_status AS ENUM ('draft', 'sent', 'viewed', 'signed', 'expired');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'partial', 'paid', 'overdue');
CREATE TYPE work_order_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'verified');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- Extend profiles table for contractor management
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'project_owner';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trade_specialization TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS license_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS insurance_expiry DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available';

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  project_type TEXT,
  budget DECIMAL(12,2),
  status project_status DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project contractors
CREATE TABLE IF NOT EXISTS project_contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  contractor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  UNIQUE(project_id, contractor_id)
);

-- Estimates table (Step 1 of workflow)
CREATE TABLE IF NOT EXISTS project_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  estimate_number TEXT UNIQUE,
  total_materials DECIMAL(12,2) DEFAULT 0,
  total_labor DECIMAL(12,2) DEFAULT 0,
  markup_percentage DECIMAL(5,2) DEFAULT 0,
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 13, -- Default HST for Ontario
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) DEFAULT 0,
  status estimate_status DEFAULT 'draft',
  valid_until DATE,
  notes TEXT,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estimate line items
CREATE TABLE IF NOT EXISTS estimate_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES project_estimates(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  item_type TEXT CHECK (item_type IN ('material', 'labor', 'other')),
  quantity DECIMAL(10,2) DEFAULT 1,
  unit TEXT,
  rate DECIMAL(12,2) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals table (Step 2 of workflow)
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES project_estimates(id) ON DELETE CASCADE NOT NULL,
  proposal_number TEXT UNIQUE,
  terms_conditions TEXT,
  scope_of_work TEXT,
  payment_terms TEXT,
  status proposal_status DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  expires_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Electronic signatures (Step 3 of workflow)
CREATE TABLE IF NOT EXISTS signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  signer_id UUID REFERENCES profiles(id),
  signer_name TEXT NOT NULL,
  signer_email TEXT NOT NULL,
  signature_data TEXT NOT NULL,
  ip_address INET,
  signed_at TIMESTAMPTZ DEFAULT NOW(),
  verification_code TEXT
);

-- Deposits table (Step 4 of workflow)
CREATE TABLE IF NOT EXISTS deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  percentage DECIMAL(5,2),
  status payment_status DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project invoices (Step 5 of workflow)
CREATE TABLE IF NOT EXISTS project_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  invoice_number TEXT UNIQUE,
  proposal_id UUID REFERENCES proposals(id),
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

-- Work orders (Step 6 of workflow)
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

-- Messages for project communication
CREATE TABLE IF NOT EXISTS project_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES project_invoices(id),
  deposit_id UUID REFERENCES deposits(id),
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'CAD',
  payment_method TEXT,
  status payment_status DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  metadata JSONB,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders_mvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (owner_id = auth.uid() OR id IN (
    SELECT project_id FROM project_contractors WHERE contractor_id = auth.uid()
  ));

CREATE POLICY "Project owners can create projects" ON projects
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Project owners can update their projects" ON projects
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Project owners can delete their projects" ON projects
  FOR DELETE USING (owner_id = auth.uid());

-- RLS Policies for project_contractors
CREATE POLICY "View project contractors" ON project_contractors
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_contractors.project_id 
            AND (projects.owner_id = auth.uid() OR project_contractors.contractor_id = auth.uid()))
  );

CREATE POLICY "Project owners can manage contractors" ON project_contractors
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_contractors.project_id 
            AND projects.owner_id = auth.uid())
  );

-- RLS Policies for estimates
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

-- RLS Policies for estimate items
CREATE POLICY "View estimate items" ON estimate_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM project_estimates 
            WHERE project_estimates.id = estimate_items.estimate_id 
            AND (project_estimates.created_by = auth.uid() OR
                 EXISTS (SELECT 1 FROM projects 
                         WHERE projects.id = project_estimates.project_id 
                         AND projects.owner_id = auth.uid())))
  );

CREATE POLICY "Manage estimate items" ON estimate_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM project_estimates 
            WHERE project_estimates.id = estimate_items.estimate_id 
            AND (project_estimates.created_by = auth.uid() OR
                 EXISTS (SELECT 1 FROM projects 
                         WHERE projects.id = project_estimates.project_id 
                         AND projects.owner_id = auth.uid())))
  );

-- RLS Policies for proposals
CREATE POLICY "View proposals" ON proposals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM project_estimates 
            WHERE project_estimates.id = proposals.estimate_id 
            AND (project_estimates.created_by = auth.uid() OR
                 EXISTS (SELECT 1 FROM projects 
                         WHERE projects.id = project_estimates.project_id 
                         AND (projects.owner_id = auth.uid() OR
                              EXISTS (SELECT 1 FROM project_contractors 
                                      WHERE project_contractors.project_id = projects.id 
                                      AND project_contractors.contractor_id = auth.uid())))))
  );

CREATE POLICY "Manage proposals" ON proposals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM project_estimates 
            WHERE project_estimates.id = proposals.estimate_id 
            AND project_estimates.created_by = auth.uid())
  );

-- RLS Policies for signatures
CREATE POLICY "View signatures" ON signatures
  FOR SELECT USING (
    signer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM proposals 
            JOIN project_estimates ON project_estimates.id = proposals.estimate_id
            WHERE proposals.id = signatures.proposal_id 
            AND project_estimates.created_by = auth.uid())
  );

CREATE POLICY "Create signatures" ON signatures
  FOR INSERT WITH CHECK (signer_id = auth.uid());

-- RLS Policies for deposits
CREATE POLICY "View deposits" ON deposits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM proposals 
            JOIN project_estimates ON project_estimates.id = proposals.estimate_id
            JOIN projects ON projects.id = project_estimates.project_id
            WHERE proposals.id = deposits.proposal_id 
            AND (projects.owner_id = auth.uid() OR 
                 EXISTS (SELECT 1 FROM project_contractors 
                         WHERE project_contractors.project_id = projects.id 
                         AND project_contractors.contractor_id = auth.uid())))
  );

CREATE POLICY "Manage deposits" ON deposits
  FOR ALL USING (
    EXISTS (SELECT 1 FROM proposals 
            JOIN project_estimates ON project_estimates.id = proposals.estimate_id
            JOIN projects ON projects.id = project_estimates.project_id
            WHERE proposals.id = deposits.proposal_id 
            AND projects.owner_id = auth.uid())
  );

-- RLS Policies for invoices
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

-- RLS Policies for work orders
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

-- RLS Policies for messages
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

-- RLS Policies for payment transactions
CREATE POLICY "View payment transactions" ON payment_transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM project_invoices 
            JOIN projects ON projects.id = project_invoices.project_id
            WHERE project_invoices.id = payment_transactions.invoice_id 
            AND (projects.owner_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM project_contractors 
                         WHERE project_contractors.project_id = projects.id 
                         AND project_contractors.contractor_id = auth.uid())))
  );

CREATE POLICY "Manage payment transactions" ON payment_transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM project_invoices 
            JOIN projects ON projects.id = project_invoices.project_id
            WHERE project_invoices.id = payment_transactions.invoice_id 
            AND projects.owner_id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_project_contractors_project ON project_contractors(project_id);
CREATE INDEX IF NOT EXISTS idx_project_contractors_contractor ON project_contractors(contractor_id);
CREATE INDEX IF NOT EXISTS idx_estimates_project ON project_estimates(project_id);
CREATE INDEX IF NOT EXISTS idx_proposals_estimate ON proposals(estimate_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project ON project_invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_project ON work_orders_mvp(project_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_assigned ON work_orders_mvp(assigned_to);
CREATE INDEX IF NOT EXISTS idx_messages_project ON project_messages(project_id);