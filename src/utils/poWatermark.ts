import type { PurchaseOrderWithJoins } from "@/domain/db";

export function buildWatermark(po: PurchaseOrderWithJoins, companyName?: string) {
  const now = new Date().toLocaleDateString();
  if (po.payment_status === "paid") return `PAID · ${now}${companyName ? ` · ${companyName}` : ""}`;
  if (po.status === "draft")       return `DRAFT · ${now}${companyName ? ` · ${companyName}` : ""}`;
  if (po.status === "submitted")   return `SUBMITTED · ${now}${companyName ? ` · ${companyName}` : ""}`;
  if (po.status === "approved")    return `APPROVED · ${now}${companyName ? ` · ${companyName}` : ""}`;
  return `${po.payment_status.toUpperCase()} · ${now}${companyName ? ` · ${companyName}` : ""}`;
}