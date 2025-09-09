-- Add comprehensive contractor profile fields
ALTER TABLE contractor_accounts
ADD COLUMN IF NOT EXISTS contact_person TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS province TEXT DEFAULT 'Ontario',
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS gst_number TEXT,
ADD COLUMN IF NOT EXISTS wsib_number TEXT,
ADD COLUMN IF NOT EXISTS insurance_provider TEXT,
ADD COLUMN IF NOT EXISTS insurance_policy_number TEXT,
ADD COLUMN IF NOT EXISTS insurance_expiry_date DATE,
ADD COLUMN IF NOT EXISTS insurance_certificate_url TEXT,
ADD COLUMN IF NOT EXISTS trade_type TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add index for searching
CREATE INDEX IF NOT EXISTS idx_contractor_accounts_user_id ON contractor_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_contractor_accounts_business_name ON contractor_accounts(business_name);