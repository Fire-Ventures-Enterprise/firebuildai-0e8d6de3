-- PREREQS
create extension if not exists pgcrypto;   -- for digest()

/* ------------------------------------------------------------------
   A) Hash tokens at rest + indexes + auto-hash triggers
------------------------------------------------------------------ */
alter table if exists public.estimates add column if not exists public_token_hash bytea;
alter table if exists public.invoices_enhanced add column if not exists public_token_hash bytea;

update public.estimates set public_token_hash = digest(public_token,'sha256')
where public_token is not null and public_token_hash is null;
update public.invoices_enhanced set public_token_hash = digest(public_token,'sha256')
where public_token is not null and public_token_hash is null;

create index if not exists idx_estimates_token_hash on public.estimates(public_token_hash);
create index if not exists idx_invoices_enhanced_token_hash on public.invoices_enhanced(public_token_hash);

create or replace function public._set_token_hash()
returns trigger language plpgsql as $$
begin
  if new.public_token is not null then
    new.public_token_hash := digest(new.public_token, 'sha256');
  else
    new.public_token_hash := null;
  end if;
  return new;
end $$;

drop trigger if exists trg_set_estimate_token_hash on public.estimates;
create trigger trg_set_estimate_token_hash
before insert or update of public_token on public.estimates
for each row execute function public._set_token_hash();

drop trigger if exists trg_set_invoice_token_hash on public.invoices_enhanced;
create trigger trg_set_invoice_token_hash
before insert or update of public_token on public.invoices_enhanced
for each row execute function public._set_token_hash();

/* ------------------------------------------------------------------
   B) Lightweight audit + view marks (no leakage)
------------------------------------------------------------------ */
create table if not exists public.estimate_views (
  id uuid primary key default gen_random_uuid(),
  estimate_id uuid not null references public.estimates(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  user_agent text,
  ip inet
);
create index if not exists idx_estimate_views_est on public.estimate_views(estimate_id, viewed_at desc);

-- Enable RLS on estimate_views
alter table public.estimate_views enable row level security;

-- Service role only policy for estimate_views
create policy "Service role only" on public.estimate_views
for all using (auth.role() = 'service_role');

/* ------------------------------------------------------------------
   C) Simple per-token/IP rate limiter (1-minute buckets)
------------------------------------------------------------------ */
create table if not exists public.portal_rate_limiter (
  token_hash bytea not null,
  ip inet,
  bucket_start timestamptz not null,
  cnt int not null default 1,
  primary key (token_hash, ip, bucket_start)
);

-- Enable RLS on portal_rate_limiter
alter table public.portal_rate_limiter enable row level security;

-- Service role only policy
create policy "Service role only" on public.portal_rate_limiter
for all using (auth.role() = 'service_role');

create or replace function public.portal_rate_limit(
  p_token text, p_ip inet, p_limit int default 20, p_window_secs int default 60
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash bytea := digest(p_token, 'sha256');
  v_bucket timestamptz := date_trunc('minute', now());
  v_cnt int;
begin
  insert into public.portal_rate_limiter(token_hash, ip, bucket_start, cnt)
  values (v_hash, p_ip, v_bucket, 1)
  on conflict (token_hash, ip, bucket_start)
  do update set cnt = public.portal_rate_limiter.cnt + 1
  returning cnt into v_cnt;

  return v_cnt <= p_limit;
end $$;

/* ------------------------------------------------------------------
   D) SECURE RPCs (hashed, scoped, definer, single-call bundles)
------------------------------------------------------------------ */

-- ESTIMATE: bundle (estimate + items) and mark viewed atomically
create or replace function public.get_estimate_bundle_by_token(
  p_token text,
  p_user_agent text default null,
  p_ip inet default null
) returns table(estimate jsonb, items jsonb)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_hash bytea := digest(p_token,'sha256');
begin
  -- soft rate limit (silent drop if exceeded)
  if not public.portal_rate_limit(p_token, p_ip, 20, 60) then
    perform pg_sleep(0.2);
    return;
  end if;

  select id into v_id from public.estimates where public_token_hash = v_hash and sent_at is not null limit 1;
  if v_id is null then
    -- return empty set: no oracle on existence
    return;
  end if;

  -- mark viewed (allow dup entries)
  insert into public.estimate_views(estimate_id, user_agent, ip)
  values (v_id, p_user_agent, p_ip)
  on conflict do nothing;

  -- Update estimate status to viewed if still sent
  update public.estimates 
  set status = 'viewed', viewed_at = now()
  where id = v_id and status = 'sent';

  return query
  select
    to_jsonb(e) - 'public_token' - 'public_token_hash' as estimate,
    coalesce(
      (select jsonb_agg(to_jsonb(it) order by it.sort_order)
         from public.estimate_items it
        where it.estimate_id = e.id),
      '[]'::jsonb
    ) as items
  from public.estimates e
  where e.id = v_id;
end $$;


-- INVOICE: bundle (invoice + items + payments)
create or replace function public.get_invoice_bundle_by_token(
  p_token text,
  p_user_agent text default null,
  p_ip inet default null
) returns table(invoice jsonb, items jsonb, payments jsonb)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_hash bytea := digest(p_token,'sha256');
begin
  -- soft rate limit
  if not public.portal_rate_limit(p_token, p_ip, 20, 60) then
    perform pg_sleep(0.2);
    return;
  end if;

  select id into v_id from public.invoices_enhanced where public_token_hash = v_hash and sent_at is not null limit 1;
  if v_id is null then
    return;
  end if;

  return query
  select
    to_jsonb(i) - 'public_token' - 'public_token_hash' as invoice,
    coalesce(
      (select jsonb_agg(to_jsonb(ii) order by ii.sort_order)
         from public.invoice_items_enhanced ii
        where ii.invoice_id = i.id),
      '[]'::jsonb
    ) as items,
    coalesce(
      (select jsonb_agg(to_jsonb(ip) order by ip.created_at)
         from public.invoice_payments ip
        where ip.invoice_id = i.id),
      '[]'::jsonb
    ) as payments
  from public.invoices_enhanced i
  where i.id = v_id;
end $$;

-- Accept estimate with token validation
create or replace function public.accept_estimate_secure(
  p_token text,
  p_name text default null,
  p_email text default null,
  p_signature text default null,
  p_user_agent text default null,
  p_ip inet default null
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_hash bytea := digest(p_token,'sha256');
begin
  -- Rate limit check
  if not public.portal_rate_limit(p_token, p_ip, 10, 60) then
    return false;
  end if;

  -- Find estimate
  select id into v_id from public.estimates 
  where public_token_hash = v_hash 
    and sent_at is not null 
    and status in ('sent', 'viewed')
  limit 1;
  
  if v_id is null then
    return false;
  end if;

  -- Update estimate
  update public.estimates
  set 
    status = 'accepted',
    accepted_at = now(),
    accepted_by_name = p_name,
    accepted_by_email = p_email,
    signed_by_name = p_name,
    signed_by_email = p_email,
    signature_data = p_signature,
    signed_at = case when p_signature is not null then now() else null end,
    accepted_ip = p_ip::text
  where id = v_id;

  -- Log acceptance
  insert into public.security_audit_log(
    event_type,
    event_description,
    metadata,
    created_at
  ) values (
    'estimate_accepted',
    'Estimate accepted via secure portal',
    jsonb_build_object(
      'estimate_id', v_id,
      'accepted_by', p_name,
      'ip', p_ip::text,
      'user_agent', p_user_agent
    ),
    now()
  );

  return true;
end $$;

-- Clean up old rate limit entries
create or replace function public.cleanup_portal_rate_limits()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.portal_rate_limiter
  where bucket_start < now() - interval '1 hour';
end $$;

-- Fix the calculate_invoice_profit function to use correct column names
CREATE OR REPLACE FUNCTION public.calculate_invoice_profit()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Calculate total expenses for the invoice (use 'total' column instead of 'amount')
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