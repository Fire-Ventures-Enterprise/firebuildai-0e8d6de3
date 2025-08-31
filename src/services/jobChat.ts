import { supabase } from "@/integrations/supabase/client";
import type { UUID } from "@/domain/db";

export const JobChatService = {
  async ensureChatForJob(jobId: UUID): Promise<any> {
    const existing = await supabase.from("job_chats").select("*").eq("job_id", jobId).limit(1);
    if (existing.error) throw existing.error;
    if (existing.data && existing.data.length) return existing.data[0];

    const { data, error } = await supabase.from("job_chats")
      .insert({ job_id: jobId })
      .select("*").single();
    if (error) throw error;
    return data!;
  },

  async listMessages(chatId: UUID, limit = 50, before?: string): Promise<any[]> {
    let q = supabase.from("job_chat_messages").select("*").eq("chat_id", chatId)
      .order("created_at", { ascending: false }).limit(limit);
    if (before) q = q.lt("created_at", before);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).reverse();
  },

  async sendMessage(chatId: UUID, message: string, attachments?: any): Promise<any> {
    const { data, error } = await supabase.from("job_chat_messages")
      .insert({ chat_id: chatId, message, attachments: attachments ?? [] })
      .select("*").single();
    if (error) throw error;
    return data!;
  },

  async addMember(chatId: UUID, userId: UUID, role: "member" | "manager" = "member"): Promise<any> {
    const { data, error } = await supabase.from("job_chat_members")
      .insert({ chat_id: chatId, user_id: userId, role })
      .select("*").single();
    if (error) throw error;
    return data!;
  },

  async removeMember(chatId: UUID, userId: UUID): Promise<void> {
    const { error } = await supabase.from("job_chat_members").delete().match({ chat_id: chatId, user_id: userId });
    if (error) throw error;
  },

  subscribeToMessages(chatId: UUID, onInsert: (msg: any) => void) {
    const channel = supabase
      .channel(`job_chat_${chatId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'job_chat_messages', filter: `chat_id=eq.${chatId}` },
        (payload) => onInsert(payload.new)
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  },
};