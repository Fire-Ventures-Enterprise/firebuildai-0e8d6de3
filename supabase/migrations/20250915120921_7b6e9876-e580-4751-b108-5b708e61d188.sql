-- Add missing columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS province TEXT DEFAULT 'ON',
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Update owner_id to user_id for consistency
UPDATE public.projects SET user_id = owner_id WHERE user_id IS NULL;

-- Add missing columns that were already created in proposals/deposits
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS budget NUMERIC(10,2);

-- Update existing data
UPDATE public.projects SET budget = estimated_budget WHERE budget IS NULL;
UPDATE public.projects SET user_id = owner_id WHERE user_id IS NULL;

-- Update RLS policies for consistency
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;

CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id OR auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = owner_id OR auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = owner_id OR auth.uid() = user_id);