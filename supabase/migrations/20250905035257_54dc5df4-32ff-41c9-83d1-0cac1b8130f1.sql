-- Create teams table first
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  trade TEXT,
  lead_name TEXT,
  lead_email TEXT,
  lead_phone TEXT,
  default_capacity INTEGER DEFAULT 1,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Create policies for teams
CREATE POLICY "Users can view own teams" ON public.teams
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own teams" ON public.teams
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own teams" ON public.teams
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own teams" ON public.teams
FOR DELETE USING (auth.uid() = user_id);

-- Now create the workflow calendar tables

-- Company working hours (per day of week)
CREATE TABLE public.company_working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_working_day BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, day_of_week)
);

-- Enable RLS
ALTER TABLE public.company_working_hours ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own working hours" ON public.company_working_hours
FOR ALL USING (auth.uid() = user_id);

-- Company holidays
CREATE TABLE public.company_holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  holiday_date DATE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, holiday_date)
);

-- Enable RLS
ALTER TABLE public.company_holidays ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own holidays" ON public.company_holidays
FOR ALL USING (auth.uid() = user_id);

-- Team capacity (slots per day)
CREATE TABLE public.team_capacity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_slots INTEGER NOT NULL DEFAULT 1,
  used_slots INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, date)
);

-- Enable RLS
ALTER TABLE public.team_capacity ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view team capacity" ON public.team_capacity
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE teams.id = team_capacity.team_id 
    AND teams.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage team capacity" ON public.team_capacity
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE teams.id = team_capacity.team_id 
    AND teams.user_id = auth.uid()
  )
);

-- Blackout windows (optional - for location-specific constraints)
CREATE TABLE public.blackout_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  location_id UUID,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date > start_date)
);

-- Enable RLS
ALTER TABLE public.blackout_windows ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own blackout windows" ON public.blackout_windows
FOR ALL USING (auth.uid() = user_id);

-- Add frozen zone settings to company_details
ALTER TABLE public.company_details
ADD COLUMN IF NOT EXISTS frozen_zone_days INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS enable_capacity_planning BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS default_work_hours JSONB DEFAULT '{"start": "08:00", "end": "17:00"}'::jsonb;

-- Seed default working hours for existing users
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  FOR v_user_id IN SELECT DISTINCT user_id FROM public.company_details
  LOOP
    -- Monday to Friday (1-5), 8am to 5pm
    INSERT INTO public.company_working_hours (user_id, day_of_week, start_time, end_time, is_working_day)
    VALUES 
      (v_user_id, 0, '08:00', '17:00', false), -- Sunday
      (v_user_id, 1, '08:00', '17:00', true),  -- Monday
      (v_user_id, 2, '08:00', '17:00', true),  -- Tuesday
      (v_user_id, 3, '08:00', '17:00', true),  -- Wednesday
      (v_user_id, 4, '08:00', '17:00', true),  -- Thursday
      (v_user_id, 5, '08:00', '17:00', true),  -- Friday
      (v_user_id, 6, '08:00', '17:00', false)  -- Saturday
    ON CONFLICT (user_id, day_of_week) DO NOTHING;
  END LOOP;
END $$;

-- Seed some default teams for existing users
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  FOR v_user_id IN SELECT DISTINCT user_id FROM public.company_details
  LOOP
    INSERT INTO public.teams (user_id, name, trade, default_capacity, color)
    VALUES 
      (v_user_id, 'Plumbing Crew', 'Plumbing', 2, '#3b82f6'),
      (v_user_id, 'Electrical Team', 'Electrical', 2, '#eab308'),
      (v_user_id, 'Carpentry Team', 'Carpentry', 3, '#22c55e'),
      (v_user_id, 'Drywall Crew', 'Drywall', 2, '#f97316'),
      (v_user_id, 'Painting Crew', 'Paint', 2, '#8b5cf6')
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- Create indexes for performance
CREATE INDEX idx_teams_user ON public.teams(user_id);
CREATE INDEX idx_working_hours_user ON public.company_working_hours(user_id);
CREATE INDEX idx_holidays_user_date ON public.company_holidays(user_id, holiday_date);
CREATE INDEX idx_team_capacity_team_date ON public.team_capacity(team_id, date);
CREATE INDEX idx_blackout_user_dates ON public.blackout_windows(user_id, start_date, end_date);
CREATE INDEX idx_project_tasks_scheduled ON public.project_tasks(scheduled_start, scheduled_end);
CREATE INDEX idx_project_tasks_status ON public.project_tasks(status);