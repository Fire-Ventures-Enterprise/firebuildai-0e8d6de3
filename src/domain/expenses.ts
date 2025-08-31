import { z } from "zod";

export const ExpenseAllocationSchema = z.object({
  job_id: z.string().uuid().optional().nullable(),
  percent: z.number().min(0).max(100).optional().nullable(),
  amount: z.number().min(0).optional().nullable(),
  cost_code: z.string().max(64).optional().nullable(),
});

export const ExpenseSchema = z.object({
  user_id: z.string().uuid(),
  category_id: z.string().uuid(),
  vendor_id: z.string().uuid().nullable().optional(),
  po_id: z.string().uuid().nullable().optional(),
  txn_date: z.string(), // ISO date
  currency: z.string().default("CAD"),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative().default(0),
  payment_method: z.enum(['card','etransfer','cash','cheque','ach','other']).optional().nullable(),
  notes: z.string().optional().nullable(),
  allocations: z.array(ExpenseAllocationSchema).default([]),
  status: z.enum(['draft', 'submitted', 'approved', 'reimbursed', 'rejected']).default('draft'),
});

export const MileageLogSchema = z.object({
  expense_id: z.string().uuid(),
  vehicle_name: z.string().optional().nullable(),
  start_odometer: z.number().optional().nullable(),
  end_odometer: z.number().optional().nullable(),
  distance_km: z.number().optional().nullable(),
  rate_per_km: z.number().default(0.68),
});

export type ExpenseInput = z.infer<typeof ExpenseSchema>;
export type ExpenseAllocation = z.infer<typeof ExpenseAllocationSchema>;
export type MileageLog = z.infer<typeof MileageLogSchema>;

export interface ExpenseCategory {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  is_mileage: boolean;
  is_fuel: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExpenseReceipt {
  id: string;
  expense_id: string;
  storage_path: string;
  mime: string;
  ocr_json?: any;
  parsed?: {
    vendor?: string;
    date?: string;
    total?: number;
    tax?: number;
    subtotal?: number;
  };
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  created_by: string;
  category_id: string;
  vendor_id?: string | null;
  po_id?: string | null;
  job_locked: boolean;
  txn_date: string;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  payment_method?: string | null;
  paid_at?: string | null;
  notes?: string | null;
  status: 'draft' | 'submitted' | 'approved' | 'reimbursed' | 'rejected';
  created_at: string;
  updated_at: string;
  
  // Relations
  category?: ExpenseCategory;
  receipts?: ExpenseReceipt[];
  allocations?: ExpenseAllocation[];
  mileage_log?: MileageLog;
}