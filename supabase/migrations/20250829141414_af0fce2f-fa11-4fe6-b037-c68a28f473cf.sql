-- Add service address fields to invoices_enhanced table
ALTER TABLE public.invoices_enhanced
ADD COLUMN service_address TEXT,
ADD COLUMN service_city TEXT,
ADD COLUMN service_province TEXT DEFAULT 'Ontario',
ADD COLUMN service_postal_code TEXT;

-- Add service address fields to estimates table
ALTER TABLE public.estimates
ADD COLUMN service_address TEXT,
ADD COLUMN service_city TEXT,
ADD COLUMN service_province TEXT DEFAULT 'Ontario',
ADD COLUMN service_postal_code TEXT;