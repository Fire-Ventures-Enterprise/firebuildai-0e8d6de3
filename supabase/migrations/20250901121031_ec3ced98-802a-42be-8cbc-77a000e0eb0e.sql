-- Add missing RPC for fetching invoice payments by token
create or replace function public.get_invoice_payments_by_token(p_token text)
returns setof public.invoice_payments
language sql
security definer
set search_path = public
as $$
  select ip.*
  from public.invoice_payments ip
  join public.invoices_enhanced i on i.id = ip.invoice_id
  where i.public_token_hash = digest(p_token,'sha256')
  order by ip.created_at
$$;