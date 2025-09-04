-- Work orders tied to an invoice (no prices anywhere)
CREATE TABLE IF NOT EXISTS work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices_enhanced(id) ON DELETE CASCADE,
  schedule_id UUID NULL,
  job_id UUID NULL REFERENCES jobs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  service_address TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  team_id UUID NULL REFERENCES teams(id) ON DELETE SET NULL,
  instructions TEXT,
  status TEXT NOT NULL DEFAULT 'issued',
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(invoice_id)
);

-- Tasks/materials copied from invoice items (redacted: NO price fields)
CREATE TABLE IF NOT EXISTS work_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  source_invoice_item_id UUID NULL REFERENCES invoice_items_enhanced(id) ON DELETE SET NULL,
  kind TEXT NOT NULL DEFAULT 'task',
  description TEXT NOT NULL,
  quantity NUMERIC(14,4) DEFAULT 1,
  unit TEXT NULL,
  required_by TIMESTAMPTZ NULL,
  internal_notes TEXT NULL,
  sort_order INT DEFAULT 0
);

-- Who is assigned (app users)
CREATE TABLE IF NOT EXISTS work_order_assignees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  UNIQUE(work_order_id, user_id)
);

-- Tokenized portal access for external attendees (hashed)
CREATE TABLE IF NOT EXISTS work_order_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Field report (write-back from crew after completion)
CREATE TABLE IF NOT EXISTS work_order_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  completed_by UUID NULL REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  labor_hours NUMERIC(10,2) DEFAULT 0,
  materials_used JSONB DEFAULT '[]',
  photos JSONB DEFAULT '[]',
  signatures JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposed invoice adjustments from field report (pending manager approval)
CREATE TABLE IF NOT EXISTS invoice_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices_enhanced(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'work_order',
  source_id UUID,
  status TEXT NOT NULL DEFAULT 'draft',
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_adjustments ENABLE ROW LEVEL SECURITY;

-- RLS policies for work_orders
CREATE POLICY "wo users all"
ON work_orders
FOR ALL USING (
  user_id = auth.uid()
);

CREATE POLICY "wo assignees read"
ON work_orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM work_order_assignees
    WHERE work_order_id = work_orders.id AND user_id = auth.uid()
  )
);

-- RLS policies for work_order_items
CREATE POLICY "woi users read"
ON work_order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM work_orders
    WHERE work_orders.id = work_order_items.work_order_id
    AND (work_orders.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM work_order_assignees
      WHERE work_order_id = work_orders.id AND user_id = auth.uid()
    ))
  )
);

CREATE POLICY "woi users manage"
ON work_order_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM work_orders
    WHERE work_orders.id = work_order_items.work_order_id
    AND work_orders.user_id = auth.uid()
  )
);

-- RLS policies for work_order_assignees
CREATE POLICY "woa users manage"
ON work_order_assignees FOR ALL USING (
  EXISTS (
    SELECT 1 FROM work_orders
    WHERE work_orders.id = work_order_assignees.work_order_id
    AND work_orders.user_id = auth.uid()
  )
);

CREATE POLICY "woa assignees read"
ON work_order_assignees FOR SELECT USING (
  user_id = auth.uid()
);

-- RLS policies for work_order_tokens (admin only)
CREATE POLICY "wot users manage"
ON work_order_tokens FOR ALL USING (
  EXISTS (
    SELECT 1 FROM work_orders
    WHERE work_orders.id = work_order_tokens.work_order_id
    AND work_orders.user_id = auth.uid()
  )
);

-- RLS policies for work_order_reports
CREATE POLICY "wor users manage"
ON work_order_reports FOR ALL USING (
  EXISTS (
    SELECT 1 FROM work_orders
    WHERE work_orders.id = work_order_reports.work_order_id
    AND (work_orders.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM work_order_assignees
      WHERE work_order_id = work_orders.id AND user_id = auth.uid()
    ))
  )
);

-- RLS policies for invoice_adjustments
CREATE POLICY "ia users manage"
ON invoice_adjustments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM invoices_enhanced
    WHERE invoices_enhanced.id = invoice_adjustments.invoice_id
    AND invoices_enhanced.user_id = auth.uid()
  )
);

-- Create function to generate work order from invoice
CREATE OR REPLACE FUNCTION create_work_order_from_invoice(p_invoice_id UUID)
RETURNS UUID
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
    COALESCE('Invoice ' || v_inv.invoice_number, 'Work Order'),
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
    'task',
    COALESCE(ii.item_name, ii.description),
    COALESCE(ii.quantity, 1),
    NULL,
    COALESCE(ii.sort_order, 0)
  FROM invoice_items_enhanced ii 
  WHERE ii.invoice_id = p_invoice_id;

  RETURN v_wo_id;
END $$;

-- Create function for token-based access
CREATE OR REPLACE FUNCTION get_work_order_by_token(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_row RECORD;
  v_wo_id UUID;
BEGIN
  -- Find valid token
  SELECT * INTO v_token_row 
  FROM work_order_tokens
  WHERE token_hash = encode(digest(p_token, 'sha256'), 'hex')
  AND expires_at > NOW()
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  v_wo_id := v_token_row.work_order_id;

  -- Return work order data without prices
  RETURN (
    SELECT jsonb_build_object(
      'work_order', to_jsonb(w),
      'items', (
        SELECT jsonb_agg(to_jsonb(i))
        FROM work_order_items i 
        WHERE i.work_order_id = w.id
        ORDER BY i.sort_order
      )
    )
    FROM work_orders w 
    WHERE w.id = v_wo_id
  );
END $$;

-- Create function to submit field report
CREATE OR REPLACE FUNCTION submit_work_order_report(
  p_token TEXT,
  p_notes TEXT,
  p_labor_hours NUMERIC,
  p_materials_used JSONB,
  p_photos JSONB,
  p_signatures JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_row RECORD;
  v_wo_id UUID;
BEGIN
  -- Find valid token
  SELECT * INTO v_token_row 
  FROM work_order_tokens
  WHERE token_hash = encode(digest(p_token, 'sha256'), 'hex')
  AND expires_at > NOW()
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  v_wo_id := v_token_row.work_order_id;

  -- Create or update report
  INSERT INTO work_order_reports (
    work_order_id, completed_at, notes, labor_hours,
    materials_used, photos, signatures
  )
  VALUES (
    v_wo_id, NOW(), p_notes, COALESCE(p_labor_hours, 0),
    COALESCE(p_materials_used, '[]'::jsonb),
    COALESCE(p_photos, '[]'::jsonb),
    COALESCE(p_signatures, '[]'::jsonb)
  )
  ON CONFLICT (work_order_id) DO UPDATE SET
    completed_at = NOW(),
    notes = EXCLUDED.notes,
    labor_hours = EXCLUDED.labor_hours,
    materials_used = EXCLUDED.materials_used,
    photos = EXCLUDED.photos,
    signatures = EXCLUDED.signatures,
    updated_at = NOW();

  -- Update work order status
  UPDATE work_orders 
  SET status = 'completed', updated_at = NOW()
  WHERE id = v_wo_id;

  -- Create draft invoice adjustment if there are changes
  IF p_labor_hours > 0 OR jsonb_array_length(p_materials_used) > 0 THEN
    INSERT INTO invoice_adjustments (
      invoice_id, source, source_id, items
    )
    SELECT 
      wo.invoice_id, 
      'work_order', 
      v_wo_id,
      jsonb_build_object(
        'labor_hours', p_labor_hours,
        'materials_used', p_materials_used,
        'notes', p_notes
      )
    FROM work_orders wo
    WHERE wo.id = v_wo_id;
  END IF;

  RETURN TRUE;
END $$;

-- Add unique constraint on work_order_reports
ALTER TABLE work_order_reports 
ADD CONSTRAINT work_order_reports_work_order_id_key UNIQUE (work_order_id);

-- Add indexes for performance
CREATE INDEX idx_work_orders_invoice ON work_orders(invoice_id);
CREATE INDEX idx_work_orders_user ON work_orders(user_id);
CREATE INDEX idx_work_order_items_wo ON work_order_items(work_order_id);
CREATE INDEX idx_work_order_assignees_wo ON work_order_assignees(work_order_id);
CREATE INDEX idx_work_order_assignees_user ON work_order_assignees(user_id);
CREATE INDEX idx_work_order_tokens_hash ON work_order_tokens(token_hash);
CREATE INDEX idx_invoice_adjustments_invoice ON invoice_adjustments(invoice_id);