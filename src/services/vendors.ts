import { supabase } from "@/integrations/supabase/client";
import type { Vendor, UUID } from "@/domain/db";
import { getCurrentCompanyId } from "./session";

export interface VendorListParams { 
  q?: string; 
  limit?: number; 
  offset?: number; 
}

export const Vendors = {
  async list(params: VendorListParams = {}): Promise<Vendor[]> {
    const { q, limit = 25, offset = 0 } = params;
    let query = supabase.from("vendors").select("*").order("name", { ascending: true }).range(offset, offset + limit - 1);
    if (q) query = query.ilike("name", `%${q}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async get(id: UUID): Promise<Vendor | null> {
    const { data, error } = await supabase.from("vendors").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  },

  async create(input: Omit<Vendor, "id"|"created_at"|"updated_at"|"created_by"|"company_id">): Promise<Vendor> {
    const company_id = await getCurrentCompanyId();
    if (!company_id) throw new Error("No company context");
    const { data, error } = await supabase.from("vendors").insert({ ...input, company_id }).select("*").single();
    if (error) throw error;
    return data!;
  },

  async update(id: UUID, patch: Partial<Vendor>): Promise<Vendor> {
    const { data, error } = await supabase.from("vendors")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*").single();
    if (error) throw error;
    return data!;
  },

  async remove(id: UUID): Promise<void> {
    const { error } = await supabase.from("vendors").delete().eq("id", id);
    if (error) throw error;
  },
};