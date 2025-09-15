-- Fix the proposals table foreign key reference
DROP TABLE IF EXISTS proposals CASCADE;
DROP TABLE IF EXISTS signatures CASCADE;
DROP TABLE IF EXISTS deposits CASCADE;

-- Recreate Proposals table with correct reference
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_estimate_id UUID REFERENCES project_estimates(id) ON DELETE CASCADE NOT NULL,
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

-- Recreate Electronic signatures
CREATE TABLE signatures (
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

-- Recreate Deposits table
CREATE TABLE deposits (
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

-- Enable RLS
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for proposals
CREATE POLICY "View proposals" ON proposals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM project_estimates 
            WHERE project_estimates.id = proposals.project_estimate_id 
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
            WHERE project_estimates.id = proposals.project_estimate_id 
            AND project_estimates.created_by = auth.uid())
  );

-- RLS Policies for signatures
CREATE POLICY "View signatures" ON signatures
  FOR SELECT USING (
    signer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM proposals 
            JOIN project_estimates ON project_estimates.id = proposals.project_estimate_id
            WHERE proposals.id = signatures.proposal_id 
            AND project_estimates.created_by = auth.uid())
  );

CREATE POLICY "Create signatures" ON signatures
  FOR INSERT WITH CHECK (signer_id = auth.uid());

-- RLS Policies for deposits
CREATE POLICY "View deposits" ON deposits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM proposals 
            JOIN project_estimates ON project_estimates.id = proposals.project_estimate_id
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
            JOIN project_estimates ON project_estimates.id = proposals.project_estimate_id
            JOIN projects ON projects.id = project_estimates.project_id
            WHERE proposals.id = deposits.proposal_id 
            AND projects.owner_id = auth.uid())
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_proposals_estimate ON proposals(project_estimate_id);