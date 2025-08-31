import { supabase } from "@/integrations/supabase/client";
import type { Profile, UUID } from "@/domain/db";

export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", auth.user.id).single();
  if (error) return null;
  return data as Profile;
}

export async function getCurrentCompanyId(): Promise<UUID | null> {
  const prof = await getCurrentProfile();
  return prof?.company_id ?? null;
}