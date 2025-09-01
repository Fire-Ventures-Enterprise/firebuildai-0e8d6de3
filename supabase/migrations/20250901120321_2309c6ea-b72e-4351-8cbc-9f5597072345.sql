-- Fix: Drop existing policy first
drop policy if exists "Service role only" on public.estimate_views;

-- Add RLS for estimate_views with correct policy
alter table public.estimate_views enable row level security;
create policy "Service role only" on public.estimate_views for all using (auth.role() = 'service_role');