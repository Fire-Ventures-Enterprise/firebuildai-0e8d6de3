-- Drop and recreate views without SECURITY DEFINER
DROP VIEW IF EXISTS public.invoices_due_view CASCADE;
DROP VIEW IF EXISTS public.po_payment_totals CASCADE;

-- Recreate invoices_due_view without SECURITY DEFINER
CREATE VIEW public.invoices_due_view AS
SELECT 
  id,
  invoice_number AS number,
  customer_email,
  'cad'::text AS currency,
  (round((balance * (100)::numeric)))::integer AS due_cents,
  public_token
FROM invoices_enhanced i
WHERE (balance > (0)::numeric);

-- Recreate po_payment_totals without SECURITY DEFINER
CREATE VIEW public.po_payment_totals AS
SELECT 
  po.id AS po_id,
  po.total AS po_total,
  (COALESCE(sum(pp.amount), (0)::numeric))::numeric(14,2) AS paid_to_date,
  ((po.total - COALESCE(sum(pp.amount), (0)::numeric)))::numeric(14,2) AS outstanding,
  max(pp.paid_at) AS last_paid_at
FROM (purchase_orders po
  LEFT JOIN po_payments pp ON ((pp.po_id = po.id)))
GROUP BY po.id, po.total;

-- Fix functions with mutable search path by setting search_path explicitly
-- These functions already have SET search_path in their definitions but may need updating

-- Update po_sync_payment_status
CREATE OR REPLACE FUNCTION public.po_sync_payment_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  v_po uuid := COALESCE(NEW.po_id, OLD.po_id);
  v_paid numeric := 0;
  v_total numeric := 0;
  v_status text;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_paid
  FROM public.po_payments WHERE po_id = v_po;

  SELECT total INTO v_total
  FROM public.purchase_orders WHERE id = v_po;

  IF v_paid <= 0 THEN
    v_status := 'pending';
  ELSIF v_paid < v_total THEN
    v_status := 'partial';
  ELSE
    v_status := 'paid';
  END IF;

  UPDATE public.purchase_orders
  SET payment_status = v_status,
      updated_at = now()
  WHERE id = v_po;

  RETURN NULL;
END $function$;

-- Update mark_estimate_viewed
CREATE OR REPLACE FUNCTION public.mark_estimate_viewed(p_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.estimates 
  SET viewed_at = now(), 
      status = CASE WHEN status = 'sent' THEN 'viewed' ELSE status END
  WHERE public_token = p_token;
END;
$function$;

-- Update update_invoice_balance
CREATE OR REPLACE FUNCTION public.update_invoice_balance()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  -- Update the invoice's paid_amount and balance
  UPDATE public.invoices_enhanced
  SET 
    paid_amount = COALESCE((
      SELECT SUM(amount) 
      FROM public.invoice_payments 
      WHERE invoice_id = NEW.invoice_id 
      AND status = 'completed'
    ), 0),
    balance = total - COALESCE((
      SELECT SUM(amount) 
      FROM public.invoice_payments 
      WHERE invoice_id = NEW.invoice_id 
      AND status = 'completed'
    ), 0),
    status = CASE 
      WHEN total <= COALESCE((
        SELECT SUM(amount) 
        FROM public.invoice_payments 
        WHERE invoice_id = NEW.invoice_id 
        AND status = 'completed'
      ), 0) THEN 'paid'
      WHEN COALESCE((
        SELECT SUM(amount) 
        FROM public.invoice_payments 
        WHERE invoice_id = NEW.invoice_id 
        AND status = 'completed'
      ), 0) > 0 THEN 'partially_paid'
      ELSE status
    END,
    updated_at = now()
  WHERE id = NEW.invoice_id;
  
  RETURN NEW;
END;
$function$;

-- Update update_slot_availability
CREATE OR REPLACE FUNCTION public.update_slot_availability()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE public.consultation_slots 
    SET current_bookings = current_bookings + 1,
        is_available = CASE 
          WHEN current_bookings + 1 >= max_bookings THEN false 
          ELSE true 
        END
    WHERE id = NEW.slot_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
    UPDATE public.consultation_slots 
    SET current_bookings = GREATEST(0, current_bookings - 1),
        is_available = true
    WHERE id = NEW.slot_id;
  END IF;
  RETURN NEW;
END;
$function$;

-- Update update_invoice_profit_on_expense_change
CREATE OR REPLACE FUNCTION public.update_invoice_profit_on_expense_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  -- Update the related invoice's profit calculations
  IF NEW.invoice_id IS NOT NULL THEN
    UPDATE public.invoices_enhanced
    SET updated_at = now()
    WHERE id = NEW.invoice_id;
  END IF;
  
  -- If updating, also check old invoice_id
  IF TG_OP = 'UPDATE' AND OLD.invoice_id IS NOT NULL AND OLD.invoice_id != NEW.invoice_id THEN
    UPDATE public.invoices_enhanced
    SET updated_at = now()
    WHERE id = OLD.invoice_id;
  END IF;
  
  -- If deleting, update the old invoice
  IF TG_OP = 'DELETE' AND OLD.invoice_id IS NOT NULL THEN
    UPDATE public.invoices_enhanced
    SET updated_at = now()
    WHERE id = OLD.invoice_id;
    RETURN OLD;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update calculate_invoice_profit
CREATE OR REPLACE FUNCTION public.calculate_invoice_profit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  -- Calculate total expenses for the invoice
  NEW.total_expenses := COALESCE((
    SELECT SUM(total) 
    FROM public.expenses 
    WHERE invoice_id = NEW.id
  ), 0);
  
  -- Calculate gross profit
  NEW.gross_profit := NEW.total - NEW.total_expenses;
  
  -- Calculate profit margin (as percentage)
  IF NEW.total > 0 THEN
    NEW.profit_margin := ROUND((NEW.gross_profit / NEW.total * 100)::numeric, 2);
  ELSE
    NEW.profit_margin := 0;
  END IF;
  
  -- Calculate net profit (after overhead)
  NEW.net_profit := NEW.gross_profit - (NEW.total * NEW.overhead_percentage / 100);
  
  RETURN NEW;
END;
$function$;