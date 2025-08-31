import { supabase } from "@/integrations/supabase/client";
import { getCurrentCompanyId } from "@/services/session";
import type { PoPayment } from "@/domain/db";

export const POFiles = {
  async uploadReceipt(poId: string, file: File, paymentId?: string) {
    const companyId = await getCurrentCompanyId();
    if (!companyId) throw new Error("No company context");
    const safe = file.name.replace(/[^\w.\-]+/g, "_");
    const slot = paymentId ? `receipts/${paymentId}` : `receipts/misc`;
    const path = `${companyId}/${poId}/${slot}/${Date.now()}_${safe}`;

    const { error } = await supabase.storage
      .from("po-files")
      .upload(path, file, { 
        upsert: false, 
        cacheControl: "3600", 
        contentType: file.type || "application/octet-stream" 
      });
    if (error) throw error;
    return path; // persist in po_payments.receipt_url if tied to a payment
  },

  async deleteReceipt(path: string) {
    const { error } = await supabase.storage.from("po-files").remove([path]);
    if (error) throw error;
  },

  async listReceipts(poId: string) {
    const companyId = await getCurrentCompanyId();
    if (!companyId) throw new Error("No company context");
    const base = `${companyId}/${poId}/receipts`;
    const { data, error } = await supabase.storage.from("po-files").list(base, {
      limit: 100, 
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) throw error;
    return (data ?? []).map(o => `${base}/${o.name}`);
  },

  async sign(path: string, expiresIn = 3600) {
    const { data, error } = await supabase.storage.from("po-files").createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data.signedUrl;
  },

  async signMany(paths: string[], expiresIn = 3600) {
    const results = await Promise.all(paths.map(async p => [p, await this.sign(p, expiresIn)] as const));
    return Object.fromEntries(results); // { [path]: signedUrl }
  },

  // Gather all receipt paths: from payments (receipt_url) + PO-level misc
  async gatherReceiptPaths(poId: string, payments: PoPayment[] = []) {
    const misc = await this.listReceipts(poId);
    const paymentPaths = payments.filter(p => p.receipt_url).map(p => p.receipt_url!) as string[];
    // dedupe
    return Array.from(new Set([...misc, ...paymentPaths]));
  },
};