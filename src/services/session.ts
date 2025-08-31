import { supabase } from "@/integrations/supabase/client";
import type { UUID } from "@/domain/db";

// Match the actual database schema for profiles
export interface Profile {
  id: UUID;
  email: string;
  full_name?: string | null;
  company_name?: string | null;
  trial_starts_at: string;
  trial_ends_at: string;
  trial_status: string;
  subscription_status?: string | null;
  is_subscribed: boolean;
  data_retention_until?: string | null;
  notify_on_invoice_override?: boolean | null;
  notify_on_change_order?: boolean | null;
  created_at: string;
  updated_at: string;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", auth.user.id).single();
  if (error) return null;
  return data as Profile;
}

export async function getCurrentCompanyId(): Promise<UUID | null> {
  // Since profiles don't have company_id, we'll use user_id as the company context
  const { data: auth } = await supabase.auth.getUser();
  return auth.user?.id ?? null;
}