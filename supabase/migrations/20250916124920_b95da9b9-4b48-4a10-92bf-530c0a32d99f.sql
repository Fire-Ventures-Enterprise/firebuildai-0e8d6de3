-- Fix the _set_token_hash function to properly handle the digest function
-- First, drop the existing function if it exists
DROP FUNCTION IF EXISTS _set_token_hash() CASCADE;

-- Create a working version of the function
CREATE OR REPLACE FUNCTION _set_token_hash() 
RETURNS TRIGGER AS $$
BEGIN
  -- Only update hash if public_token is not null and has changed
  IF NEW.public_token IS NOT NULL AND (OLD.public_token IS NULL OR NEW.public_token != OLD.public_token) THEN
    -- Use pgcrypto's digest function with proper casting
    NEW.public_token_hash = public.digest(NEW.public_token::text, 'sha256'::text);
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