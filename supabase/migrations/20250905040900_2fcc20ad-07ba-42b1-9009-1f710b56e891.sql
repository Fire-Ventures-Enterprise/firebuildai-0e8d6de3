-- Create the RPC function for creating work orders from invoices
CREATE OR REPLACE FUNCTION public.create_work_order_from_invoice(p_invoice_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_inv RECORD;
  v_sched RECORD;
  v_wo_id UUID;
  v_user_id UUID;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  -- Get invoice details
  SELECT i.*, i.service_address AS address
  INTO v_inv
  FROM invoices_enhanced i
  WHERE i.id = p_invoice_id AND i.user_id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invoice not found or access denied';
  END IF;

  -- Get schedule if exists
  SELECT * INTO v_sched FROM invoice_scheduling WHERE invoice_id = p_invoice_id;

  -- Create work order
  INSERT INTO work_orders (
    user_id, invoice_id, schedule_id, title, service_address,
    starts_at, ends_at, team_id, instructions, created_by
  )
  VALUES (
    v_user_id, 
    p_invoice_id, 
    v_sched.id,
    COALESCE('Invoice ' || v_inv.invoice_number, 'Work Order'),
    COALESCE(v_inv.service_address, v_inv.customer_address),
    COALESCE(v_sched.starts_at, NOW()),
    COALESCE(v_sched.ends_at, NOW() + INTERVAL '2 hours'),
    v_sched.team_id,
    v_inv.notes,
    v_user_id
  )
  RETURNING id INTO v_wo_id;

  -- Copy invoice items as tasks/materials WITHOUT prices
  INSERT INTO work_order_items (
    work_order_id, source_invoice_item_id, kind, description, 
    quantity, unit, sort_order
  )
  SELECT 
    v_wo_id,
    ii.id,
    'task',
    COALESCE(ii.item_name, ii.description),
    COALESCE(ii.quantity, 1),
    NULL,
    COALESCE(ii.sort_order, 0)
  FROM invoice_items_enhanced ii 
  WHERE ii.invoice_id = p_invoice_id;

  RETURN v_wo_id;
END;
$function$;