-- Create bank_integrations table to store configured bank connections
CREATE TABLE public.bank_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_code TEXT NOT NULL, -- 'RBC', 'TD', 'BMO', 'CHASE', etc.
  country TEXT NOT NULL CHECK (country IN ('CA', 'US')),
  account_name TEXT NOT NULL,
  account_type TEXT CHECK (account_type IN ('checking', 'savings', 'business')),
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  configuration JSONB DEFAULT '{}', -- Encrypted configuration data
  capabilities JSONB DEFAULT '{}', -- Available payment methods for this bank
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payment_transactions table for tracking all bank payments
CREATE TABLE public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_integration_id UUID REFERENCES public.bank_integrations(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('etransfer', 'ach', 'wire', 'zelle', 'eft')),
  direction TEXT NOT NULL CHECK (direction IN ('outbound', 'inbound')),
  status TEXT NOT NULL DEFAULT 'pending',
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('CAD', 'USD')),
  
  -- Sender Information
  sender_name TEXT,
  sender_email TEXT,
  sender_account_info JSONB DEFAULT '{}', -- Encrypted
  
  -- Recipient Information
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  recipient_account_info JSONB DEFAULT '{}', -- Encrypted
  
  -- Transaction Details
  description TEXT,
  reference_number TEXT UNIQUE,
  bank_reference_id TEXT,
  tracking_url TEXT,
  
  -- FireBuildAI Context
  invoice_id UUID REFERENCES public.invoices_enhanced(id),
  purchase_order_id UUID REFERENCES public.purchase_orders(id),
  contractor_id UUID,
  project_id UUID,
  
  -- Processing Details
  processing_fee DECIMAL(10,2),
  exchange_rate DECIMAL(10,6),
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  
  -- Error Handling
  error_code TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  retryable BOOLEAN DEFAULT false,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  webhook_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payment_methods table for storing customer payment preferences
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL CHECK (method_type IN ('bank_account', 'etransfer', 'zelle')),
  country TEXT NOT NULL CHECK (country IN ('CA', 'US')),
  is_default BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  
  -- Method-specific details (encrypted)
  details JSONB NOT NULL DEFAULT '{}',
  
  -- Verification
  verification_status TEXT DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bank_webhooks table for webhook management
CREATE TABLE public.bank_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_code TEXT NOT NULL,
  webhook_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  transaction_id UUID REFERENCES public.payment_transactions(id),
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create compliance_logs table for regulatory tracking
CREATE TABLE public.compliance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES public.payment_transactions(id),
  compliance_type TEXT NOT NULL, -- 'FINTRAC', 'NACHA', 'BSA', etc.
  country TEXT NOT NULL CHECK (country IN ('CA', 'US')),
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  reported BOOLEAN DEFAULT false,
  reported_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_bank_integrations_user ON public.bank_integrations(user_id);
CREATE INDEX idx_bank_integrations_country ON public.bank_integrations(country);
CREATE INDEX idx_payment_transactions_user ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_payment_transactions_invoice ON public.payment_transactions(invoice_id);
CREATE INDEX idx_payment_transactions_po ON public.payment_transactions(purchase_order_id);
CREATE INDEX idx_payment_methods_user ON public.payment_methods(user_id);
CREATE INDEX idx_payment_methods_customer ON public.payment_methods(customer_id);
CREATE INDEX idx_bank_webhooks_transaction ON public.bank_webhooks(transaction_id);
CREATE INDEX idx_compliance_logs_transaction ON public.compliance_logs(transaction_id);

-- Enable RLS
ALTER TABLE public.bank_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bank_integrations
CREATE POLICY "Users can view own bank integrations"
  ON public.bank_integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bank integrations"
  ON public.bank_integrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bank integrations"
  ON public.bank_integrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bank integrations"
  ON public.bank_integrations FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for payment_transactions
CREATE POLICY "Users can view own payment transactions"
  ON public.payment_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payment transactions"
  ON public.payment_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment transactions"
  ON public.payment_transactions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for payment_methods
CREATE POLICY "Users can manage own payment methods"
  ON public.payment_methods FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for bank_webhooks
CREATE POLICY "Service role can manage webhooks"
  ON public.bank_webhooks FOR ALL
  USING (true);

-- RLS Policies for compliance_logs
CREATE POLICY "Users can view own compliance logs"
  ON public.compliance_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can create compliance logs"
  ON public.compliance_logs FOR INSERT
  WITH CHECK (true);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_bank_integration_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bank_integrations_timestamp
  BEFORE UPDATE ON public.bank_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_bank_integration_timestamp();

CREATE TRIGGER update_payment_transactions_timestamp
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_bank_integration_timestamp();

CREATE TRIGGER update_payment_methods_timestamp
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_bank_integration_timestamp();