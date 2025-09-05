import type { WorkingHours } from "@/types/projectTasks";

/** Parse "HH:mm" to minutes from midnight */
function toMins(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function atLocal(date: Date, hhmm: string) {
  const d = new Date(date);
  d.setHours(Number(hhmm.slice(0,2)), Number(hhmm.slice(3,5)), 0, 0);
  return d;
}
function ymd(d: Date) {
  return d.toISOString().slice(0,10); // YYYY-MM-DD (UTC). If you need strict local YMD, adjust with TZ.
}
function dayOfWeek(d: Date) { return d.getDay() as 0|1|2|3|4|5|6; }

/** Returns next working window start >= from, or null if none in the next N days */
export function nextWorkingStart(from: Date, hours: WorkingHours, holidays: Set<string>, lookaheadDays = 365): Date | null {
  const probe = new Date(from);
  for (let i = 0; i < lookaheadDays; i++) {
    const dow = dayOfWeek(probe);
    const windows = hours[dow] ?? [];
    if (!holidays.has(ymd(probe)) && windows.length) {
      for (const w of windows) {
        const start = atLocal(probe, w.start);
        const end   = atLocal(probe, w.end);
        if (end <= start) continue;
        if (start >= from) return start;
        // If we're inside a window and still have time left today:
        if (from > start && from < end) return new Date(from);
      }
    }
    // move to next day 00:01 local
    probe.setDate(probe.getDate() + 1);
    probe.setHours(0,1,0,0);
  }
  return null;
}

/** Advance by N business-days worth of time across windows (fractional allowed) */
export function addBusinessDays(start: Date, days: number, hours: WorkingHours, holidays: Set<string>): Date {
  if (days <= 0) return new Date(start);
  let remainingMins = Math.round(days * 24 * 60);
  let cursor = new Date(start);

  while (remainingMins > 0) {
    const dow = dayOfWeek(cursor);
    if (!holidays.has(ymd(cursor)) && (hours[dow]?.length)) {
      for (const w of hours[dow]!) {
        const winStart = atLocal(cursor, w.start);
        const winEnd   = atLocal(cursor, w.end);
        if (winEnd <= winStart) continue;

        // slice of this window we can use today
        const useStart = cursor < winStart ? winStart : cursor;
        if (useStart >= winEnd) continue;

        const slice = Math.max(0, (winEnd.getTime() - useStart.getTime()) / 60000);
        if (slice >= remainingMins) {
          // finishes in this window
          return new Date(useStart.getTime() + remainingMins * 60000);
        } else {
          remainingMins -= slice;
          cursor = new Date(winEnd); // continue after window
        }
      }
    }
    // next day at 00:01
    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(0,1,0,0);
  }
  return cursor;
}

/** Align a start date to the next valid working instant */
export function alignToWorkingStart(d: Date, hours: WorkingHours, holidays: Set<string>): Date {
  const s = nextWorkingStart(d, hours, holidays);
  if (!s) throw new Error("No working hours available in lookahead window.");
  return s;
}