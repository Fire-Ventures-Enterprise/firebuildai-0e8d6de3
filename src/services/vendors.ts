import { supabase } from "@/integrations/supabase/client";
import type { UUID } from "@/domain/db";

// Match the actual database schema for vendors
export interface Vendor {
  id: UUID;
  user_id: UUID;
  company_name: string;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  payment_terms?: string | null;
  tax_rate?: number | null;
  default_category?: string | null;
  notes?: string | null;
  active?: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface VendorListParams { 
  q?: string; 
  limit?: number; 
  offset?: number; 
}

export const Vendors = {
  async list(params: VendorListParams = {}): Promise<Vendor[]> {
    const { q, limit = 25, offset = 0 } = params;
    let query = supabase.from("vendors").select("*").order("company_name", { ascending: true }).range(offset, offset + limit - 1);
    if (q) query = query.ilike("company_name", `%${q}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async get(id: UUID): Promise<Vendor | null> {
    const { data, error } = await supabase.from("vendors").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  },

  async create(input: Omit<Vendor, "id"|"created_at"|"updated_at"|"user_id">): Promise<Vendor> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("No user context");
    const { data, error } = await supabase.from("vendors").insert({ ...input, user_id: user.user.id }).select("*").single();
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