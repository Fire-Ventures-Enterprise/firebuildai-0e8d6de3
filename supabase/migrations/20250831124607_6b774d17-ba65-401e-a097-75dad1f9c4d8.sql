-- Create job chat rooms table
CREATE TABLE public.job_chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat room members table
CREATE TABLE public.chat_room_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.job_chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- 'admin', 'member'
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  invited_by UUID,
  UNIQUE(room_id, user_id)
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.job_chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  customer_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  status TEXT DEFAULT 'planning',
  priority TEXT DEFAULT 'medium',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0,
  budget NUMERIC,
  actual_cost NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT, -- 'electrician', 'plumber', 'flooring', 'project_manager', etc.
  specialty TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_chat_rooms
CREATE POLICY "Users can view chat rooms they are members of"
ON public.job_chat_rooms
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_room_members
    WHERE room_id = job_chat_rooms.id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create chat rooms for their jobs"
ON public.job_chat_rooms
FOR INSERT
WITH CHECK (created_by = auth.uid());

-- RLS Policies for chat_room_members
CREATE POLICY "Members can view room members"
ON public.chat_room_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_room_members crm
    WHERE crm.room_id = chat_room_members.room_id
    AND crm.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can add members"
ON public.chat_room_members
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_room_members
    WHERE room_id = chat_room_members.room_id
    AND user_id = auth.uid()
    AND role = 'admin'
  )
);

-- RLS Policies for chat_messages
CREATE POLICY "Members can view messages"
ON public.chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_room_members
    WHERE room_id = chat_messages.room_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Members can send messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.chat_room_members
    WHERE room_id = chat_messages.room_id
    AND user_id = auth.uid()
  )
);

-- RLS Policies for jobs
CREATE POLICY "Users can view their jobs"
ON public.jobs
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create jobs"
ON public.jobs
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their jobs"
ON public.jobs
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their jobs"
ON public.jobs
FOR DELETE
USING (user_id = auth.uid());

-- RLS Policies for team_members
CREATE POLICY "Users can view their team members"
ON public.team_members
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their team members"
ON public.team_members
FOR ALL
USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_chat_room_members_room_id ON public.chat_room_members(room_id);
CREATE INDEX idx_chat_room_members_user_id ON public.chat_room_members(user_id);
CREATE INDEX idx_chat_messages_room_id ON public.chat_messages(room_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX idx_job_chat_rooms_job_id ON public.job_chat_rooms(job_id);
CREATE INDEX idx_jobs_customer_id ON public.jobs(customer_id);

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_room_members;