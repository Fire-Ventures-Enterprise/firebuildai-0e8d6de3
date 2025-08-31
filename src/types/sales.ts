import { z } from "zod";

// Status types
export type EstimateStatus = "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired";
export type InvoiceStatus = "draft" | "sent" | "partially_paid" | "paid" | "overdue";

// Interfaces
export interface Estimate {
  id: string;
  user_id: string;
  estimate_number: string | null;
  client_id: string | null;
  job_id: string | null;
  status: EstimateStatus;
  issue_date: string;
  expiry_date: string | null;
  scope: string | null;
  subtotal: number;
  tax_amount: number;
  total: number;
  deposit_required: number | null;
  notes: string | null;
  contract_title: string | null;
  contract_text: string | null;
  signature_data: string | null;
  signed_by_name: string | null;
  signed_by_email: string | null;
  signed_at: string | null;
  signature_ip: string | null;
  created_at: string;
  updated_at: string;
}

export interface EstimateItem {
  id: string;
  estimate_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number | null;
  line_total: number;
  sort_order?: number;
  created_at?: string;
}

export interface InvoicePayment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: string | null;
  paid_at: string;
  reference: string | null;
  receipt_url: string | null;
  stripe_payment_intent_id?: string | null;
  created_at: string;
  updated_at?: string;
}

// Zod schemas
export const estimateItemSchema = z.object({
  id: z.string().uuid().optional(),
  description: z.string().min(2, "Description required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unit_price: z.coerce.number().nonnegative("Price must be non-negative"),
  tax_rate: z.coerce.number().min(0).max(100).optional().nullable(),
});

export const estimateFormSchema = z.object({
  client_id: z.string().uuid("Please select a client"),
  job_id: z.string().uuid().nullable().optional(),
  issue_date: z.string().min(10, "Issue date is required"),
  expiry_date: z.string().nullable().optional(),
  scope: z.string().nullable().optional(),
  deposit_required: z.coerce.number().nonnegative().nullable().optional(),
  notes: z.string().nullable().optional(),
  contract_title: z.string().nullable().optional(),
  contract_text: z.string().nullable().optional(),
  items: z.array(estimateItemSchema).min(1, "At least one line item is required"),
});

export const invoicePaymentSchema = z.object({
  amount: z.coerce.number().positive("Enter an amount"),
  payment_method: z.enum(["card", "bank_transfer", "check", "cash", "other"]),
  paid_at: z.string().optional(),
  reference: z.string().nullable().optional(),
});

export type EstimateFormData = z.infer<typeof estimateFormSchema>;
export type InvoicePaymentFormData = z.infer<typeof invoicePaymentSchema>;