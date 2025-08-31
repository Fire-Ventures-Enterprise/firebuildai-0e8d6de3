import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/domain/db";

export const Jobs = {
  async listActive(): Promise<Pick<Job, "id" | "title">[]> {
    const { data, error } = await supabase
      .from("jobs")
      .select("id,title")
      .order("title", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
};