-- Create beta_registrations table for storing product waitlist signups
CREATE TABLE IF NOT EXISTS public.beta_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  product TEXT NOT NULL,
  subdomain TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email, product)
);

-- Enable Row Level Security
ALTER TABLE public.beta_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for beta registrations
-- Anyone can insert their email (public signup)
CREATE POLICY "Anyone can register for beta" 
ON public.beta_registrations 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users can view registrations (for admin)
CREATE POLICY "Authenticated users can view beta registrations" 
ON public.beta_registrations 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create index for faster lookups
CREATE INDEX idx_beta_registrations_email ON public.beta_registrations(email);
CREATE INDEX idx_beta_registrations_product ON public.beta_registrations(product);