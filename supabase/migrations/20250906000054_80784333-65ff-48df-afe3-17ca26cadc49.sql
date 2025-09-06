-- Fix Security Definer View issue by recreating views with SECURITY INVOKER
-- This ensures views respect the permissions and RLS policies of the querying user, not the view creator

-- Drop existing views
DROP VIEW IF EXISTS public.invoices_due_view CASCADE;
DROP VIEW IF EXISTS public.po_payment_totals CASCADE;

-- Recreate invoices_due_view with SECURITY INVOKER
CREATE VIEW public.invoices_due_view WITH (security_invoker = true) AS
SELECT 
    id,
    invoice_number AS number,
    customer_email,
    'cad'::text AS currency,
    (round((balance * (100)::numeric)))::integer AS due_cents,
    public_token
FROM invoices_enhanced i
WHERE (balance > (0)::numeric);

-- Grant appropriate permissions
GRANT SELECT ON public.invoices_due_view TO authenticated;
GRANT SELECT ON public.invoices_due_view TO anon;
GRANT SELECT ON public.invoices_due_view TO service_role;

-- Add comment explaining the view purpose
COMMENT ON VIEW public.invoices_due_view IS 'View for invoices with outstanding balances, formatted for payment processing. Uses SECURITY INVOKER to respect RLS policies.';

-- Recreate po_payment_totals with SECURITY INVOKER
CREATE VIEW public.po_payment_totals WITH (security_invoker = true) AS
SELECT 
    po.id AS po_id,
    po.total AS po_total,
    (COALESCE(sum(pp.amount), (0)::numeric))::numeric(14,2) AS paid_to_date,
    ((po.total - COALESCE(sum(pp.amount), (0)::numeric)))::numeric(14,2) AS outstanding,
    max(pp.paid_at) AS last_paid_at
FROM purchase_orders po
LEFT JOIN po_payments pp ON (pp.po_id = po.id)
GROUP BY po.id, po.total;

-- Grant appropriate permissions
GRANT SELECT ON public.po_payment_totals TO authenticated;
GRANT SELECT ON public.po_payment_totals TO anon;
GRANT SELECT ON public.po_payment_totals TO service_role;

-- Add comment explaining the view purpose
COMMENT ON VIEW public.po_payment_totals IS 'View for purchase order payment totals and outstanding amounts. Uses SECURITY INVOKER to respect RLS policies.';