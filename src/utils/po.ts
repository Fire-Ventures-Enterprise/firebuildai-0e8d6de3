import type { PurchaseOrderWithJoins } from "@/domain/db";

export const poOutstanding = (po: PurchaseOrderWithJoins) => {
  // Calculate total paid from payments array if available
  const totalPaid = po.payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
  return Math.max(0, (po.total ?? 0) - totalPaid);
};