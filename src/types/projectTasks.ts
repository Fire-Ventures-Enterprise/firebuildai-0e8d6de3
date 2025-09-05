import { z } from "zod";

export const WorkingWindowSchema = z.object({
  /** "08:00" 24h local time */
  start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  end:   z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)
})
.refine(w => w.end > w.start, { message: "end must be after start" });

/** 0=Sun … 6=Sat */
export const WorkingHoursSchema = z.object({
  0: z.array(WorkingWindowSchema).optional(),
  1: z.array(WorkingWindowSchema).optional(),
  2: z.array(WorkingWindowSchema).optional(),
  3: z.array(WorkingWindowSchema).optional(),
  4: z.array(WorkingWindowSchema).optional(),
  5: z.array(WorkingWindowSchema).optional(),
  6: z.array(WorkingWindowSchema).optional(),
}).partial();

export const HolidaysSchema = z.array(
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/) // YYYY-MM-DD
);

export const ProjectTaskSchema = z.object({
  id: z.string().uuid().optional(),
  invoice_id: z.string().uuid(),
  code: z.string().min(1),                 // e.g., "PL_ROUGH"
  label: z.string().min(1),                // "Rough plumbing"
  trade: z.string().min(1).optional(),     // "Plumbing", "Electrical"
  team_id: z.string().uuid().nullable().optional(),
  duration_days: z.number().positive().finite(), // fractional days OK (e.g., 0.5)
  depends_on_codes: z.array(z.string().min(1)).default([]),
  lead_time: z.boolean().default(false),   // true = "waiting" block (no crew)
  scheduled_start: z.string().datetime().nullable().optional(),
  scheduled_end:   z.string().datetime().nullable().optional(),
  status: z.enum(["planned","scheduled","in_progress","completed","cancelled"]).default("planned"),
});

export type ProjectTask = z.infer<typeof ProjectTaskSchema>;
export type WorkingHours = z.infer<typeof WorkingHoursSchema>;