import { supabase } from "@/integrations/supabase/client";
import type { UUID } from "@/domain/db";

export type ChannelType = 'internal' | 'client' | 'contractor' | 'subcontractor' | 'project';
export type StakeholderType = 'office' | 'client' | 'contractor' | 'subcontractor' | 'team';
export type MessageType = 'text' | 'email' | 'file' | 'voice' | 'system' | 'notification';
export type MessageCategory = 'schedule' | 'budget' | 'quality' | 'safety' | 'general' | 'urgent' | 'change_order' | 'approval';
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';
export type MessageStatus = 'draft' | 'sent' | 'read' | 'archived';
export type MemberType = 'owner' | 'admin' | 'member' | 'guest' | 'viewer';

export interface CommunicationChannel {
  id: UUID;
  user_id: UUID;
  name: string;
  channel_type: ChannelType;
  stakeholder_type?: StakeholderType;
  project_id?: UUID;
  job_id?: UUID;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CommunicationMessage {
  id: UUID;
  channel_id: UUID;
  sender_id: UUID;
  message_type: MessageType;
  content: string;
  category?: MessageCategory;
  priority: MessagePriority;
  status: MessageStatus;
  attachments: any[];
  metadata: Record<string, any>;
  parent_message_id?: UUID;
  thread_id?: UUID;
  created_at: string;
  updated_at: string;
  read_at?: string;
  read_by?: UUID[];
}

export interface ChannelMember {
  id: UUID;
  channel_id: UUID;
  user_id: UUID;
  member_type: MemberType;
  permissions: {
    can_send: boolean;
    can_read: boolean;
    can_edit: boolean;
    can_delete: boolean;
  };
  notification_preferences: {
    email: boolean;
    push: boolean;
    in_app: boolean;
  };
  joined_at: string;
  last_read_at?: string;
  is_active: boolean;
}

export interface CommunicationTemplate {
  id: UUID;
  user_id: UUID;
  name: string;
  template_type: 'email' | 'message' | 'notification';
  stakeholder_type?: StakeholderType;
  category?: string;
  subject?: string;
  content: string;
  variables: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const CommunicationHubService = {
  // Channel Management
  async createChannel(data: {
    name: string;
    channel_type: ChannelType;
    stakeholder_type?: StakeholderType;
    project_id?: UUID;
    job_id?: UUID;
    metadata?: Record<string, any>;
  }): Promise<CommunicationChannel> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("No user context");

    const { data: channel, error } = await supabase
      .from("communication_channels")
      .insert({
        ...data,
        user_id: user.user.id,
        metadata: data.metadata || {}
      })
      .select("*")
      .single();

    if (error) throw error;

    // Add creator as owner
    await this.addChannelMember(channel.id, user.user.id, 'owner');

    return channel as CommunicationChannel;
  },

  async getChannels(filters?: {
    channel_type?: ChannelType;
    stakeholder_type?: StakeholderType;
    project_id?: UUID;
    job_id?: UUID;
  }): Promise<CommunicationChannel[]> {
    let query = supabase
      .from("communication_channels")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (filters?.channel_type) {
      query = query.eq("channel_type", filters.channel_type);
    }
    if (filters?.stakeholder_type) {
      query = query.eq("stakeholder_type", filters.stakeholder_type);
    }
    if (filters?.project_id) {
      query = query.eq("project_id", filters.project_id);
    }
    if (filters?.job_id) {
      query = query.eq("job_id", filters.job_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as CommunicationChannel[];
  },

  async getChannelById(channelId: UUID): Promise<CommunicationChannel | null> {
    const { data, error } = await supabase
      .from("communication_channels")
      .select("*")
      .eq("id", channelId)
      .single();

    if (error) throw error;
    return data as CommunicationChannel | null;
  },

  // Message Management
  async sendMessage(data: {
    channel_id: UUID;
    content: string;
    message_type?: MessageType;
    category?: MessageCategory;
    priority?: MessagePriority;
    attachments?: any[];
    parent_message_id?: UUID;
    thread_id?: UUID;
    metadata?: Record<string, any>;
  }): Promise<CommunicationMessage> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("No user context");

    const { data: message, error } = await supabase
      .from("communication_messages")
      .insert({
        ...data,
        sender_id: user.user.id,
        message_type: data.message_type || 'text',
        priority: data.priority || 'normal',
        status: 'sent',
        attachments: data.attachments || [],
        metadata: data.metadata || {}
      })
      .select("*")
      .single();

    if (error) throw error;

    // Log to audit
    await this.logAudit('message_sent', 'message', message.id);

    return message as CommunicationMessage;
  },

  async getMessages(channelId: UUID, options?: {
    limit?: number;
    before?: string;
    category?: MessageCategory;
    priority?: MessagePriority;
    thread_id?: UUID;
  }): Promise<CommunicationMessage[]> {
    let query = supabase
      .from("communication_messages")
      .select("*")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.before) {
      query = query.lt("created_at", options.before);
    }
    if (options?.category) {
      query = query.eq("category", options.category);
    }
    if (options?.priority) {
      query = query.eq("priority", options.priority);
    }
    if (options?.thread_id) {
      query = query.eq("thread_id", options.thread_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return ((data || []) as CommunicationMessage[]).reverse();
  },

  async markMessageAsRead(messageId: UUID): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("No user context");

    // First get the current message to preserve read_by array
    const { data: currentMsg } = await supabase
      .from("communication_messages")
      .select("read_by")
      .eq("id", messageId)
      .single();

    const updatedReadBy = [...(currentMsg?.read_by || []), user.user.id];
    
    const { error } = await supabase
      .from("communication_messages")
      .update({
        status: 'read',
        read_at: new Date().toISOString(),
        read_by: updatedReadBy
      })
      .eq("id", messageId);

    if (error) throw error;
  },

  // Member Management
  async addChannelMember(
    channelId: UUID,
    userId: UUID,
    memberType: MemberType = 'member',
    permissions?: Partial<ChannelMember['permissions']>
  ): Promise<ChannelMember> {
    const defaultPermissions = {
      can_send: true,
      can_read: true,
      can_edit: memberType === 'owner' || memberType === 'admin',
      can_delete: memberType === 'owner' || memberType === 'admin'
    };

    const { data, error } = await supabase
      .from("communication_channel_members")
      .insert({
        channel_id: channelId,
        user_id: userId,
        member_type: memberType,
        permissions: { ...defaultPermissions, ...permissions }
      })
      .select("*")
      .single();

    if (error) throw error;
    return data as ChannelMember;
  },

  async getChannelMembers(channelId: UUID): Promise<ChannelMember[]> {
    const { data, error } = await supabase
      .from("communication_channel_members")
      .select("*")
      .eq("channel_id", channelId)
      .eq("is_active", true);

    if (error) throw error;
    return (data || []) as ChannelMember[];
  },

  async removeChannelMember(channelId: UUID, userId: UUID): Promise<void> {
    const { error } = await supabase
      .from("communication_channel_members")
      .update({ is_active: false })
      .match({ channel_id: channelId, user_id: userId });

    if (error) throw error;
  },

  // Template Management
  async createTemplate(data: {
    name: string;
    template_type: 'email' | 'message' | 'notification';
    stakeholder_type?: StakeholderType;
    category?: string;
    subject?: string;
    content: string;
    variables?: any[];
  }): Promise<CommunicationTemplate> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("No user context");

    const { data: template, error } = await supabase
      .from("communication_templates")
      .insert({
        ...data,
        user_id: user.user.id,
        variables: data.variables || []
      })
      .select("*")
      .single();

    if (error) throw error;
    return template as CommunicationTemplate;
  },

  async getTemplates(filters?: {
    template_type?: 'email' | 'message' | 'notification';
    stakeholder_type?: StakeholderType;
    category?: string;
  }): Promise<CommunicationTemplate[]> {
    let query = supabase
      .from("communication_templates")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (filters?.template_type) {
      query = query.eq("template_type", filters.template_type);
    }
    if (filters?.stakeholder_type) {
      query = query.eq("stakeholder_type", filters.stakeholder_type);
    }
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as CommunicationTemplate[];
  },

  // Scheduled Messages
  async scheduleMessage(data: {
    channel_id: UUID;
    content: string;
    scheduled_for: string;
    metadata?: Record<string, any>;
  }): Promise<any> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("No user context");

    const { data: scheduled, error } = await supabase
      .from("communication_scheduled_messages")
      .insert({
        ...data,
        sender_id: user.user.id,
        metadata: data.metadata || {}
      })
      .select("*")
      .single();

    if (error) throw error;
    return scheduled;
  },

  // Audit Logging
  async logAudit(action: string, entityType: string, entityId?: UUID): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    await supabase
      .from("communication_audit_log")
      .insert({
        user_id: user.user.id,
        action,
        entity_type: entityType,
        entity_id: entityId
      });
  },

  // Real-time Subscriptions
  subscribeToChannel(channelId: UUID, handlers: {
    onMessage?: (message: CommunicationMessage) => void;
    onMemberJoin?: (member: ChannelMember) => void;
    onMemberLeave?: (memberId: UUID) => void;
  }) {
    const channels = [];

    if (handlers.onMessage) {
      const messageChannel = supabase
        .channel(`channel_${channelId}_messages`)
        .on('postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'communication_messages', 
            filter: `channel_id=eq.${channelId}` 
          },
          (payload) => handlers.onMessage!(payload.new as CommunicationMessage)
        )
        .subscribe();
      channels.push(messageChannel);
    }

    if (handlers.onMemberJoin || handlers.onMemberLeave) {
      const memberChannel = supabase
        .channel(`channel_${channelId}_members`)
        .on('postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'communication_channel_members', 
            filter: `channel_id=eq.${channelId}` 
          },
          (payload) => {
            if (payload.eventType === 'INSERT' && handlers.onMemberJoin) {
              handlers.onMemberJoin(payload.new as ChannelMember);
            } else if (payload.eventType === 'UPDATE' && payload.new && !(payload.new as any).is_active && handlers.onMemberLeave) {
              handlers.onMemberLeave((payload.new as any).user_id);
            }
          }
        )
        .subscribe();
      channels.push(memberChannel);
    }

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  },

  // Analytics
  async getChannelAnalytics(channelId: UUID, periodStart: string, periodEnd: string): Promise<any> {
    const { data, error } = await supabase
      .from("communication_analytics")
      .select("*")
      .eq("channel_id", channelId)
      .gte("period_start", periodStart)
      .lte("period_end", periodEnd);

    if (error) throw error;
    return data || [];
  }
};