-- Create simulated data for invoices and estimates
DO $$
DECLARE
  current_user_id uuid := '74104278-d85d-4b54-9075-df54e548d1fb';
  customer_1 uuid;
  customer_2 uuid;
  customer_3 uuid;
  customer_4 uuid;
  customer_5 uuid;
  invoice_id uuid;
  estimate_id uuid;
BEGIN
  -- Insert 5 sample customers
  INSERT INTO public.customers (first_name, last_name, company_name, email, phone, address, city, province, postal_code, user_id)
  VALUES ('John', 'Johnson', 'Johnson Construction Ltd', 'billing@johnsonconstruction.ca', '416-555-0101', 
          '789 Builder Ave', 'Toronto', 'Ontario', 'M5V 3A8', current_user_id)
  RETURNING id INTO customer_1;
  
  INSERT INTO public.customers (first_name, last_name, company_name, email, phone, address, city, province, postal_code, user_id)
  VALUES ('Sarah', 'Smith', 'Smith Renovations', 'accounts@smithreno.com', '905-555-0102',
          '456 Contractor Rd', 'Mississauga', 'Ontario', 'L5B 4M9', current_user_id)
  RETURNING id INTO customer_2;
  
  INSERT INTO public.customers (first_name, last_name, company_name, email, phone, address, city, province, postal_code, user_id)
  VALUES ('David', 'Davis', 'Davis Properties', 'finance@davisproperties.ca', '647-555-0103',
          '321 Estate Blvd', 'Oakville', 'Ontario', 'L6H 7P5', current_user_id)
  RETURNING id INTO customer_3;
  
  INSERT INTO public.customers (first_name, last_name, company_name, email, phone, address, city, province, postal_code, user_id)
  VALUES ('William', 'Wilson', 'Wilson Development', 'ap@wilsondev.com', '416-555-0104',
          '654 Project Way', 'Toronto', 'Ontario', 'M4E 2V5', current_user_id)
  RETURNING id INTO customer_4;
  
  INSERT INTO public.customers (first_name, last_name, company_name, email, phone, address, city, province, postal_code, user_id)
  VALUES ('Michael', 'Brown', 'Brown Holdings Inc', 'payments@brownholdings.ca', '905-555-0105',
          '987 Corporate Dr', 'Brampton', 'Ontario', 'L6Y 5T6', current_user_id)
  RETURNING id INTO customer_5;

  -- Create historical invoices
  
  -- January - 2 Paid invoices
  INSERT INTO public.invoices_enhanced (
    invoice_number, po_number, status, issue_date, due_date, days_to_payment,
    customer_id, customer_name, customer_email, customer_phone, customer_address,
    customer_city, customer_province, customer_postal_code,
    subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes, user_id
  ) VALUES (
    'INV-00002', 'PO-2025-001', 'paid', '2025-01-05'::timestamp, '2025-01-20'::timestamp, 15,
    customer_1, 'Johnson Construction Ltd', 'billing@johnsonconstruction.ca', '416-555-0101', '789 Builder Ave',
    'Toronto', 'Ontario', 'M5V 3A8',
    5250.00, 13, 682.50, 5932.50, 5932.50, 0.00,
    'Foundation repair work completed', current_user_id
  ) RETURNING id INTO invoice_id;
  
  INSERT INTO public.invoice_items_enhanced (invoice_id, item_name, description, quantity, rate, amount, tax, sort_order)
  VALUES 
    (invoice_id, 'Labor', 'General construction labor', 40, 85.00, 3400.00, true, 1),
    (invoice_id, 'Materials', 'Construction materials', 1, 1850.00, 1850.00, true, 2);

  INSERT INTO public.invoices_enhanced (
    invoice_number, po_number, status, issue_date, due_date, days_to_payment,
    customer_id, customer_name, customer_email, customer_phone, customer_address,
    customer_city, customer_province, customer_postal_code,
    subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes, user_id
  ) VALUES (
    'INV-00003', 'PO-2025-002', 'paid', '2025-01-12'::timestamp, '2025-01-27'::timestamp, 15,
    customer_2, 'Smith Renovations', 'accounts@smithreno.com', '905-555-0102', '456 Contractor Rd',
    'Mississauga', 'Ontario', 'L5B 4M9',
    12800.00, 13, 1664.00, 14464.00, 14464.00, 0.00,
    'Kitchen renovation - Phase 1', current_user_id
  );

  -- February - 1 Paid, 1 Overdue
  INSERT INTO public.invoices_enhanced (
    invoice_number, po_number, status, issue_date, due_date, days_to_payment,
    customer_id, customer_name, customer_email, customer_phone, customer_address,
    customer_city, customer_province, customer_postal_code,
    subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes, user_id
  ) VALUES (
    'INV-00004', 'PO-2025-003', 'paid', '2025-02-01'::timestamp, '2025-02-16'::timestamp, 15,
    customer_3, 'Davis Properties', 'finance@davisproperties.ca', '647-555-0103', '321 Estate Blvd',
    'Oakville', 'Ontario', 'L6H 7P5',
    8900.00, 13, 1157.00, 10057.00, 10057.00, 0.00,
    'Bathroom renovation - Master suite', current_user_id
  );

  INSERT INTO public.invoices_enhanced (
    invoice_number, po_number, status, issue_date, due_date, days_to_payment,
    customer_id, customer_name, customer_email, customer_phone, customer_address,
    customer_city, customer_province, customer_postal_code,
    subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes, user_id
  ) VALUES (
    'INV-00005', 'PO-2025-004', 'overdue', '2025-02-08'::timestamp, '2025-02-23'::timestamp, 15,
    customer_4, 'Wilson Development', 'ap@wilsondev.com', '416-555-0104', '654 Project Way',
    'Toronto', 'Ontario', 'M4E 2V5',
    15600.00, 13, 2028.00, 17628.00, 0.00, 17628.00,
    'Commercial office buildout - pending payment', current_user_id
  ) RETURNING id INTO invoice_id;
  
  INSERT INTO public.invoice_items_enhanced (invoice_id, item_name, description, quantity, rate, amount, tax, sort_order)
  VALUES 
    (invoice_id, 'Design Services', 'Architectural design', 20, 125.00, 2500.00, true, 1),
    (invoice_id, 'Project Management', 'Construction management', 60, 95.00, 5700.00, true, 2),
    (invoice_id, 'Specialized Labor', 'Electrical and plumbing', 45, 110.00, 4950.00, true, 3),
    (invoice_id, 'Premium Materials', 'High-end materials', 1, 2450.00, 2450.00, true, 4);

  -- March - 2 Paid, 1 Overdue, 1 Sent
  INSERT INTO public.invoices_enhanced (
    invoice_number, po_number, status, issue_date, due_date, days_to_payment,
    customer_id, customer_name, customer_email, customer_phone, customer_address,
    customer_city, customer_province, customer_postal_code,
    subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes, user_id
  ) VALUES (
    'INV-00006', 'PO-2025-005', 'paid', '2025-03-01'::timestamp, '2025-03-16'::timestamp, 15,
    customer_5, 'Brown Holdings Inc', 'payments@brownholdings.ca', '905-555-0105', '987 Corporate Dr',
    'Brampton', 'Ontario', 'L6Y 5T6',
    7200.00, 13, 936.00, 8136.00, 8136.00, 0.00,
    'Electrical system upgrade', current_user_id
  );

  INSERT INTO public.invoices_enhanced (
    invoice_number, po_number, status, issue_date, due_date, days_to_payment,
    customer_id, customer_name, customer_email, customer_phone, customer_address,
    customer_city, customer_province, customer_postal_code,
    subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes, user_id
  ) VALUES (
    'INV-00007', 'PO-2025-006', 'paid', '2025-03-05'::timestamp, '2025-03-20'::timestamp, 15,
    customer_1, 'Johnson Construction Ltd', 'billing@johnsonconstruction.ca', '416-555-0101', '789 Builder Ave',
    'Toronto', 'Ontario', 'M5V 3A8',
    9500.00, 13, 1235.00, 10735.00, 10735.00, 0.00,
    'Deck construction and landscaping', current_user_id
  );

  INSERT INTO public.invoices_enhanced (
    invoice_number, po_number, status, issue_date, due_date, days_to_payment,
    customer_id, customer_name, customer_email, customer_phone, customer_address,
    customer_city, customer_province, customer_postal_code,
    subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes, user_id
  ) VALUES (
    'INV-00008', 'PO-2025-007', 'overdue', '2025-03-10'::timestamp, '2025-03-25'::timestamp, 15,
    customer_3, 'Davis Properties', 'finance@davisproperties.ca', '647-555-0103', '321 Estate Blvd',
    'Oakville', 'Ontario', 'L6H 7P5',
    22000.00, 13, 2860.00, 24860.00, 5000.00, 19860.00,
    'Full home renovation - partial payment received', current_user_id
  );

  INSERT INTO public.invoices_enhanced (
    invoice_number, po_number, status, issue_date, due_date, days_to_payment,
    customer_id, customer_name, customer_email, customer_phone, customer_address,
    customer_city, customer_province, customer_postal_code,
    subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes, user_id
  ) VALUES (
    'INV-00009', 'PO-2025-008', 'sent', '2025-03-20'::timestamp, '2025-04-04'::timestamp, 15,
    customer_2, 'Smith Renovations', 'accounts@smithreno.com', '905-555-0102', '456 Contractor Rd',
    'Mississauga', 'Ontario', 'L5B 4M9',
    6750.00, 13, 877.50, 7627.50, 0.00, 7627.50,
    'Plumbing repairs and upgrades', current_user_id
  );

  -- Current month (August) - Recent invoices
  INSERT INTO public.invoices_enhanced (
    invoice_number, po_number, status, issue_date, due_date, days_to_payment,
    customer_id, customer_name, customer_email, customer_phone, customer_address,
    customer_city, customer_province, customer_postal_code,
    subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes, user_id
  ) VALUES (
    'INV-00010', 'PO-2025-009', 'sent', '2025-08-15'::timestamp, '2025-08-30'::timestamp, 15,
    customer_4, 'Wilson Development', 'ap@wilsondev.com', '416-555-0104', '654 Project Way',
    'Toronto', 'Ontario', 'M4E 2V5',
    11300.00, 13, 1469.00, 12769.00, 0.00, 12769.00,
    'Roof replacement project', current_user_id
  );

  INSERT INTO public.invoices_enhanced (
    invoice_number, po_number, status, issue_date, due_date, days_to_payment,
    customer_id, customer_name, customer_email, customer_phone, customer_address,
    customer_city, customer_province, customer_postal_code,
    subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes, user_id
  ) VALUES (
    'INV-00011', 'PO-2025-010', 'draft', '2025-08-25'::timestamp, '2025-09-09'::timestamp, 15,
    customer_5, 'Brown Holdings Inc', 'payments@brownholdings.ca', '905-555-0105', '987 Corporate Dr',
    'Brampton', 'Ontario', 'L6Y 5T6',
    18500.00, 13, 2405.00, 20905.00, 0.00, 20905.00,
    'Complete basement finishing - quote pending approval', current_user_id
  );

  -- Create Estimates with various statuses
  
  -- January - 1 Accepted, 1 Declined
  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, signed_at, signed_by_name, signed_by_email,
    notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00002', 'accepted', '2025-01-03'::timestamp, '2025-01-18'::timestamp,
    customer_1, current_user_id,
    5800.00, 13, 754.00, 6554.00,
    true, '2025-01-05'::timestamp, 'John Johnson', 'john@johnsonconstruction.ca',
    'Foundation repair - Accepted and work commenced', 25, 1638.50
  ) RETURNING id INTO estimate_id;
  
  INSERT INTO public.estimate_items (estimate_id, description, quantity, rate, amount, sort_order)
  VALUES 
    (estimate_id, 'Site preparation', 1, 1500.00, 1500.00, 1),
    (estimate_id, 'Structural work', 1, 3500.00, 3500.00, 2),
    (estimate_id, 'Cleanup', 1, 800.00, 800.00, 3);

  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00003', 'declined', '2025-01-08'::timestamp, '2025-01-23'::timestamp,
    customer_3, current_user_id,
    15000.00, 13, 1950.00, 16950.00,
    true, 'Large renovation - Client chose another contractor', 30, 5085.00
  );

  -- February - 1 Accepted, 1 Pending
  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, signed_at, signed_by_name, signed_by_email,
    notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00004', 'accepted', '2025-02-02'::timestamp, '2025-02-17'::timestamp,
    customer_3, current_user_id,
    9200.00, 13, 1196.00, 10396.00,
    true, '2025-02-04'::timestamp, 'Sarah Davis', 'sarah@davisproperties.ca',
    'Bathroom renovation - Work completed', 25, 2599.00
  );

  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00005', 'pending', '2025-02-14'::timestamp, '2025-03-01'::timestamp,
    customer_2, current_user_id,
    32000.00, 13, 4160.00, 36160.00,
    true, 'Complete home renovation - Awaiting decision', 30, 10848.00
  );

  -- March - 1 Declined, 1 Accepted, 1 Pending
  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00006', 'declined', '2025-03-05'::timestamp, '2025-03-20'::timestamp,
    customer_4, current_user_id,
    12000.00, 13, 1560.00, 13560.00,
    true, 'Deck and landscaping - Budget exceeded', 25, 3390.00
  );

  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, signed_at, signed_by_name, signed_by_email,
    notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00007', 'accepted', '2025-03-12'::timestamp, '2025-03-27'::timestamp,
    customer_3, current_user_id,
    24000.00, 13, 3120.00, 27120.00,
    true, '2025-03-14'::timestamp, 'Lisa Thompson', 'lisa@thompsonre.ca',
    'Full home renovation - In progress', 35, 9492.00
  );

  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00008', 'pending', '2025-03-18'::timestamp, '2025-04-02'::timestamp,
    customer_5, current_user_id,
    8900.00, 13, 1157.00, 10057.00,
    false, 'Plumbing system overhaul - Client reviewing', 25, 2514.25
  );

  -- Current month (August) - Recent estimates
  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00009', 'pending', '2025-08-10'::timestamp, '2025-08-25'::timestamp,
    customer_1, current_user_id,
    13500.00, 13, 1755.00, 15255.00,
    true, 'Roof replacement - Awaiting approval', 30, 4576.50
  );

  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00010', 'pending', '2025-08-20'::timestamp, '2025-09-04'::timestamp,
    customer_2, current_user_id,
    19800.00, 13, 2574.00, 22374.00,
    false, 'Basement finishing - Quote under review', 25, 5593.50
  );

  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, signed_at, signed_by_name, signed_by_email,
    notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00011', 'accepted', '2025-08-22'::timestamp, '2025-09-06'::timestamp,
    customer_4, current_user_id,
    4200.00, 13, 546.00, 4746.00,
    true, '2025-08-23'::timestamp, 'Tom Wilson', 'tom@wilsondev.com',
    'Emergency plumbing repair - Work started', 0, 0.00
  );

  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00012', 'declined', '2025-08-24'::timestamp, '2025-09-08'::timestamp,
    customer_5, current_user_id,
    28000.00, 13, 3640.00, 31640.00,
    true, 'Commercial buildout - Project cancelled', 40, 12656.00
  );

END $$;