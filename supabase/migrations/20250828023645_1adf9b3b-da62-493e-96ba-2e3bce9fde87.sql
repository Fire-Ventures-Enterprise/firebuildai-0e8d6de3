-- Insert simulated invoices with various statuses and dates
INSERT INTO public.invoices_enhanced (
  invoice_number, po_number, status, issue_date, due_date, days_to_payment,
  customer_id, customer_name, customer_email, customer_phone, customer_address,
  customer_city, customer_province, customer_postal_code,
  subtotal, tax_rate, tax_amount, total, paid_amount, balance,
  notes, user_id
) 
SELECT 
  invoice_number, po_number, status, issue_date, due_date, days_to_payment,
  customer_id, customer_name, customer_email, customer_phone, customer_address,
  customer_city, customer_province, customer_postal_code,
  subtotal, tax_rate, tax_amount, total, paid_amount, balance,
  notes, auth.uid() as user_id
FROM (VALUES
  -- January 2025 - Paid invoices
  ('INV-00002', 'PO-2025-001', 'paid', '2025-01-05'::timestamp, '2025-01-20'::timestamp, 15,
   NULL, 'Johnson Construction Ltd', 'billing@johnsonconstruction.ca', '416-555-0101', '789 Builder Ave',
   'Toronto', 'Ontario', 'M5V 3A8',
   5250.00, 13, 682.50, 5932.50, 5932.50, 0.00,
   'Foundation repair work completed'),
  
  ('INV-00003', 'PO-2025-002', 'paid', '2025-01-12'::timestamp, '2025-01-27'::timestamp, 15,
   NULL, 'Smith Renovations', 'accounts@smithreno.com', '905-555-0102', '456 Contractor Rd',
   'Mississauga', 'Ontario', 'L5B 4M9',
   12800.00, 13, 1664.00, 14464.00, 14464.00, 0.00,
   'Kitchen renovation project - Phase 1'),
  
  -- February 2025 - Mix of paid and overdue
  ('INV-00004', 'PO-2025-003', 'paid', '2025-02-01'::timestamp, '2025-02-16'::timestamp, 15,
   NULL, 'Davis Properties', 'finance@davisproperties.ca', '647-555-0103', '321 Estate Blvd',
   'Oakville', 'Ontario', 'L6H 7P5',
   8900.00, 13, 1157.00, 10057.00, 10057.00, 0.00,
   'Bathroom renovation - Master suite'),
  
  ('INV-00005', 'PO-2025-004', 'overdue', '2025-02-08'::timestamp, '2025-02-23'::timestamp, 15,
   NULL, 'Wilson Development', 'ap@wilsondev.com', '416-555-0104', '654 Project Way',
   'Toronto', 'Ontario', 'M4E 2V5',
   15600.00, 13, 2028.00, 17628.00, 0.00, 17628.00,
   'Commercial office buildout - pending payment'),
  
  ('INV-00006', 'PO-2025-005', 'paid', '2025-02-15'::timestamp, '2025-03-02'::timestamp, 15,
   NULL, 'Brown Holdings Inc', 'payments@brownholdings.ca', '905-555-0105', '987 Corporate Dr',
   'Brampton', 'Ontario', 'L6Y 5T6',
   7200.00, 13, 936.00, 8136.00, 8136.00, 0.00,
   'Electrical system upgrade'),
  
  -- March 2025 - Mix of all statuses
  ('INV-00007', 'PO-2025-006', 'paid', '2025-03-01'::timestamp, '2025-03-16'::timestamp, 15,
   NULL, 'Martinez Construction', 'invoices@martinezcon.com', '647-555-0106', '159 Builder Lane',
   'Scarborough', 'Ontario', 'M1B 5K7',
   9500.00, 13, 1235.00, 10735.00, 10735.00, 0.00,
   'Deck construction and landscaping'),
  
  ('INV-00008', 'PO-2025-007', 'overdue', '2025-03-10'::timestamp, '2025-03-25'::timestamp, 15,
   NULL, 'Thompson Real Estate', 'accounting@thompsonre.ca', '416-555-0107', '753 Property St',
   'Toronto', 'Ontario', 'M5A 2N5',
   22000.00, 13, 2860.00, 24860.00, 5000.00, 19860.00,
   'Full home renovation - partial payment received'),
  
  ('INV-00009', 'PO-2025-008', 'sent', '2025-03-20'::timestamp, '2025-04-04'::timestamp, 15,
   NULL, 'Anderson Developments', 'billing@andersondev.com', '905-555-0108', '246 Growth Ave',
   'Hamilton', 'Ontario', 'L8N 3T5',
   6750.00, 13, 877.50, 7627.50, 0.00, 7627.50,
   'Plumbing repairs and upgrades'),
  
  -- Current month (August 2025) - Recent invoices
  ('INV-00010', 'PO-2025-009', 'sent', '2025-08-15'::timestamp, '2025-08-30'::timestamp, 15,
   NULL, 'Roberts Construction Group', 'finance@robertsgroup.ca', '647-555-0109', '852 Build Blvd',
   'North York', 'Ontario', 'M2N 6Z7',
   11300.00, 13, 1469.00, 12769.00, 0.00, 12769.00,
   'Roof replacement project'),
  
  ('INV-00011', 'PO-2025-010', 'draft', '2025-08-25'::timestamp, '2025-09-09'::timestamp, 15,
   NULL, 'Taylor Properties LLC', 'accounts@taylorprop.com', '416-555-0110', '369 Investment Way',
   'Toronto', 'Ontario', 'M4C 5L5',
   18500.00, 13, 2405.00, 20905.00, 0.00, 20905.00,
   'Complete basement finishing - quote pending approval')
) AS t(invoice_number, po_number, status, issue_date, due_date, days_to_payment,
       customer_id, customer_name, customer_email, customer_phone, customer_address,
       customer_city, customer_province, customer_postal_code,
       subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes);

-- Insert corresponding invoice items for each invoice
INSERT INTO public.invoice_items_enhanced (invoice_id, item_name, description, quantity, rate, amount, tax, sort_order)
SELECT 
  i.id,
  item_name,
  description,
  quantity,
  rate,
  amount,
  tax,
  sort_order
FROM public.invoices_enhanced i
CROSS JOIN LATERAL (
  SELECT * FROM (VALUES
    -- Items for each invoice (simplified - same items structure for demo)
    ('Labor', 'General construction labor', 40, 85.00, 3400.00, true, 1),
    ('Materials', 'Construction materials and supplies', 1, 2500.00, 2500.00, true, 2),
    ('Equipment Rental', 'Heavy equipment rental', 3, 350.00, 1050.00, true, 3),
    ('Permits', 'Building permits and inspections', 1, 500.00, 500.00, false, 4)
  ) AS items(item_name, description, quantity, rate, amount, tax, sort_order)
  WHERE i.invoice_number IN ('INV-00002', 'INV-00004', 'INV-00006', 'INV-00007', 'INV-00009')
  
  UNION ALL
  
  SELECT * FROM (VALUES
    ('Design Services', 'Architectural design and planning', 20, 125.00, 2500.00, true, 1),
    ('Project Management', 'Construction project management', 60, 95.00, 5700.00, true, 2),
    ('Specialized Labor', 'Electrical and plumbing specialists', 45, 110.00, 4950.00, true, 3),
    ('Premium Materials', 'High-end finishing materials', 1, 8500.00, 8500.00, true, 4),
    ('Cleanup', 'Site cleanup and disposal', 1, 750.00, 750.00, true, 5)
  ) AS items(item_name, description, quantity, rate, amount, tax, sort_order)
  WHERE i.invoice_number IN ('INV-00003', 'INV-00005', 'INV-00008', 'INV-00010', 'INV-00011')
) AS invoice_items;

-- Insert simulated estimates with various statuses
INSERT INTO public.estimates (
  estimate_number, status, issue_date, expiration_date,
  customer_id, user_id,
  subtotal, tax_rate, tax_amount, total,
  signature_required, signed_at, signed_by_name, signed_by_email,
  notes, deposit_percentage, deposit_amount
)
SELECT 
  estimate_number, status, issue_date, expiration_date,
  customer_id, auth.uid() as user_id,
  subtotal, tax_rate, tax_amount, total,
  signature_required, signed_at, signed_by_name, signed_by_email,
  notes, deposit_percentage, deposit_amount
FROM (VALUES
  -- January 2025 Estimates
  ('EST-00002', 'accepted', '2025-01-03'::timestamp, '2025-01-18'::timestamp,
   NULL, 5800.00, 13, 754.00, 6554.00,
   true, '2025-01-05'::timestamp, 'John Johnson', 'john@johnsonconstruction.ca',
   'Foundation repair - Accepted and work commenced', 25, 1638.50),
  
  ('EST-00003', 'declined', '2025-01-08'::timestamp, '2025-01-23'::timestamp,
   NULL, 15000.00, 13, 1950.00, 16950.00,
   true, NULL, NULL, NULL,
   'Large renovation project - Client chose another contractor', 30, 5085.00),
  
  -- February 2025 Estimates
  ('EST-00004', 'accepted', '2025-02-02'::timestamp, '2025-02-17'::timestamp,
   NULL, 9200.00, 13, 1196.00, 10396.00,
   true, '2025-02-04'::timestamp, 'Sarah Davis', 'sarah@davisproperties.ca',
   'Bathroom renovation - Work completed', 25, 2599.00),
  
  ('EST-00005', 'pending', '2025-02-14'::timestamp, '2025-03-01'::timestamp,
   NULL, 32000.00, 13, 4160.00, 36160.00,
   true, NULL, NULL, NULL,
   'Complete home renovation - Awaiting client decision', 30, 10848.00),
  
  ('EST-00006', 'accepted', '2025-02-20'::timestamp, '2025-03-07'::timestamp,
   NULL, 7500.00, 13, 975.00, 8475.00,
   true, '2025-02-22'::timestamp, 'Mike Brown', 'mike@brownholdings.ca',
   'Electrical system upgrade - Completed', 20, 1695.00),
  
  -- March 2025 Estimates  
  ('EST-00007', 'declined', '2025-03-05'::timestamp, '2025-03-20'::timestamp,
   NULL, 12000.00, 13, 1560.00, 13560.00,
   true, NULL, NULL, NULL,
   'Deck and landscaping - Budget exceeded expectations', 25, 3390.00),
  
  ('EST-00008', 'accepted', '2025-03-12'::timestamp, '2025-03-27'::timestamp,
   NULL, 24000.00, 13, 3120.00, 27120.00,
   true, '2025-03-14'::timestamp, 'Lisa Thompson', 'lisa@thompsonre.ca',
   'Full home renovation - In progress', 35, 9492.00),
  
  ('EST-00009', 'pending', '2025-03-18'::timestamp, '2025-04-02'::timestamp,
   NULL, 8900.00, 13, 1157.00, 10057.00,
   false, NULL, NULL, NULL,
   'Plumbing system overhaul - Client reviewing options', 25, 2514.25),
  
  -- Current month (August 2025) Estimates
  ('EST-00010', 'pending', '2025-08-10'::timestamp, '2025-08-25'::timestamp,
   NULL, 13500.00, 13, 1755.00, 15255.00,
   true, NULL, NULL, NULL,
   'Roof replacement - Awaiting approval', 30, 4576.50),
  
  ('EST-00011', 'pending', '2025-08-20'::timestamp, '2025-09-04'::timestamp,
   NULL, 19800.00, 13, 2574.00, 22374.00,
   false, NULL, NULL, NULL,
   'Basement finishing - Quote under review', 25, 5593.50),
  
  ('EST-00012', 'accepted', '2025-08-22'::timestamp, '2025-09-06'::timestamp,
   NULL, 4200.00, 13, 546.00, 4746.00,
   true, '2025-08-23'::timestamp, 'Tom Wilson', 'tom@wilsondev.com',
   'Emergency plumbing repair - Work started', 0, 0.00),
  
  ('EST-00013', 'declined', '2025-08-24'::timestamp, '2025-09-08'::timestamp,
   NULL, 28000.00, 13, 3640.00, 31640.00,
   true, NULL, NULL, NULL,
   'Commercial buildout - Project cancelled', 40, 12656.00)
) AS t(estimate_number, status, issue_date, expiration_date, customer_id,
       subtotal, tax_rate, tax_amount, total,
       signature_required, signed_at, signed_by_name, signed_by_email,
       notes, deposit_percentage, deposit_amount);

-- Insert estimate items
INSERT INTO public.estimate_items (estimate_id, description, quantity, rate, amount, sort_order)
SELECT 
  e.id,
  description,
  quantity,
  rate,
  amount,
  sort_order
FROM public.estimates e
CROSS JOIN LATERAL (
  SELECT * FROM (VALUES
    ('Site preparation and demolition', 1, 1500.00, 1500.00, 1),
    ('Framing and structural work', 1, 3500.00, 3500.00, 2),
    ('Electrical and plumbing rough-in', 1, 2800.00, 2800.00, 3),
    ('Insulation and drywall', 1, 2200.00, 2200.00, 4),
    ('Finishing and cleanup', 1, 1800.00, 1800.00, 5)
  ) AS items(description, quantity, rate, amount, sort_order)
  WHERE e.estimate_number IN ('EST-00002', 'EST-00004', 'EST-00006', 'EST-00008', 'EST-00010', 'EST-00012')
  
  UNION ALL
  
  SELECT * FROM (VALUES
    ('Initial consultation and design', 1, 2500.00, 2500.00, 1),
    ('Premium materials package', 1, 12000.00, 12000.00, 2),
    ('Specialized labor and installation', 1, 8500.00, 8500.00, 3),
    ('Quality control and testing', 1, 1500.00, 1500.00, 4),
    ('Warranty and maintenance package', 1, 3500.00, 3500.00, 5)
  ) AS items(description, quantity, rate, amount, sort_order)
  WHERE e.estimate_number IN ('EST-00003', 'EST-00005', 'EST-00007', 'EST-00009', 'EST-00011', 'EST-00013')
) AS estimate_items;