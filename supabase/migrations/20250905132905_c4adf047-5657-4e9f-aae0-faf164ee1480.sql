-- Add invoice adjustments table if not exists
CREATE TABLE IF NOT EXISTS public.invoice_adjustments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices_enhanced(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'work_order', -- 'work_order', 'change_order', etc
  source_id UUID, -- References the work_order_id or other source
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'approved', 'rejected'
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add work order assignees table for team tracking  
CREATE TABLE IF NOT EXISTS public.work_order_assignees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id),
  team_member_id UUID,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID NOT NULL,
  UNIQUE(work_order_id, team_member_id)
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_invoice_adjustments_invoice 
ON public.invoice_adjustments(invoice_id);

CREATE INDEX IF NOT EXISTS idx_invoice_adjustments_status 
ON public.invoice_adjustments(status);

CREATE INDEX IF NOT EXISTS idx_work_order_assignees_wo 
ON public.work_order_assignees(work_order_id);

-- Enable RLS
ALTER TABLE public.invoice_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_assignees ENABLE ROW LEVEL SECURITY;

-- RLS policies for invoice_adjustments
CREATE POLICY "Users can view own invoice adjustments" 
ON public.invoice_adjustments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM invoices_enhanced 
    WHERE invoices_enhanced.id = invoice_adjustments.invoice_id 
    AND invoices_enhanced.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create own invoice adjustments" 
ON public.invoice_adjustments FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM invoices_enhanced 
    WHERE invoices_enhanced.id = invoice_adjustments.invoice_id 
    AND invoices_enhanced.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own invoice adjustments" 
ON public.invoice_adjustments FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM invoices_enhanced 
    WHERE invoices_enhanced.id = invoice_adjustments.invoice_id 
    AND invoices_enhanced.user_id = auth.uid()
  )
);

-- RLS for work_order_assignees
CREATE POLICY "Users can view own work order assignees" 
ON public.work_order_assignees FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_assignees.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage own work order assignees" 
ON public.work_order_assignees FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM work_orders 
    WHERE work_orders.id = work_order_assignees.work_order_id 
    AND work_orders.user_id = auth.uid()
  )
);

-- Create or replace the create_work_order_from_invoice function
CREATE OR REPLACE FUNCTION public.create_work_order_from_invoice(p_invoice_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inv RECORD;
  v_sched RECORD;
  v_wo_id UUID;
  v_user_id UUID;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  -- Get invoice details
  SELECT i.*, i.service_address AS address
  INTO v_inv
  FROM invoices_enhanced i
  WHERE i.id = p_invoice_id AND i.user_id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invoice not found or access denied';
  END IF;

  -- Get schedule if exists
  SELECT * INTO v_sched FROM invoice_scheduling WHERE invoice_id = p_invoice_id;

  -- Create work order
  INSERT INTO work_orders (
    user_id, invoice_id, schedule_id, title, service_address,
    starts_at, ends_at, team_id, instructions, created_by
  )
  VALUES (
    v_user_id, 
    p_invoice_id, 
    v_sched.id,
    COALESCE('WO: Invoice ' || v_inv.invoice_number, 'Work Order'),
    COALESCE(v_inv.service_address, v_inv.customer_address),
    COALESCE(v_sched.starts_at, NOW()),
    COALESCE(v_sched.ends_at, NOW() + INTERVAL '2 hours'),
    v_sched.team_id,
    v_inv.notes,
    v_user_id
  )
  RETURNING id INTO v_wo_id;

  -- Copy invoice items as tasks/materials WITHOUT prices
  INSERT INTO work_order_items (
    work_order_id, source_invoice_item_id, kind, description, 
    quantity, unit, sort_order
  )
  SELECT 
    v_wo_id,
    ii.id,
    CASE 
      WHEN LOWER(ii.item_name) LIKE '%material%' THEN 'material'
      WHEN LOWER(ii.item_name) LIKE '%equipment%' THEN 'equipment'
      ELSE 'task'
    END,
    COALESCE(ii.item_name, ii.description),
    COALESCE(ii.quantity, 1),
    NULL,
    COALESCE(ii.sort_order, 0)
  FROM invoice_items_enhanced ii 
  WHERE ii.invoice_id = p_invoice_id;

  RETURN v_wo_id;
END;
$$;

-- Create regenerate token function
CREATE OR REPLACE FUNCTION public.regenerate_wo_token(p_wo_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_token text;
BEGIN
  -- Verify ownership
  v_user_id := auth.uid();
  
  IF NOT EXISTS (
    SELECT 1 FROM work_orders 
    WHERE id = p_wo_id AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Work order not found or access denied';
  END IF;

  -- Invalidate old tokens
  UPDATE work_order_tokens 
  SET expires_at = NOW() 
  WHERE work_order_id = p_wo_id AND expires_at > NOW();

  -- Generate new token
  v_token := create_work_order_token(p_wo_id, 168); -- 7 days
  
  RETURN v_token;
END;
$$;

-- Create function to approve invoice adjustments
CREATE OR REPLACE FUNCTION public.approve_invoice_adjustments(p_adjustment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_adj RECORD;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  -- Get adjustment with ownership check
  SELECT a.*, i.user_id as invoice_owner
  INTO v_adj
  FROM invoice_adjustments a
  JOIN invoices_enhanced i ON i.id = a.invoice_id
  WHERE a.id = p_adjustment_id AND i.user_id = v_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Adjustment not found or access denied';
  END IF;
  
  -- Update status
  UPDATE invoice_adjustments 
  SET status = 'approved', updated_at = NOW()
  WHERE id = p_adjustment_id;
  
  -- Here you would typically apply the adjustments to the invoice
  -- This would involve parsing the items JSONB and updating invoice totals
  -- For now, we'll just mark it as approved
END;
$$;

-- Create function to reject invoice adjustments
CREATE OR REPLACE FUNCTION public.reject_invoice_adjustments(p_adjustment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  -- Verify ownership
  IF NOT EXISTS (
    SELECT 1 FROM invoice_adjustments a
    JOIN invoices_enhanced i ON i.id = a.invoice_id
    WHERE a.id = p_adjustment_id AND i.user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Adjustment not found or access denied';
  END IF;
  
  -- Update status
  UPDATE invoice_adjustments 
  SET status = 'rejected', updated_at = NOW()
  WHERE id = p_adjustment_id;
END;
$$;