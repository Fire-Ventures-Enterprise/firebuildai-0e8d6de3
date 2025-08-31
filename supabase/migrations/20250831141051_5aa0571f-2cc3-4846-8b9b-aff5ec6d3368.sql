-- =====================================================
-- COMPLETE JOB-BASED CHAT SYSTEM
-- =====================================================

-- Chat roles enum
DO $$ BEGIN
  CREATE TYPE public.chat_role AS ENUM ('member','manager','owner');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Job chat rooms (one per job)
CREATE TABLE IF NOT EXISTS public.job_chats (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  name        text,
  description text,
  created_by  uuid NOT NULL DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(job_id) -- One chat per job
);

CREATE INDEX IF NOT EXISTS job_chats_job_idx ON public.job_chats(job_id);

-- Chat members
CREATE TABLE IF NOT EXISTS public.job_chat_members (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id   uuid NOT NULL REFERENCES public.job_chats(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL,
  role      public.chat_role NOT NULL DEFAULT 'member',
  added_by  uuid,
  added_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(chat_id, user_id)
);

CREATE INDEX IF NOT EXISTS jcm_user_idx ON public.job_chat_members(user_id);
CREATE INDEX IF NOT EXISTS jcm_chat_idx ON public.job_chat_members(chat_id);

-- Chat messages
CREATE TABLE IF NOT EXISTS public.job_chat_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id     uuid NOT NULL REFERENCES public.job_chats(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL,
  message     text NOT NULL,
  attachments jsonb DEFAULT '[]'::jsonb,
  edited      boolean DEFAULT false,
  edited_at   timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS jmsg_chat_idx ON public.job_chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS jmsg_created_idx ON public.job_chat_messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.job_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS for job chats - accessible by job owner and chat members
CREATE POLICY job_chats_select ON public.job_chats
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE jobs.id = job_id AND jobs.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.job_chat_members 
    WHERE job_chat_members.chat_id = job_chats.id 
    AND job_chat_members.user_id = auth.uid()
  )
);

CREATE POLICY job_chats_insert ON public.job_chats
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE jobs.id = job_id AND jobs.user_id = auth.uid()
  )
);

CREATE POLICY job_chats_update ON public.job_chats
FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY job_chats_delete ON public.job_chats
FOR DELETE USING (created_by = auth.uid());

-- RLS for chat members - visible to all members
CREATE POLICY chat_members_select ON public.job_chat_members
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.job_chat_members m
    WHERE m.chat_id = job_chat_members.chat_id 
    AND m.user_id = auth.uid()
  )
);

-- Only chat owners/managers can add members
CREATE POLICY chat_members_insert ON public.job_chat_members
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.job_chat_members m
    WHERE m.chat_id = job_chat_members.chat_id 
    AND m.user_id = auth.uid()
    AND m.role IN ('owner', 'manager')
  ) OR EXISTS (
    SELECT 1 FROM public.job_chats jc
    JOIN public.jobs j ON j.id = jc.job_id
    WHERE jc.id = job_chat_members.chat_id
    AND j.user_id = auth.uid()
  )
);

-- Members can update their own membership
CREATE POLICY chat_members_update ON public.job_chat_members
FOR UPDATE USING (user_id = auth.uid());

-- Only owners/managers can remove members
CREATE POLICY chat_members_delete ON public.job_chat_members
FOR DELETE USING (
  user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.job_chat_members m
    WHERE m.chat_id = job_chat_members.chat_id 
    AND m.user_id = auth.uid()
    AND m.role IN ('owner', 'manager')
  )
);

-- RLS for chat messages
CREATE POLICY chat_messages_select ON public.job_chat_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.job_chat_members
    WHERE job_chat_members.chat_id = job_chat_messages.chat_id
    AND job_chat_members.user_id = auth.uid()
  )
);

CREATE POLICY chat_messages_insert ON public.job_chat_messages
FOR INSERT WITH CHECK (
  user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.job_chat_members
    WHERE job_chat_members.chat_id = job_chat_messages.chat_id
    AND job_chat_members.user_id = auth.uid()
  )
);

CREATE POLICY chat_messages_update ON public.job_chat_messages
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY chat_messages_delete ON public.job_chat_messages
FOR DELETE USING (user_id = auth.uid());

-- Trigger for job_chats updated_at
CREATE TRIGGER update_job_chats_updated_at
BEFORE UPDATE ON public.job_chats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();