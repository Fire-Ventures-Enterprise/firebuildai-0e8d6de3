-- Create company_details table to store company information
CREATE TABLE IF NOT EXISTS public.company_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  phone text,
  email text,
  website text,
  address text,
  city text,
  state text,
  postal_code text,
  country text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.company_details ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own company details" ON public.company_details
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own company details" ON public.company_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own company details" ON public.company_details
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_company_details_updated_at
  BEFORE UPDATE ON public.company_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.company_details(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'contractor', 'employee')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, email)
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for team members
CREATE POLICY "Users can view team members of their company" ON public.team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.company_details
      WHERE company_details.id = team_members.company_id
      AND company_details.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage team members of their company" ON public.team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.company_details
      WHERE company_details.id = team_members.company_id
      AND company_details.user_id = auth.uid()
    )
  );

-- Create scheduling table
CREATE TABLE IF NOT EXISTS public.schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  all_day boolean DEFAULT false,
  location text,
  job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  assigned_to uuid REFERENCES public.team_members(id) ON DELETE SET NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  color text DEFAULT '#3B82F6',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for schedules
CREATE POLICY "Users can view own schedules" ON public.schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own schedules" ON public.schedules
  FOR ALL USING (auth.uid() = user_id);