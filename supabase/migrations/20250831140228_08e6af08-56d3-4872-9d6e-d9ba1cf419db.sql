-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Helper: current user's company_id (used in RLS)
CREATE OR REPLACE FUNCTION public.current_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Optional: narrow execute privileges
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
  company_id     uuid NOT NULL,
  name           text NOT NULL,
  contact_name   text,
  email          text,
  phone          text,
  address        text,
  payment_terms  text,
  default_tax_rate numeric(6,3) DEFAULT 0,
  notes          text,
  created_by     uuid NOT NULL DEFAULT auth.uid(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vendors_company_idx ON public.vendors(company_id);
CREATE INDEX IF NOT EXISTS vendors_name_trgm ON public.vendors USING gin (name gin_trgm_ops);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- RLS: same company can read/write
CREATE POLICY vendors_select ON public.vendors
FOR SELECT USING (company_id = public.current_user_company_id());

CREATE POLICY vendors_insert ON public.vendors
FOR INSERT WITH CHECK (company_id = public.current_user_company_id());

CREATE POLICY vendors_update ON public.vendors
FOR UPDATE USING (company_id = public.current_user_company_id())
          WITH CHECK (company_id = public.current_user_company_id());

CREATE POLICY vendors_delete ON public.vendors
FOR DELETE USING (company_id = public.current_user_company_id());

-- =====================================================
-- 3) PURCHASE ORDERS WITH AUTO NUMBERING
-- =====================================================

-- Enums
DO $$ BEGIN
  CREATE TYPE public.po_status AS ENUM ('draft','submitted','approved','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('pending','partial','paid','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_method AS ENUM ('card','bank_transfer','check','cash','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Sequence for PO numbers
CREATE SEQUENCE IF NOT EXISTS public.po_seq;

-- Settings table for prefix (one row per company)
CREATE TABLE IF NOT EXISTS public.po_settings (
  company_id uuid PRIMARY KEY,
  prefix text NOT NULL DEFAULT 'PO',
  pad_len int NOT NULL DEFAULT 6
);

-- Main purchase orders table
CREATE TABLE IF NOT EXISTS public.purchase_orders_enhanced (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid NOT NULL,
  job_id          uuid REFERENCES public.jobs(id) ON DELETE RESTRICT,
  vendor_id       uuid REFERENCES public.vendors(id) ON DELETE RESTRICT,
  
  po_number       text UNIQUE,
  status          public.po_status NOT NULL DEFAULT 'draft',
  payment_status  public.payment_status NOT NULL DEFAULT 'pending',
  payment_method  public.payment_method,
  terms           text,
  due_date        date,
  expected_delivery date,
  
  subtotal        numeric(14,2) NOT NULL DEFAULT 0,
  tax             numeric(14,2) NOT NULL DEFAULT 0,
  total           numeric(14,2) NOT NULL DEFAULT 0,
  
  notes           text,
  created_by      uuid NOT NULL DEFAULT auth.uid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS po_company_idx ON public.purchase_orders_enhanced(company_id);
CREATE INDEX IF NOT EXISTS po_job_idx ON public.purchase_orders_enhanced(job_id);
CREATE INDEX IF NOT EXISTS po_vendor_idx ON public.purchase_orders_enhanced(vendor_id);

-- Purchase order items
CREATE TABLE IF NOT EXISTS public.purchase_order_items_enhanced (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id       uuid NOT NULL REFERENCES public.purchase_orders_enhanced(id) ON DELETE CASCADE,
  description text NOT NULL,
  qty         numeric(12,3) NOT NULL CHECK (qty >= 0),
  unit_price  numeric(14,2) NOT NULL CHECK (unit_price >= 0),
  tax_rate    numeric(6,3) DEFAULT 0,
  line_total  numeric(14,2) NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS poi_po_idx ON public.purchase_order_items_enhanced(po_id);

-- PO payments tracking
CREATE TABLE IF NOT EXISTS public.po_payments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id      uuid NOT NULL REFERENCES public.purchase_orders_enhanced(id) ON DELETE CASCADE,
  amount     numeric(14,2) NOT NULL CHECK (amount > 0),
  method     public.payment_method,
  paid_at    timestamptz NOT NULL DEFAULT now(),
  reference  text
);
CREATE INDEX IF NOT EXISTS popo_idx ON public.po_payments(po_id);

-- Auto-calc line totals and PO totals
CREATE OR REPLACE FUNCTION public.po_recalc_totals() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.purchase_order_items_enhanced
    SET line_total = round(coalesce(qty,0) * coalesce(unit_price,0)::numeric, 2)
  WHERE id = new.id;
  
  UPDATE public.purchase_orders_enhanced p
    SET subtotal = coalesce((SELECT round(sum(line_total),2) FROM public.purchase_order_items_enhanced WHERE po_id = p.id), 0),
        tax = round((SELECT sum((line_total * (coalesce(tax_rate,0)/100.0))) FROM public.purchase_order_items_enhanced WHERE po_id = p.id), 2),
        total = round(subtotal + tax, 2),
        updated_at = now()
  WHERE p.id = new.po_id;
  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS trg_recalc_poi ON public.purchase_order_items_enhanced;
CREATE TRIGGER trg_recalc_poi
AFTER INSERT OR UPDATE OF qty,unit_price,tax_rate ON public.purchase_order_items_enhanced
FOR EACH ROW EXECUTE FUNCTION public.po_recalc_totals();

-- Auto-generate po_number
CREATE OR REPLACE FUNCTION public.generate_po_number()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
DECLARE
  v_prefix text := 'PO';
  v_pad int := 6;
  v_seq bigint;
BEGIN
  IF new.po_number IS NOT NULL THEN
    RETURN new;
  END IF;
  
  SELECT s.prefix, s.pad_len INTO v_prefix, v_pad
  FROM public.po_settings s
  WHERE s.company_id = new.company_id;
  
  v_seq := nextval('public.po_seq');
  new.po_number := coalesce(v_prefix,'PO') || '-' ||
                   to_char(now(),'YYYY') || '-' ||
                   lpad(v_seq::text, coalesce(v_pad,6), '0');
  RETURN new;
END $$;

DROP TRIGGER IF EXISTS trg_po_number ON public.purchase_orders_enhanced;
CREATE TRIGGER trg_po_number
BEFORE INSERT ON public.purchase_orders_enhanced
FOR EACH ROW EXECUTE FUNCTION public.generate_po_number();

-- Enable RLS
ALTER TABLE public.purchase_orders_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.po_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.po_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for purchase orders
CREATE POLICY po_select ON public.purchase_orders_enhanced
FOR SELECT USING (company_id = public.current_user_company_id());

CREATE POLICY po_insert ON public.purchase_orders_enhanced
FOR INSERT WITH CHECK (company_id = public.current_user_company_id());

CREATE POLICY po_update ON public.purchase_orders_enhanced
FOR UPDATE USING (company_id = public.current_user_company_id())
          WITH CHECK (company_id = public.current_user_company_id());

CREATE POLICY po_delete ON public.purchase_orders_enhanced
FOR DELETE USING (company_id = public.current_user_company_id());

-- RLS for PO items
CREATE POLICY poi_select ON public.purchase_order_items_enhanced
FOR SELECT USING (EXISTS (SELECT 1 FROM public.purchase_orders_enhanced p WHERE p.id = po_id AND p.company_id = public.current_user_company_id()));

CREATE POLICY poi_cud ON public.purchase_order_items_enhanced
FOR ALL USING (EXISTS (SELECT 1 FROM public.purchase_orders_enhanced p WHERE p.id = po_id AND p.company_id = public.current_user_company_id()))
       WITH CHECK (EXISTS (SELECT 1 FROM public.purchase_orders_enhanced p WHERE p.id = po_id AND p.company_id = public.current_user_company_id()));

-- RLS for PO payments
CREATE POLICY pop_select ON public.po_payments
FOR SELECT USING (EXISTS (SELECT 1 FROM public.purchase_orders_enhanced p WHERE p.id = po_id AND p.company_id = public.current_user_company_id()));

CREATE POLICY pop_cud ON public.po_payments
FOR ALL USING (EXISTS (SELECT 1 FROM public.purchase_orders_enhanced p WHERE p.id = po_id AND p.company_id = public.current_user_company_id()))
       WITH CHECK (EXISTS (SELECT 1 FROM public.purchase_orders_enhanced p WHERE p.id = po_id AND p.company_id = public.current_user_company_id()));

-- RLS for PO settings
CREATE POLICY pos_select ON public.po_settings
FOR SELECT USING (company_id = public.current_user_company_id());

CREATE POLICY pos_cud ON public.po_settings
FOR ALL USING (company_id = public.current_user_company_id())
       WITH CHECK (company_id = public.current_user_company_id());

-- =====================================================
-- 4) JOB-BASED CHAT SYSTEM
-- =====================================================

-- Chat roles enum
DO $$ BEGIN
  CREATE TYPE public.chat_role AS ENUM ('member','manager');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Job chat rooms
CREATE TABLE IF NOT EXISTS public.job_chats (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  company_id  uuid NOT NULL,
  created_by  uuid NOT NULL DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS job_chats_job_idx ON public.job_chats(job_id);
CREATE INDEX IF NOT EXISTS job_chats_company_idx ON public.job_chats(company_id);

-- Chat members
CREATE TABLE IF NOT EXISTS public.job_chat_members (
  chat_id   uuid NOT NULL REFERENCES public.job_chats(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL,
  role      public.chat_role NOT NULL DEFAULT 'member',
  added_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(chat_id, user_id)
);

CREATE INDEX IF NOT EXISTS jcm_user_idx ON public.job_chat_members(user_id);

-- Chat messages
CREATE TABLE IF NOT EXISTS public.job_chat_messages (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id   uuid NOT NULL REFERENCES public.job_chats(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL,
  body      text NOT NULL,
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS jmsg_chat_idx ON public.job_chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS jmsg_created_idx ON public.job_chat_messages(created_at);

-- Enable RLS
ALTER TABLE public.job_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS for job chats
CREATE POLICY jc_select ON public.job_chats
FOR SELECT USING (
  company_id = public.current_user_company_id()
  AND EXISTS (SELECT 1 FROM public.job_chat_members m
              WHERE m.chat_id = id AND m.user_id = auth.uid())
);

CREATE POLICY jc_insert ON public.job_chats
FOR INSERT WITH CHECK (company_id = public.current_user_company_id());

CREATE POLICY jc_update ON public.job_chats
FOR UPDATE USING (company_id = public.current_user_company_id())
          WITH CHECK (company_id = public.current_user_company_id());

CREATE POLICY jc_delete ON public.job_chats
FOR DELETE USING (
  company_id = public.current_user_company_id()
  AND created_by = auth.uid()
);

-- RLS for chat members
CREATE POLICY jcm_select ON public.job_chat_members
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.job_chat_members me
          WHERE me.chat_id = chat_id AND me.user_id = auth.uid())
);

CREATE POLICY jcm_cud ON public.job_chat_members
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.job_chat_members me
          WHERE me.chat_id = chat_id AND me.user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.job_chat_members me
          WHERE me.chat_id = chat_id AND me.user_id = auth.uid())
);

-- RLS for chat messages
CREATE POLICY jmsg_select ON public.job_chat_messages
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.job_chat_members me
          WHERE me.chat_id = chat_id AND me.user_id = auth.uid())
);

CREATE POLICY jmsg_insert ON public.job_chat_messages
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.job_chat_members me
          WHERE me.chat_id = chat_id AND me.user_id = auth.uid())
);

CREATE POLICY jmsg_update ON public.job_chat_messages
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY jmsg_delete ON public.job_chat_messages
FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- 5) ENABLE REALTIME FOR CHAT MESSAGES
-- =====================================================

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_chat_messages;

-- =====================================================
-- 6) CREATE UPDATE TRIGGERS FOR TIMESTAMPS
-- =====================================================

-- Trigger for vendors updated_at
CREATE TRIGGER update_vendors_updated_at
BEFORE UPDATE ON public.vendors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for purchase_orders_enhanced updated_at
CREATE TRIGGER update_po_enhanced_updated_at
BEFORE UPDATE ON public.purchase_orders_enhanced
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();