import { z } from "zod";

export const vendorSchema = z.object({
  name: z.string().min(2, "Vendor name is required"),
  contact_name: z.string().optional().nullable(),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  payment_terms: z.string().optional().nullable(),
  default_tax_rate: z.coerce.number().min(0).max(100).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const poItemSchema = z.object({
  id: z.string().uuid().optional(),
  description: z.string().min(2, "Description required"),
  qty: z.coerce.number().positive("Qty must be > 0"),
  unit_price: z.coerce.number().nonnegative("Unit price cannot be negative"),
  tax_rate: z.coerce.number().min(0).max(100).optional().nullable(),
});

export const poSchema = z.object({
  job_id: z.string().uuid("Select a job"),
  vendor_id: z.string().uuid("Select a vendor"),
  terms: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),            // yyyy-mm-dd
  expected_delivery: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(poItemSchema).min(1, "At least one line item is required"),
  status: z.enum(["draft","submitted","approved","closed"]).default("draft"),
  payment_status: z.enum(["pending","partial","paid","cancelled"]).default("pending"),
  payment_method: z.enum(["card","bank_transfer","check","cash","other"]).nullish(),
});

export const chatMessageSchema = z.object({
  body: z.string().min(1, "Type a message"),
});