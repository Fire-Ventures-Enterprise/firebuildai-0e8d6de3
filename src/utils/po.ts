import type { PurchaseOrderWithJoins } from "@/domain/db";

export const paidToDate = (po: PurchaseOrderWithJoins) =>
  (po.payments ?? []).reduce((a, p) => a + (p.amount ?? 0), 0);

export const outstanding = (po: PurchaseOrderWithJoins) =>
  Math.max(0, (po.total ?? 0) - paidToDate(po));

// Alias for backward compatibility
export const poOutstanding = outstanding;

export const lastPayment = (po: PurchaseOrderWithJoins) =>
  [...(po.payments ?? [])].sort((a, b) => (b.paid_at > a.paid_at ? 1 : -1))[0];