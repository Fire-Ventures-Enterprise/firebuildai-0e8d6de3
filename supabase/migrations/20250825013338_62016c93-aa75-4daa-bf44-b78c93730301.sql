-- Create table for captured email leads
CREATE TABLE public.email_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  accepted_terms BOOLEAN NOT NULL DEFAULT true,
  marketing_consent BOOLEAN DEFAULT false,
  source_page TEXT DEFAULT 'homepage',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their email (public form)
CREATE POLICY "Anyone can submit email" 
ON public.email_leads 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view email leads
CREATE POLICY "Admins can view email leads" 
ON public.email_leads 
FOR SELECT 
USING (is_admin());

-- Only admins can update email leads
CREATE POLICY "Admins can update email leads" 
ON public.email_leads 
FOR UPDATE 
USING (is_admin());

-- Only admins can delete email leads  
CREATE POLICY "Admins can delete email leads" 
ON public.email_leads 
FOR DELETE 
USING (is_admin());

-- Create index for faster email lookups
CREATE INDEX idx_email_leads_email ON public.email_leads(email);
CREATE INDEX idx_email_leads_created_at ON public.email_leads(created_at);