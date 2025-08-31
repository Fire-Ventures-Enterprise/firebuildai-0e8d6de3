-- =====================================================
-- MIGRATION: Add theme, vendors, enhanced POs, and job chat
-- =====================================================

-- First, add company_id column to profiles if it doesn't exist
-- This will be used for multi-tenancy
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS company_id uuid DEFAULT gen_random_uuid();

-- Create index on company_id for performance
CREATE INDEX IF NOT EXISTS profiles_company_idx ON public.profiles(company_id);

-- Helper function using company_id for RLS
CREATE OR REPLACE FUNCTION public.current_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Grant execute privileges
REVOKE ALL ON FUNCTION public.current_user_company_id() FROM public;
GRANT EXECUTE ON FUNCTION public.current_user_company_id() TO authenticated, anon;

-- =====================================================
-- 1) UI THEME ON PROFILES
-- =====================================================

DO $$ BEGIN
  CREATE TYPE public.theme_pref AS ENUM ('system','light','dark');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS theme public.theme_pref NOT NULL DEFAULT 'system';

-- =====================================================
-- 2) VENDORS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.vendors (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL DEFAULT auth.uid(),
  name           text NOT NULL,
  contact_name   text,
  email          text,
  phone          text,
  address        text,
  payment_terms  text DEFAULT 'Net 30',
  default_tax_rate numeric(6,3) DEFAULT 13,
  notes          text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vendors_user_idx ON public.vendors(user_id);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- RLS: Users can manage their own vendors
CREATE POLICY vendors_select ON public.vendors
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY vendors_insert ON public.vendors
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY vendors_update ON public.vendors
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY vendors_delete ON public.vendors
FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- 3) ENHANCED PURCHASE ORDERS WITH AUTO NUMBERING
-- =====================================================

-- Drop existing PO table constraints if they exist
ALTER TABLE IF EXISTS public.purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_vendor_id_fkey;
ALTER TABLE IF EXISTS public.purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_job_id_fkey;

-- Update existing purchase_orders table with new columns
ALTER TABLE public.purchase_orders
  ADD COLUMN IF NOT EXISTS vendor_id uuid,
  ADD COLUMN IF NOT EXISTS vendor_name_override text,
  ADD COLUMN IF NOT EXISTS vendor_email_override text,
  ADD COLUMN IF NOT EXISTS expected_delivery date,
  ADD COLUMN IF NOT EXISTS terms text DEFAULT 'Net 30',
  ADD COLUMN IF NOT EXISTS approval_date timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by_name text,
  ADD COLUMN IF NOT EXISTS approved_by_id uuid;

-- Add foreign key for vendors (nullable to maintain backward compatibility)
ALTER TABLE public.purchase_orders
  ADD CONSTRAINT purchase_orders_vendor_id_fkey 
  FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE SET NULL;

-- Ensure PO number generation works
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'po_seq' AND relkind = 'S') THEN
    CREATE SEQUENCE public.po_seq;
  END IF;
END $$;

-- Create or replace the PO number generation function
CREATE OR REPLACE FUNCTION public.generate_po_number_for_user()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_seq bigint;
BEGIN
  v_seq := nextval('public.po_seq');
  RETURN 'PO-' || to_char(now(), 'YYYY') || '-' || lpad(v_seq::text, 6, '0');
END $$;

-- Ensure PO number trigger exists on existing table
CREATE OR REPLACE FUNCTION public.set_po_number_if_null()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.po_number IS NULL THEN
    NEW.po_number := public.generate_po_number_for_user();
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS ensure_po_number ON public.purchase_orders;
CREATE TRIGGER ensure_po_number
BEFORE INSERT ON public.purchase_orders
FOR EACH ROW EXECUTE FUNCTION public.set_po_number_if_null();

-- =====================================================
-- 4) JOB-BASED CHAT SYSTEM
-- =====================================================

-- Chat roles enum
DO $$ BEGIN
  CREATE TYPE public.chat_role AS ENUM ('member','manager','owner');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Job chat rooms (one per job)
CREATE TABLE IF NOT EXISTS public.job_chats (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  name        text,
  description text,
  created_by  uuid NOT NULL DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(job_id) -- One chat per job
);

CREATE INDEX IF NOT EXISTS job_chats_job_idx ON public.job_chats(job_id);

-- Chat members
CREATE TABLE IF NOT EXISTS public.job_chat_members (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id   uuid NOT NULL REFERENCES public.job_chats(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL,
  role      public.chat_role NOT NULL DEFAULT 'member',
  added_by  uuid,
  added_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(chat_id, user_id)
);

CREATE INDEX IF NOT EXISTS jcm_user_idx ON public.job_chat_members(user_id);
CREATE INDEX IF NOT EXISTS jcm_chat_idx ON public.job_chat_members(chat_id);

-- Chat messages
CREATE TABLE IF NOT EXISTS public.job_chat_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id     uuid NOT NULL REFERENCES public.job_chats(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL,
  message     text NOT NULL,
  attachments jsonb DEFAULT '[]'::jsonb,
  edited      boolean DEFAULT false,
  edited_at   timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS jmsg_chat_idx ON public.job_chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS jmsg_created_idx ON public.job_chat_messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.job_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS for job chats - accessible by job owner and chat members
CREATE POLICY job_chats_select ON public.job_chats
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE jobs.id = job_id AND jobs.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.job_chat_members 
    WHERE job_chat_members.chat_id = job_chats.id 
    AND job_chat_members.user_id = auth.uid()
  )
);

CREATE POLICY job_chats_insert ON public.job_chats
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE jobs.id = job_id AND jobs.user_id = auth.uid()
  )
);

CREATE POLICY job_chats_update ON public.job_chats
FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY job_chats_delete ON public.job_chats
FOR DELETE USING (created_by = auth.uid());

-- RLS for chat members - visible to all members
CREATE POLICY chat_members_select ON public.job_chat_members
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.job_chat_members m
    WHERE m.chat_id = job_chat_members.chat_id 
    AND m.user_id = auth.uid()
  )
);

-- Only chat owners/managers can add members
CREATE POLICY chat_members_insert ON public.job_chat_members
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.job_chat_members m
    WHERE m.chat_id = job_chat_members.chat_id 
    AND m.user_id = auth.uid()
    AND m.role IN ('owner', 'manager')
  ) OR EXISTS (
    SELECT 1 FROM public.job_chats jc
    JOIN public.jobs j ON j.id = jc.job_id
    WHERE jc.id = job_chat_members.chat_id
    AND j.user_id = auth.uid()
  )
);

-- Members can update their own membership
CREATE POLICY chat_members_update ON public.job_chat_members
FOR UPDATE USING (user_id = auth.uid());

-- Only owners/managers can remove members
CREATE POLICY chat_members_delete ON public.job_chat_members
FOR DELETE USING (
  user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.job_chat_members m
    WHERE m.chat_id = job_chat_members.chat_id 
    AND m.user_id = auth.uid()
    AND m.role IN ('owner', 'manager')
  )
);

-- RLS for chat messages
CREATE POLICY chat_messages_select ON public.job_chat_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.job_chat_members
    WHERE job_chat_members.chat_id = job_chat_messages.chat_id
    AND job_chat_members.user_id = auth.uid()
  )
);

CREATE POLICY chat_messages_insert ON public.job_chat_messages
FOR INSERT WITH CHECK (
  user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.job_chat_members
    WHERE job_chat_members.chat_id = job_chat_messages.chat_id
    AND job_chat_members.user_id = auth.uid()
  )
);

CREATE POLICY chat_messages_update ON public.job_chat_messages
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY chat_messages_delete ON public.job_chat_messages
FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- 5) ENABLE REALTIME FOR CHAT
-- =====================================================

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS public.job_chat_messages;

-- =====================================================
-- 6) UPDATE TRIGGERS
-- =====================================================

-- Trigger for vendors updated_at
CREATE TRIGGER update_vendors_updated_at
BEFORE UPDATE ON public.vendors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for job_chats updated_at
CREATE TRIGGER update_job_chats_updated_at
BEFORE UPDATE ON public.job_chats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();