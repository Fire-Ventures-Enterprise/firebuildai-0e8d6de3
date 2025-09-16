-- Add contract_text column to estimates table
ALTER TABLE public.estimates 
ADD COLUMN IF NOT EXISTS contract_text TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.estimates.contract_text IS 'Stores the generated contract text when estimate is converted to proposal';