-- Create table to store scheduling tied to invoices
CREATE TABLE IF NOT EXISTS invoice_scheduling (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL UNIQUE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  team_id UUID NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'rescheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoice_scheduling ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own invoice scheduling"
ON invoice_scheduling FOR SELECT
USING (EXISTS (
  SELECT 1 FROM invoices_enhanced 
  WHERE invoices_enhanced.id = invoice_scheduling.invoice_id 
  AND invoices_enhanced.user_id = auth.uid()
));

CREATE POLICY "Users can create own invoice scheduling"
ON invoice_scheduling FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM invoices_enhanced 
  WHERE invoices_enhanced.id = invoice_scheduling.invoice_id 
  AND invoices_enhanced.user_id = auth.uid()
));

CREATE POLICY "Users can update own invoice scheduling"
ON invoice_scheduling FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM invoices_enhanced 
  WHERE invoices_enhanced.id = invoice_scheduling.invoice_id 
  AND invoices_enhanced.user_id = auth.uid()
));

CREATE POLICY "Users can delete own invoice scheduling"
ON invoice_scheduling FOR DELETE
USING (EXISTS (
  SELECT 1 FROM invoices_enhanced 
  WHERE invoices_enhanced.id = invoice_scheduling.invoice_id 
  AND invoices_enhanced.user_id = auth.uid()
));

-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  location TEXT,
  team_id UUID NULL,
  source TEXT NOT NULL,
  source_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (source, source_id)
);

-- Enable RLS for calendar_events
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Policies for calendar_events
CREATE POLICY "Users can view own calendar events"
ON calendar_events FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create own calendar events"
ON calendar_events FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own calendar events"
ON calendar_events FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own calendar events"
ON calendar_events FOR DELETE
USING (user_id = auth.uid());

-- Function to sync invoice schedule to calendar
CREATE OR REPLACE FUNCTION sync_invoice_schedule_to_calendar(p_invoice_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  s RECORD;
  inv RECORD;
  title TEXT;
  v_user_id UUID;
BEGIN
  -- Get the scheduling record
  SELECT * INTO s FROM invoice_scheduling WHERE invoice_id = p_invoice_id;
  
  -- If no scheduling found, delete any calendar event and return
  IF NOT FOUND THEN
    DELETE FROM calendar_events 
    WHERE source = 'invoice' AND source_id = p_invoice_id;
    RETURN;
  END IF;

  -- Get invoice details and user_id
  SELECT 
    i.invoice_number, 
    i.customer_name,
    i.service_address AS addr, 
    i.user_id
  INTO inv
  FROM invoices_enhanced i
  WHERE i.id = p_invoice_id;
  
  -- Build title
  title := COALESCE('Invoice ' || inv.invoice_number, 'Invoice') || 
           COALESCE(' — ' || inv.customer_name, '');

  -- Upsert calendar event
  INSERT INTO calendar_events AS ce
    (user_id, title, starts_at, ends_at, location, team_id, source, source_id)
  VALUES
    (inv.user_id, title, s.starts_at, s.ends_at, inv.addr, s.team_id, 'invoice', p_invoice_id)
  ON CONFLICT (source, source_id) DO UPDATE
    SET title = EXCLUDED.title, 
        starts_at = EXCLUDED.starts_at, 
        ends_at = EXCLUDED.ends_at,
        location = EXCLUDED.location, 
        team_id = EXCLUDED.team_id, 
        updated_at = now();
END $$;

-- Create indexes for performance
CREATE INDEX idx_invoice_scheduling_invoice_id ON invoice_scheduling(invoice_id);
CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_source ON calendar_events(source, source_id);
CREATE INDEX idx_calendar_events_dates ON calendar_events(starts_at, ends_at);