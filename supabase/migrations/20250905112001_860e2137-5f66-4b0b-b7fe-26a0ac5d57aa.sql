-- Fix RLS policies for work orders tables to avoid infinite recursion

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can manage own work orders" ON work_orders;
DROP POLICY IF EXISTS "Users can view own work orders" ON work_orders;
DROP POLICY IF EXISTS "Users can manage own work order items" ON work_order_items;
DROP POLICY IF EXISTS "Users can view own work order items" ON work_order_items;
DROP POLICY IF EXISTS "Users can manage own work order reports" ON work_order_reports;
DROP POLICY IF EXISTS "Users can view own work order reports" ON work_order_reports;
DROP POLICY IF EXISTS "Users can manage own work order assignees" ON work_order_assignees;
DROP POLICY IF EXISTS "Users can view own work order assignees" ON work_order_assignees;

-- Create simple, non-recursive policies for work_orders
CREATE POLICY "Users can view own work orders"
ON work_orders FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create work orders"
ON work_orders FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own work orders"
ON work_orders FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own work orders"
ON work_orders FOR DELETE
USING (user_id = auth.uid());

-- Create policies for work_order_items (reference work_orders.user_id directly)
CREATE POLICY "Users can view work order items"
ON work_order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_items.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage work order items"
ON work_order_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_items.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);

-- Create policies for work_order_reports
CREATE POLICY "Users can view work order reports"
ON work_order_reports FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_reports.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage work order reports"
ON work_order_reports FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_reports.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);

-- Create policies for work_order_assignees if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'work_order_assignees') THEN
    -- Create non-recursive policies
    EXECUTE 'CREATE POLICY "Users can view work order assignees"
      ON work_order_assignees FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM work_orders 
          WHERE work_orders.id = work_order_assignees.work_order_id 
          AND work_orders.user_id = auth.uid()
        )
      )';
      
    EXECUTE 'CREATE POLICY "Users can manage work order assignees"
      ON work_order_assignees FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM work_orders 
          WHERE work_orders.id = work_order_assignees.work_order_id 
          AND work_orders.user_id = auth.uid()
        )
      )';
  END IF;
END $$;