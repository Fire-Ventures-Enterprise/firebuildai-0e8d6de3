-- Create sample customers and then invoices/estimates with historical data
DO $$
DECLARE
  customer_1 uuid;
  customer_2 uuid;
  customer_3 uuid;
  customer_4 uuid;
  customer_5 uuid;
  customer_6 uuid;
  customer_7 uuid;
  customer_8 uuid;
  customer_9 uuid;
  customer_10 uuid;
  invoice_id uuid;
  estimate_id uuid;
BEGIN
  -- Insert customers and get their IDs
  INSERT INTO public.customers (first_name, last_name, company_name, email, phone, address, city, province, postal_code, user_id)
  VALUES ('John', 'Johnson', 'Johnson Construction Ltd', 'billing@johnsonconstruction.ca', '416-555-0101', 
          '789 Builder Ave', 'Toronto', 'Ontario', 'M5V 3A8', auth.uid())
  RETURNING id INTO customer_1;
  
  INSERT INTO public.customers (first_name, last_name, company_name, email, phone, address, city, province, postal_code, user_id)
  VALUES ('Sarah', 'Smith', 'Smith Renovations', 'accounts@smithreno.com', '905-555-0102',
          '456 Contractor Rd', 'Mississauga', 'Ontario', 'L5B 4M9', auth.uid())
  RETURNING id INTO customer_2;
  
  INSERT INTO public.customers (first_name, last_name, company_name, email, phone, address, city, province, postal_code, user_id)
  VALUES ('David', 'Davis', 'Davis Properties', 'finance@davisproperties.ca', '647-555-0103',
          '321 Estate Blvd', 'Oakville', 'Ontario', 'L6H 7P5', auth.uid())
  RETURNING id INTO customer_3;
  
  INSERT INTO public.customers (first_name, last_name, company_name, email, phone, address, city, province, postal_code, user_id)
  VALUES ('William', 'Wilson', 'Wilson Development', 'ap@wilsondev.com', '416-555-0104',
          '654 Project Way', 'Toronto', 'Ontario', 'M4E 2V5', auth.uid())
  RETURNING id INTO customer_4;
  
  INSERT INTO public.customers (first_name, last_name, company_name, email, phone, address, city, province, postal_code, user_id)
  VALUES ('Michael', 'Brown', 'Brown Holdings Inc', 'payments@brownholdings.ca', '905-555-0105',
          '987 Corporate Dr', 'Brampton', 'Ontario', 'L6Y 5T6', auth.uid())
  RETURNING id INTO customer_5;

  -- Insert some invoices with different statuses
  
  -- January Paid Invoice
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
    'Foundation repair work completed', auth.uid()
  ) RETURNING id INTO invoice_id;
  
  -- Add items to invoice
  INSERT INTO public.invoice_items_enhanced (invoice_id, item_name, description, quantity, rate, amount, tax, sort_order)
  VALUES 
    (invoice_id, 'Labor', 'General construction labor', 40, 85.00, 3400.00, true, 1),
    (invoice_id, 'Materials', 'Construction materials and supplies', 1, 1850.00, 1850.00, true, 2);

  -- February Overdue Invoice
  INSERT INTO public.invoices_enhanced (
    invoice_number, po_number, status, issue_date, due_date, days_to_payment,
    customer_id, customer_name, customer_email, customer_phone, customer_address,
    customer_city, customer_province, customer_postal_code,
    subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes, user_id
  ) VALUES (
    'INV-00003', 'PO-2025-002', 'overdue', '2025-02-08'::timestamp, '2025-02-23'::timestamp, 15,
    customer_4, 'Wilson Development', 'ap@wilsondev.com', '416-555-0104', '654 Project Way',
    'Toronto', 'Ontario', 'M4E 2V5',
    15600.00, 13, 2028.00, 17628.00, 0.00, 17628.00,
    'Commercial office buildout - pending payment', auth.uid()
  ) RETURNING id INTO invoice_id;
  
  -- Add items to invoice
  INSERT INTO public.invoice_items_enhanced (invoice_id, item_name, description, quantity, rate, amount, tax, sort_order)
  VALUES 
    (invoice_id, 'Design Services', 'Architectural design and planning', 20, 125.00, 2500.00, true, 1),
    (invoice_id, 'Project Management', 'Construction project management', 60, 95.00, 5700.00, true, 2),
    (invoice_id, 'Specialized Labor', 'Electrical and plumbing specialists', 45, 110.00, 4950.00, true, 3),
    (invoice_id, 'Premium Materials', 'High-end finishing materials', 1, 2450.00, 2450.00, true, 4);

  -- March Paid Invoice
  INSERT INTO public.invoices_enhanced (
    invoice_number, po_number, status, issue_date, due_date, days_to_payment,
    customer_id, customer_name, customer_email, customer_phone, customer_address,
    customer_city, customer_province, customer_postal_code,
    subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes, user_id
  ) VALUES (
    'INV-00004', 'PO-2025-003', 'paid', '2025-03-01'::timestamp, '2025-03-16'::timestamp, 15,
    customer_2, 'Smith Renovations', 'accounts@smithreno.com', '905-555-0102', '456 Contractor Rd',
    'Mississauga', 'Ontario', 'L5B 4M9',
    9500.00, 13, 1235.00, 10735.00, 10735.00, 0.00,
    'Deck construction and landscaping', auth.uid()
  );

  -- Current Month Sent Invoice
  INSERT INTO public.invoices_enhanced (
    invoice_number, po_number, status, issue_date, due_date, days_to_payment,
    customer_id, customer_name, customer_email, customer_phone, customer_address,
    customer_city, customer_province, customer_postal_code,
    subtotal, tax_rate, tax_amount, total, paid_amount, balance, notes, user_id
  ) VALUES (
    'INV-00005', 'PO-2025-004', 'sent', '2025-08-15'::timestamp, '2025-08-30'::timestamp, 15,
    customer_3, 'Davis Properties', 'finance@davisproperties.ca', '647-555-0103', '321 Estate Blvd',
    'Oakville', 'Ontario', 'L6H 7P5',
    11300.00, 13, 1469.00, 12769.00, 0.00, 12769.00,
    'Roof replacement project', auth.uid()
  );

  -- Insert Estimates with different statuses
  
  -- January Accepted Estimate
  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, signed_at, signed_by_name, signed_by_email,
    notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00002', 'accepted', '2025-01-03'::timestamp, '2025-01-18'::timestamp,
    customer_1, auth.uid(),
    5800.00, 13, 754.00, 6554.00,
    true, '2025-01-05'::timestamp, 'John Johnson', 'john@johnsonconstruction.ca',
    'Foundation repair - Accepted and work commenced', 25, 1638.50
  ) RETURNING id INTO estimate_id;
  
  -- Add items to estimate
  INSERT INTO public.estimate_items (estimate_id, description, quantity, rate, amount, sort_order)
  VALUES 
    (estimate_id, 'Site preparation and demolition', 1, 1500.00, 1500.00, 1),
    (estimate_id, 'Framing and structural work', 1, 3500.00, 3500.00, 2),
    (estimate_id, 'Finishing and cleanup', 1, 800.00, 800.00, 3);

  -- February Declined Estimate
  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00003', 'declined', '2025-02-14'::timestamp, '2025-03-01'::timestamp,
    customer_5, auth.uid(),
    15000.00, 13, 1950.00, 16950.00,
    true, 'Large renovation project - Client chose another contractor', 30, 5085.00
  );

  -- Current Month Pending Estimate
  INSERT INTO public.estimates (
    estimate_number, status, issue_date, expiration_date,
    customer_id, user_id,
    subtotal, tax_rate, tax_amount, total,
    signature_required, notes, deposit_percentage, deposit_amount
  ) VALUES (
    'EST-00004', 'pending', '2025-08-20'::timestamp, '2025-09-04'::timestamp,
    customer_4, auth.uid(),
    19800.00, 13, 2574.00, 22374.00,
    false, 'Basement finishing - Quote under review', 25, 5593.50
  );

END $$;