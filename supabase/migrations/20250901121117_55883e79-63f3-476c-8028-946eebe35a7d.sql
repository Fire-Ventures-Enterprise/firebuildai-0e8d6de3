-- Ensure pgcrypto is enabled
create extension if not exists pgcrypto;

-- Add missing RPC for fetching invoice payments by token
create or replace function public.get_invoice_payments_by_token(p_token text)
returns setof public.invoice_payments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invoice_id uuid;
  v_hash bytea;
begin
  -- Hash the token
  v_hash := digest(p_token,'sha256');
  
  -- Find the invoice ID
  select id into v_invoice_id 
  from public.invoices_enhanced 
  where public_token_hash = v_hash 
  limit 1;
  
  -- Return empty if no invoice found
  if v_invoice_id is null then
    return;
  end if;
  
  -- Return the payments
  return query
  select ip.*
  from public.invoice_payments ip
  where ip.invoice_id = v_invoice_id
  order by ip.created_at;
end $$;