-- Check if trigger exists on estimates table and apply same pattern to invoices_enhanced
-- First, let's create the trigger for invoices_enhanced if it doesn't exist
CREATE OR REPLACE FUNCTION public._set_token_hash()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
begin
  if new.public_token is not null then
    new.public_token_hash := digest(new.public_token, 'sha256');
  else
    new.public_token_hash := null;
  end if;
  return new;
end;
$function$;

-- Create trigger if not exists (using DO block to avoid errors if it already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_invoice_token_hash' 
    AND tgrelid = 'invoices_enhanced'::regclass
  ) THEN
    CREATE TRIGGER set_invoice_token_hash
    BEFORE INSERT OR UPDATE OF public_token ON invoices_enhanced
    FOR EACH ROW
    EXECUTE FUNCTION _set_token_hash();
  END IF;
END $$;