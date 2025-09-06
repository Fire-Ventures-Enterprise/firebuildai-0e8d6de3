-- Drop existing basic chat tables and create comprehensive communication system
-- This migration implements the multi-stakeholder communication hub

-- Create communication channels table for different stakeholder types
CREATE TABLE IF NOT EXISTS public.communication_channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  channel_type TEXT NOT NULL CHECK (channel_type IN ('internal', 'client', 'contractor', 'subcontractor', 'project')),
  stakeholder_type TEXT CHECK (stakeholder_type IN ('office', 'client', 'contractor', 'subcontractor', 'team')),
  project_id UUID,
  job_id UUID,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table with enhanced categorization
CREATE TABLE IF NOT EXISTS public.communication_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES public.communication_channels(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'email', 'file', 'voice', 'system', 'notification')),
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('schedule', 'budget', 'quality', 'safety', 'general', 'urgent', 'change_order', 'approval')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'read', 'archived')),
  attachments JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  parent_message_id UUID,
  thread_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  read_by UUID[]
);

-- Create channel members table with role-based permissions
CREATE TABLE IF NOT EXISTS public.communication_channel_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES public.communication_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  member_type TEXT NOT NULL CHECK (member_type IN ('owner', 'admin', 'member', 'guest', 'viewer')),
  permissions JSONB DEFAULT '{"can_send": true, "can_read": true, "can_edit": false, "can_delete": false}',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "in_app": true}',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create communication templates table
CREATE TABLE IF NOT EXISTS public.communication_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('email', 'message', 'notification')),
  stakeholder_type TEXT CHECK (stakeholder_type IN ('office', 'client', 'contractor', 'subcontractor')),
  category TEXT,
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create communication workflows table
CREATE TABLE IF NOT EXISTS public.communication_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  workflow_type TEXT NOT NULL CHECK (workflow_type IN ('approval', 'notification', 'escalation', 'follow_up')),
  trigger_event TEXT,
  conditions JSONB DEFAULT '{}',
  actions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create communication tags table
CREATE TABLE IF NOT EXISTS public.communication_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create message tags relationship table
CREATE TABLE IF NOT EXISTS public.communication_message_tags (
  message_id UUID NOT NULL REFERENCES public.communication_messages(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.communication_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (message_id, tag_id)
);

-- Create communication audit log
CREATE TABLE IF NOT EXISTS public.communication_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scheduled messages table
CREATE TABLE IF NOT EXISTS public.communication_scheduled_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID REFERENCES public.communication_channels(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create communication analytics table
CREATE TABLE IF NOT EXISTS public.communication_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  channel_id UUID REFERENCES public.communication_channels(id),
  message_count INTEGER DEFAULT 0,
  response_time_avg INTEGER, -- in seconds
  engagement_rate NUMERIC,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_communication_messages_channel_id ON public.communication_messages(channel_id);
CREATE INDEX idx_communication_messages_sender_id ON public.communication_messages(sender_id);
CREATE INDEX idx_communication_messages_created_at ON public.communication_messages(created_at DESC);
CREATE INDEX idx_communication_messages_category ON public.communication_messages(category);
CREATE INDEX idx_communication_messages_priority ON public.communication_messages(priority);
CREATE INDEX idx_communication_messages_thread_id ON public.communication_messages(thread_id);
CREATE INDEX idx_communication_channel_members_channel_id ON public.communication_channel_members(channel_id);
CREATE INDEX idx_communication_channel_members_user_id ON public.communication_channel_members(user_id);
CREATE INDEX idx_communication_channels_project_id ON public.communication_channels(project_id);
CREATE INDEX idx_communication_channels_job_id ON public.communication_channels(job_id);

-- Enable Row Level Security
ALTER TABLE public.communication_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_message_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_scheduled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for channels
CREATE POLICY "Users can view channels they are members of"
  ON public.communication_channels FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.communication_channel_members
      WHERE channel_id = communication_channels.id
      AND user_id = auth.uid()
      AND is_active = true
    )
  );

CREATE POLICY "Users can create channels"
  ON public.communication_channels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Channel owners can update channels"
  ON public.communication_channels FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Channel owners can delete channels"
  ON public.communication_channels FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for messages
CREATE POLICY "Users can view messages in their channels"
  ON public.communication_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.communication_channel_members
      WHERE channel_id = communication_messages.channel_id
      AND user_id = auth.uid()
      AND is_active = true
    )
  );

CREATE POLICY "Users can send messages to their channels"
  ON public.communication_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.communication_channel_members
      WHERE channel_id = communication_messages.channel_id
      AND user_id = auth.uid()
      AND is_active = true
      AND (permissions->>'can_send')::boolean = true
    )
  );

CREATE POLICY "Users can update their own messages"
  ON public.communication_messages FOR UPDATE
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages"
  ON public.communication_messages FOR DELETE
  USING (auth.uid() = sender_id);

-- Create RLS policies for channel members
CREATE POLICY "Users can view channel members"
  ON public.communication_channel_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.communication_channel_members cm
      WHERE cm.channel_id = communication_channel_members.channel_id
      AND cm.user_id = auth.uid()
      AND cm.is_active = true
    )
  );

CREATE POLICY "Channel admins can add members"
  ON public.communication_channel_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.communication_channel_members
      WHERE channel_id = communication_channel_members.channel_id
      AND user_id = auth.uid()
      AND member_type IN ('owner', 'admin')
    )
  );

CREATE POLICY "Channel admins can update members"
  ON public.communication_channel_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.communication_channel_members cm
      WHERE cm.channel_id = communication_channel_members.channel_id
      AND cm.user_id = auth.uid()
      AND cm.member_type IN ('owner', 'admin')
    )
  );

-- Create RLS policies for templates
CREATE POLICY "Users can view their templates"
  ON public.communication_templates FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for workflows
CREATE POLICY "Users can manage their workflows"
  ON public.communication_workflows FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for tags
CREATE POLICY "Users can manage their tags"
  ON public.communication_tags FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for message tags
CREATE POLICY "Users can manage tags on messages they can view"
  ON public.communication_message_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.communication_messages m
      JOIN public.communication_channel_members cm ON cm.channel_id = m.channel_id
      WHERE m.id = communication_message_tags.message_id
      AND cm.user_id = auth.uid()
      AND cm.is_active = true
    )
  );

-- Create RLS policies for audit log
CREATE POLICY "Users can view their audit logs"
  ON public.communication_audit_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs"
  ON public.communication_audit_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for scheduled messages
CREATE POLICY "Users can manage their scheduled messages"
  ON public.communication_scheduled_messages FOR ALL
  USING (auth.uid() = sender_id);

-- Create RLS policies for analytics
CREATE POLICY "Users can view their analytics"
  ON public.communication_analytics FOR SELECT
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_communication_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_communication_channels_updated_at
  BEFORE UPDATE ON public.communication_channels
  FOR EACH ROW EXECUTE FUNCTION public.update_communication_updated_at();

CREATE TRIGGER update_communication_messages_updated_at
  BEFORE UPDATE ON public.communication_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_communication_updated_at();

CREATE TRIGGER update_communication_templates_updated_at
  BEFORE UPDATE ON public.communication_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_communication_updated_at();

CREATE TRIGGER update_communication_workflows_updated_at
  BEFORE UPDATE ON public.communication_workflows
  FOR EACH ROW EXECUTE FUNCTION public.update_communication_updated_at();