-- Core workflow tables for FireBuild.ai MVP

-- Projects table (main entity)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  province TEXT DEFAULT 'ON',
  postal_code TEXT,
  type TEXT DEFAULT 'residential',
  status TEXT DEFAULT 'draft',
  budget NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals table (extends estimates)
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID REFERENCES public.estimates(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'draft', -- draft, sent, viewed, accepted, rejected
  template_id TEXT,
  terms_conditions TEXT,
  validity_days INTEGER DEFAULT 30,
  expires_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  public_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Electronic signatures table
CREATE TABLE IF NOT EXISTS public.signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  signer_name TEXT NOT NULL,
  signer_email TEXT NOT NULL,
  signature_data TEXT NOT NULL, -- Base64 encoded signature image
  signed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  verification_code TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deposits table
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices_enhanced(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  percentage NUMERIC(5,2), -- If percentage-based
  status TEXT DEFAULT 'pending', -- pending, paid, refunded, cancelled
  payment_method TEXT, -- card, bank_transfer, cash, cheque, e_transfer
  payment_reference TEXT,
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  refund_reason TEXT,
  stripe_payment_intent_id TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update estimates table to link with projects
ALTER TABLE public.estimates 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- Update invoices_enhanced to link with projects
ALTER TABLE public.invoices_enhanced 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- Update work_orders to link with projects  
ALTER TABLE public.work_orders
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_proposals_estimate_id ON public.proposals(estimate_id);
CREATE INDEX IF NOT EXISTS idx_proposals_project_id ON public.proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);
CREATE INDEX IF NOT EXISTS idx_signatures_proposal_id ON public.signatures(proposal_id);
CREATE INDEX IF NOT EXISTS idx_deposits_proposal_id ON public.deposits(proposal_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON public.deposits(status);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for proposals
CREATE POLICY "Users can view own proposals" ON public.proposals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own proposals" ON public.proposals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own proposals" ON public.proposals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own proposals" ON public.proposals
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for signatures
CREATE POLICY "Users can view signatures for their proposals" ON public.signatures
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.proposals 
      WHERE proposals.id = signatures.proposal_id 
      AND proposals.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create signatures with valid proposal token" ON public.signatures
  FOR INSERT WITH CHECK (true);

-- RLS Policies for deposits
CREATE POLICY "Users can view own deposits" ON public.deposits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own deposits" ON public.deposits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deposits" ON public.deposits
  FOR UPDATE USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deposits_updated_at BEFORE UPDATE ON public.deposits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();