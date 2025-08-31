import { supabase } from "@/integrations/supabase/client";
import type {
  PurchaseOrder, PurchaseOrderItem, PoPayment, PurchaseOrderWithJoins,
  UUID, PoStatus, PaymentStatus, PaymentMethod
} from "@/domain/db";
import { getCurrentCompanyId } from "./session";

export interface PoFilters {
  vendorId?: UUID;
  jobId?: UUID;
  status?: PoStatus;
  paymentStatus?: PaymentStatus;
  q?: string;
  limit?: number;
  offset?: number;
}

export const PurchaseOrders = {
  async list(filters: PoFilters = {}): Promise<PurchaseOrderWithJoins[]> {
    const { vendorId, jobId, status, paymentStatus, q, limit = 25, offset = 0 } = filters;

    let query = supabase
      .from("purchase_orders")
      .select(`
        *,
        vendor:vendors ( id, name, email, phone ),
        job:jobs ( id, title )
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (vendorId) query = query.eq("vendor_id", vendorId);
    if (jobId) query = query.eq("job_id", jobId);
    if (status) query = query.eq("status", status);
    if (paymentStatus) query = query.eq("payment_status", paymentStatus);
    if (q) query = query.or(`po_number.ilike.%${q}%,notes.ilike.%${q}%`);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as unknown as PurchaseOrderWithJoins[];
  },

  async get(id: UUID): Promise<PurchaseOrderWithJoins | null> {
    const { data, error } = await supabase
      .from("purchase_orders")
      .select(`
        *,
        vendor:vendors ( id, name, email, phone ),
        job:jobs ( id, title ),
        items:purchase_order_items(*),
        payments:po_payments(*)
      `)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as unknown as PurchaseOrderWithJoins;
  },

  async create(
    base: any,
    items: Array<any>
  ): Promise<PurchaseOrderWithJoins> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("No user context");

    const { data: po, error } = await supabase.from("purchase_orders")
      .insert({ 
        ...base, 
        user_id: user.user.id,
        vendor_name: base.vendor_name || "Unknown Vendor",
        subtotal: 0, 
        tax_amount: 0, 
        total: 0 
      })
      .select("*").single();
    if (error) throw error;

    if (items?.length) {
      const payload = items.map(i => ({ 
        purchase_order_id: po.id,
        description: i.description,
        quantity: i.qty,
        rate: i.unit_price,
        amount: i.qty * i.unit_price
      }));
      const { error: itemErr } = await supabase.from("purchase_order_items").insert(payload);
      if (itemErr) throw itemErr;
    }
    // totals & po_number set by triggers
    return await this.get(po.id) as PurchaseOrderWithJoins;
  },

  async upsertItems(poId: UUID, items: Array<Omit<PurchaseOrderItem, "id"|"po_id"|"line_total">>) {
    const payload = items.map(i => ({ ...i, po_id: poId }));
    const { data, error } = await supabase.from("purchase_order_items").upsert(payload).select("*");
    if (error) throw error;
    return data ?? [];
  },

  async removeItem(itemId: UUID) {
    const { error } = await supabase.from("purchase_order_items").delete().eq("id", itemId);
    if (error) throw error;
  },

  async setStatus(poId: UUID, status: PoStatus) {
    const { data, error } = await supabase.from("purchase_orders").update({ status }).eq("id", poId).select("*").single();
    if (error) throw error;
    return data!;
  },

  async setPayment(poId: UUID, paymentStatus: PaymentStatus, method?: PaymentMethod | null) {
    const { data, error } = await supabase.from("purchase_orders")
      .update({ payment_status: paymentStatus, payment_method: method ?? null })
      .eq("id", poId).select("*").single();
    if (error) throw error;
    return data!;
  },

  async recordPayment(poId: UUID, amount: number, method: PaymentMethod, reference?: string) {
    const { data, error } = await supabase.from("po_payments")
      .insert({ po_id: poId, amount, method, reference: reference ?? null })
      .select("*").single();
    if (error) throw error;
    return data!;
  },
};