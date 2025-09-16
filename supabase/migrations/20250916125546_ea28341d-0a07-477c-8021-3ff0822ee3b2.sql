-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fix the _set_token_hash function
DROP FUNCTION IF EXISTS _set_token_hash() CASCADE;

CREATE OR REPLACE FUNCTION _set_token_hash() 
RETURNS TRIGGER AS $$
BEGIN
  -- Only update hash if public_token is not null and has changed
  IF NEW.public_token IS NOT NULL AND (OLD.public_token IS NULL OR NEW.public_token != OLD.public_token) THEN
    -- Use pgcrypto's digest function with proper casting
    NEW.public_token_hash = digest(NEW.public_token::text, 'sha256');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trg_set_estimate_token_hash ON estimates;
CREATE TRIGGER trg_set_estimate_token_hash
  BEFORE INSERT OR UPDATE OF public_token ON estimates
  FOR EACH ROW
  EXECUTE FUNCTION _set_token_hash();

-- Add proposal-related columns to estimates table
ALTER TABLE estimates 
ADD COLUMN IF NOT EXISTS is_proposal boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS proposal_sent_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS payment_stages jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS deposit_paid boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS deposit_paid_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS deposit_payment_id text;