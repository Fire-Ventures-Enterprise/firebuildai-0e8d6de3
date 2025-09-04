-- Google accounts table for OAuth connections
CREATE TABLE IF NOT EXISTS google_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMPTZ,
  scope TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id)
);

-- Google calendars available to each account
CREATE TABLE IF NOT EXISTS google_calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES google_accounts(id) ON DELETE CASCADE,
  calendar_id TEXT NOT NULL,
  summary TEXT,
  is_primary BOOLEAN DEFAULT false,
  is_selected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (account_id, calendar_id)
);

-- Add Google sync columns to calendar_events
ALTER TABLE calendar_events
  ADD COLUMN IF NOT EXISTS external_provider TEXT,
  ADD COLUMN IF NOT EXISTS external_calendar_id TEXT,
  ADD COLUMN IF NOT EXISTS external_event_id TEXT,
  ADD COLUMN IF NOT EXISTS sync_state TEXT DEFAULT 'unsynced',
  ADD COLUMN IF NOT EXISTS sync_error TEXT;

-- Attendees for calendar events
CREATE TABLE IF NOT EXISTS calendar_event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'required', -- required|optional|resource
  response_status TEXT DEFAULT 'needsAction', -- accepted|declined|tentative|needsAction
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cal_ev_att_event ON calendar_event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_google_accounts_user ON google_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_google_calendars_account ON google_calendars(account_id);

-- Enable RLS
ALTER TABLE google_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_event_attendees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for google_accounts
CREATE POLICY "Users can view own Google accounts"
ON google_accounts FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create own Google accounts"
ON google_accounts FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own Google accounts"
ON google_accounts FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own Google accounts"
ON google_accounts FOR DELETE
USING (user_id = auth.uid());

-- RLS Policies for google_calendars
CREATE POLICY "Users can view own Google calendars"
ON google_calendars FOR SELECT
USING (EXISTS (
  SELECT 1 FROM google_accounts 
  WHERE google_accounts.id = google_calendars.account_id 
  AND google_accounts.user_id = auth.uid()
));

CREATE POLICY "Users can manage own Google calendars"
ON google_calendars FOR ALL
USING (EXISTS (
  SELECT 1 FROM google_accounts 
  WHERE google_accounts.id = google_calendars.account_id 
  AND google_accounts.user_id = auth.uid()
));

-- RLS Policies for calendar_event_attendees
CREATE POLICY "Users can view attendees for their events"
ON calendar_event_attendees FOR SELECT
USING (EXISTS (
  SELECT 1 FROM calendar_events 
  WHERE calendar_events.id = calendar_event_attendees.event_id 
  AND calendar_events.user_id = auth.uid()
));

CREATE POLICY "Users can manage attendees for their events"
ON calendar_event_attendees FOR ALL
USING (EXISTS (
  SELECT 1 FROM calendar_events 
  WHERE calendar_events.id = calendar_event_attendees.event_id 
  AND calendar_events.user_id = auth.uid()
));