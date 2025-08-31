-- Fix search path for new functions
ALTER FUNCTION generate_po_number() SET search_path = public;
ALTER FUNCTION set_po_number() SET search_path = public;