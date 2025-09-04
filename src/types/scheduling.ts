import { z } from "zod";

export const InvoiceScheduleSchema = z.object({
  invoice_id: z.string().uuid(),
  starts_at: z.string(), // ISO
  ends_at: z.string(),   // ISO
  team_id: z.string().uuid().nullable().optional(),
  status: z.enum(['scheduled','rescheduled','completed','cancelled']).default('scheduled'),
  notes: z.string().max(4000).optional()
});

export type InvoiceScheduleInput = z.infer<typeof InvoiceScheduleSchema>;

export interface InvoiceSchedule {
  id: string;
  invoice_id: string;
  starts_at: string;
  ends_at: string;
  team_id: string | null;
  status: 'scheduled' | 'rescheduled' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  location: string | null;
  team_id: string | null;
  source: string;
  source_id: string;
  created_at: string;
  updated_at: string;
}