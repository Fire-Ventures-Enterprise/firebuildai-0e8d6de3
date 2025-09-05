import { computeForwardSchedule } from "@/lib/scheduleForward";
import type { ProjectTask, WorkingHours } from "@/types/projectTasks";

const workingHours: WorkingHours = {
  1: [{ start: "08:00", end: "17:00" }],
  2: [{ start: "08:00", end: "17:00" }],
  3: [{ start: "08:00", end: "17:00" }],
  4: [{ start: "08:00", end: "17:00" }],
  5: [{ start: "08:00", end: "17:00" }],
  // weekends off
};

const holidays = ["2025-12-25", "2025-12-26"];

const tasks: ProjectTask[] = [
  { invoice_id: crypto.randomUUID(), code: "CONTAIN", label:"Containment", duration_days: 0.5, depends_on_codes: [] },
  { invoice_id: crypto.randomUUID(), code: "DEMO_CASEWORK", label:"Demo cabinets", duration_days: 1, depends_on_codes: ["CONTAIN"] },
  { invoice_id: crypto.randomUUID(), code: "PL_SAFE_OFF", label:"Plumbing safe-off", duration_days: 0.5, depends_on_codes: ["DEMO_CASEWORK"] },
  { invoice_id: crypto.randomUUID(), code: "EL_SAFE_OFF", label:"Electrical safe-off", duration_days: 0.5, depends_on_codes: ["DEMO_CASEWORK"] },
  { invoice_id: crypto.randomUUID(), code: "DRYWALL", label:"Drywall & mud", duration_days: 2, depends_on_codes: ["PL_SAFE_OFF","EL_SAFE_OFF"] },
  { invoice_id: crypto.randomUUID(), code: "PAINT_1", label:"Prime & first coat", duration_days: 1, depends_on_codes: ["DRYWALL"] },
];

const scheduled = computeForwardSchedule(tasks, {
  from: new Date(),
  workingHours,
  holidays,
  bufferDaysPerTask: 0.1, // ~10% buffer per task
});

console.table(scheduled.map(t => ({
  code: t.code, start: t.scheduled_start, end: t.scheduled_end
})));