-- Auto-sync payment_status from po_payments
CREATE OR REPLACE FUNCTION public.po_sync_payment_status()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
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
END $$;

-- Create trigger for auto-syncing
DROP TRIGGER IF EXISTS trg_sync_po_payments ON public.po_payments;
CREATE TRIGGER trg_sync_po_payments
AFTER INSERT OR UPDATE OR DELETE ON public.po_payments
FOR EACH ROW EXECUTE FUNCTION public.po_sync_payment_status();

-- Convenience view for payment totals
CREATE OR REPLACE VIEW public.po_payment_totals AS
SELECT
  po.id AS po_id,
  po.total AS po_total,
  COALESCE(SUM(pp.amount), 0)::numeric(14,2) AS paid_to_date,
  (po.total - COALESCE(SUM(pp.amount), 0))::numeric(14,2) AS outstanding,
  MAX(pp.paid_at) AS last_paid_at
FROM public.purchase_orders po
LEFT JOIN public.po_payments pp ON pp.po_id = po.id
GROUP BY po.id, po.total;

-- Add receipt_url column for attachments (optional)
ALTER TABLE public.po_payments ADD COLUMN IF NOT EXISTS receipt_url text;