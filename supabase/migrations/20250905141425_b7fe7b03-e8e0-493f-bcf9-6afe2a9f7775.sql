-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS set_invoice_token_hash ON invoices_enhanced;
DROP FUNCTION IF EXISTS _set_token_hash();

-- Recreate the function with proper type casting
CREATE OR REPLACE FUNCTION _set_token_hash()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.public_token IS NOT NULL THEN
    NEW.public_token_hash := digest(NEW.public_token::text, 'sha256'::text);
  ELSE
    NEW.public_token_hash := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate the trigger
CREATE TRIGGER set_invoice_token_hash
BEFORE INSERT OR UPDATE OF public_token ON invoices_enhanced
FOR EACH ROW
EXECUTE FUNCTION _set_token_hash();