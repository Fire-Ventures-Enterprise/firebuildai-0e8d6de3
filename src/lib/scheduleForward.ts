import type { ProjectTask, WorkingHours } from "@/types/projectTasks";
import { topoSort } from "./toposort";
import { alignToWorkingStart, addBusinessDays } from "./businessDays";

/**
 * Forward scheduler:
 * - Orders tasks by dependencies
 * - Earliest start = max(end of all deps, provided 'from') aligned to working hours
 * - End = addBusinessDays(start, duration_days)
 * - Returns a new array with scheduled_start/end ISO strings
 */
export function computeForwardSchedule(
  tasks: ProjectTask[],
  opts: {
    from?: Date;                       // default: now
    workingHours: WorkingHours;        // { 1:[{start:"08:00", end:"17:00"}], ... }
    holidays?: string[];               // ["2025-12-25", ...]
    bufferDaysPerTask?: number;        // e.g., 0.1 → +0.1 day buffer each
  }
): ProjectTask[] {
  const holidaysSet = new Set(opts.holidays ?? []);
  const from = opts.from ?? new Date();
  const buffer = opts.bufferDaysPerTask ?? 0;

  const byCode = new Map(tasks.map(t => [t.code, t]));
  const order = topoSort(tasks as any) as ProjectTask[];

  const scheduled = new Map<string, { start: Date; end: Date }>();

  for (const t of order) {
    // earliest start is the max end of dependencies
    let earliest = new Date(from);
    for (const dep of (t.depends_on_codes ?? [])) {
      const d = scheduled.get(dep);
      if (d && d.end > earliest) earliest = new Date(d.end);
    }

    // align to next working instant
    const startAligned = alignToWorkingStart(earliest, opts.workingHours, holidaysSet);
    // duration + buffer
    const duration = Math.max(0, t.duration_days + buffer);
    const end = addBusinessDays(startAligned, duration, opts.workingHours, holidaysSet);

    scheduled.set(t.code, { start: startAligned, end });
  }

  // return cloned tasks with ISO timestamps
  return tasks.map(t => {
    const slot = scheduled.get(t.code);
    if (!slot) return t;
    return {
      ...t,
      scheduled_start: slot.start.toISOString(),
      scheduled_end: slot.end.toISOString(),
      status: t.status ?? "scheduled",
    };
  });
}