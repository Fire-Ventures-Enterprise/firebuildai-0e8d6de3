-- Create subscribers table to track subscription information
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_type TEXT CHECK (subscription_type IN ('whitelabel', 'standalone')),
  subscription_tier TEXT CHECK (subscription_tier IN ('tier1', 'tier2', 'tier3', 'whitelabel')),
  subscription_end TIMESTAMPTZ,
  company_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription info
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Create policy for edge functions to update subscription info
CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (true);

-- Create policy for edge functions to insert subscription info
CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Create client_companies table for white label companies
CREATE TABLE public.client_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_email TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for client_companies
ALTER TABLE public.client_companies ENABLE ROW LEVEL SECURITY;

-- Create policies for client_companies
CREATE POLICY "view_own_companies" ON public.client_companies
FOR SELECT
USING (
  subscriber_id IN (
    SELECT id FROM public.subscribers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "insert_own_companies" ON public.client_companies
FOR INSERT
WITH CHECK (
  subscriber_id IN (
    SELECT id FROM public.subscribers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "update_own_companies" ON public.client_companies
FOR UPDATE
USING (
  subscriber_id IN (
    SELECT id FROM public.subscribers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "delete_own_companies" ON public.client_companies
FOR DELETE
USING (
  subscriber_id IN (
    SELECT id FROM public.subscribers WHERE user_id = auth.uid()
  )
);