-- First, let's create some sample customers
INSERT INTO public.customers (
  first_name, last_name, company_name, email, phone, 
  address, city, province, postal_code, user_id
)
SELECT 
  first_name, last_name, company_name, email, phone,
  address, city, province, postal_code, auth.uid() as user_id
FROM (VALUES
  ('John', 'Johnson', 'Johnson Construction Ltd', 'billing@johnsonconstruction.ca', '416-555-0101', 
   '789 Builder Ave', 'Toronto', 'Ontario', 'M5V 3A8'),
  ('Sarah', 'Smith', 'Smith Renovations', 'accounts@smithreno.com', '905-555-0102',
   '456 Contractor Rd', 'Mississauga', 'Ontario', 'L5B 4M9'),
  ('David', 'Davis', 'Davis Properties', 'finance@davisproperties.ca', '647-555-0103',
   '321 Estate Blvd', 'Oakville', 'Ontario', 'L6H 7P5'),
  ('William', 'Wilson', 'Wilson Development', 'ap@wilsondev.com', '416-555-0104',
   '654 Project Way', 'Toronto', 'Ontario', 'M4E 2V5'),
  ('Michael', 'Brown', 'Brown Holdings Inc', 'payments@brownholdings.ca', '905-555-0105',
   '987 Corporate Dr', 'Brampton', 'Ontario', 'L6Y 5T6'),
  ('Carlos', 'Martinez', 'Martinez Construction', 'invoices@martinezcon.com', '647-555-0106',
   '159 Builder Lane', 'Scarborough', 'Ontario', 'M1B 5K7'),
  ('Lisa', 'Thompson', 'Thompson Real Estate', 'accounting@thompsonre.ca', '416-555-0107',
   '753 Property St', 'Toronto', 'Ontario', 'M5A 2N5'),
  ('Andrew', 'Anderson', 'Anderson Developments', 'billing@andersondev.com', '905-555-0108',
   '246 Growth Ave', 'Hamilton', 'Ontario', 'L8N 3T5'),
  ('Robert', 'Roberts', 'Roberts Construction Group', 'finance@robertsgroup.ca', '647-555-0109',
   '852 Build Blvd', 'North York', 'Ontario', 'M2N 6Z7'),
  ('Jennifer', 'Taylor', 'Taylor Properties LLC', 'accounts@taylorprop.com', '416-555-0110',
   '369 Investment Way', 'Toronto', 'Ontario', 'M4C 5L5')
) AS customers(first_name, last_name, company_name, email, phone, address, city, province, postal_code)
ON CONFLICT (email) DO NOTHING;