-- Fix the search path for the timestamp update function
CREATE OR REPLACE FUNCTION update_bank_integration_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = 'public';