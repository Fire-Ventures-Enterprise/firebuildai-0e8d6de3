-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own invoice scheduling" ON invoice_scheduling;
DROP POLICY IF EXISTS "Users can create own invoice scheduling" ON invoice_scheduling;
DROP POLICY IF EXISTS "Users can update own invoice scheduling" ON invoice_scheduling;
DROP POLICY IF EXISTS "Users can delete own invoice scheduling" ON invoice_scheduling;

-- Recreate policies
CREATE POLICY "Users can view own invoice scheduling"
ON invoice_scheduling FOR SELECT
USING (EXISTS (
  SELECT 1 FROM invoices_enhanced 
  WHERE invoices_enhanced.id = invoice_scheduling.invoice_id 
  AND invoices_enhanced.user_id = auth.uid()
));

CREATE POLICY "Users can create own invoice scheduling"
ON invoice_scheduling FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM invoices_enhanced 
  WHERE invoices_enhanced.id = invoice_scheduling.invoice_id 
  AND invoices_enhanced.user_id = auth.uid()
));

CREATE POLICY "Users can update own invoice scheduling"
ON invoice_scheduling FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM invoices_enhanced 
  WHERE invoices_enhanced.id = invoice_scheduling.invoice_id 
  AND invoices_enhanced.user_id = auth.uid()
));

CREATE POLICY "Users can delete own invoice scheduling"
ON invoice_scheduling FOR DELETE
USING (EXISTS (
  SELECT 1 FROM invoices_enhanced 
  WHERE invoices_enhanced.id = invoice_scheduling.invoice_id 
  AND invoices_enhanced.user_id = auth.uid()
));