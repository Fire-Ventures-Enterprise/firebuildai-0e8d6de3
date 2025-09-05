-- Fix RLS policies for work orders tables to avoid infinite recursion

-- Drop ALL existing policies for work_orders table
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'work_orders' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON work_orders', pol.policyname);
  END LOOP;
END $$;

-- Drop ALL existing policies for work_order_items table
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'work_order_items' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON work_order_items', pol.policyname);
  END LOOP;
END $$;

-- Drop ALL existing policies for work_order_reports table
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'work_order_reports' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON work_order_reports', pol.policyname);
  END LOOP;
END $$;

-- Drop ALL existing policies for work_order_assignees table (if exists)
DO $$
DECLARE
  pol RECORD;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'work_order_assignees' AND table_schema = 'public') THEN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'work_order_assignees' AND schemaname = 'public'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON work_order_assignees', pol.policyname);
    END LOOP;
  END IF;
END $$;

-- Create simple, non-recursive policies for work_orders
CREATE POLICY "wo_select"
ON work_orders FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "wo_insert"
ON work_orders FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "wo_update"
ON work_orders FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "wo_delete"
ON work_orders FOR DELETE
USING (user_id = auth.uid());

-- Create policies for work_order_items
CREATE POLICY "woi_select"
ON work_order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_items.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);

CREATE POLICY "woi_insert"
ON work_order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_items.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);

CREATE POLICY "woi_update"
ON work_order_items FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_items.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);

CREATE POLICY "woi_delete"
ON work_order_items FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_items.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);

-- Create policies for work_order_reports
CREATE POLICY "wor_select"
ON work_order_reports FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_reports.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);

CREATE POLICY "wor_insert"
ON work_order_reports FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_reports.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);

CREATE POLICY "wor_update"
ON work_order_reports FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_reports.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);

CREATE POLICY "wor_delete"
ON work_order_reports FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_reports.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);