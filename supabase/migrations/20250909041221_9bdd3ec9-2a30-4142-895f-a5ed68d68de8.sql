-- Add missing columns to company_details table for comprehensive business information
ALTER TABLE public.company_details 
ADD COLUMN IF NOT EXISTS tax_id TEXT,
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS employee_count INTEGER,
ADD COLUMN IF NOT EXISTS annual_revenue TEXT,
ADD COLUMN IF NOT EXISTS registration_number TEXT,
ADD COLUMN IF NOT EXISTS wsib_number TEXT,
ADD COLUMN IF NOT EXISTS insurance_provider TEXT,
ADD COLUMN IF NOT EXISTS insurance_policy_number TEXT,
ADD COLUMN IF NOT EXISTS insurance_expiry_date DATE,
ADD COLUMN IF NOT EXISTS business_license_number TEXT,
ADD COLUMN IF NOT EXISTS business_license_expiry DATE,
ADD COLUMN IF NOT EXISTS hst_number TEXT,
ADD COLUMN IF NOT EXISTS gst_number TEXT,
ADD COLUMN IF NOT EXISTS pst_number TEXT,
ADD COLUMN IF NOT EXISTS primary_color TEXT,
ADD COLUMN IF NOT EXISTS secondary_color TEXT,
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_areas TEXT[],
ADD COLUMN IF NOT EXISTS certifications TEXT[],
ADD COLUMN IF NOT EXISTS bonding_company TEXT,
ADD COLUMN IF NOT EXISTS bonding_limit DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS workers_comp_coverage BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS liability_coverage_limit DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS payment_terms TEXT DEFAULT 'Net 30',
ADD COLUMN IF NOT EXISTS banking_institution TEXT,
ADD COLUMN IF NOT EXISTS account_manager TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;

-- Add comment to document the purpose of each field
COMMENT ON COLUMN public.company_details.wsib_number IS 'Workplace Safety and Insurance Board number (Canada)';
COMMENT ON COLUMN public.company_details.hst_number IS 'Harmonized Sales Tax number (Canada)';
COMMENT ON COLUMN public.company_details.gst_number IS 'Goods and Services Tax number (Canada)';
COMMENT ON COLUMN public.company_details.pst_number IS 'Provincial Sales Tax number (Canada)';
COMMENT ON COLUMN public.company_details.bonding_limit IS 'Maximum bonding capacity in dollars';
COMMENT ON COLUMN public.company_details.liability_coverage_limit IS 'General liability insurance coverage limit';

-- Update RLS policies if needed (already have proper ones)
-- Existing policies already allow users to manage their own company details