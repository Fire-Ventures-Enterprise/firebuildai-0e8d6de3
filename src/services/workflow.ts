import { supabase } from "@/integrations/supabase/client";
import { ProjectTask } from "./templates";

export interface WorkingHours {
  id: string;
  user_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_working_day: boolean;
}

export interface CompanyHoliday {
  id: string;
  user_id: string;
  holiday_date: string;
  name?: string;
}

export interface Team {
  id: string;
  user_id: string;
  name: string;
  trade?: string;
  lead_name?: string;
  phone?: string;
  email?: string;
  default_capacity: number;
  color?: string;
  is_active: boolean;
}

export interface TeamCapacity {
  id: string;
  team_id: string;
  date: string;
  total_slots: number;
  used_slots: number;
}

export interface BlackoutWindow {
  id: string;
  user_id: string;
  location_id?: string;
  start_date: string;
  end_date: string;
  reason?: string;
}

// Fetch working hours
export async function getWorkingHours(): Promise<WorkingHours[]> {
  const { data, error } = await supabase
    .from('company_working_hours')
    .select('*')
    .order('day_of_week');
  
  if (error) {
    console.error('Error fetching working hours:', error);
    return [];
  }
  
  return data || [];
}

// Fetch holidays
export async function getHolidays(startDate: Date, endDate: Date): Promise<CompanyHoliday[]> {
  const { data, error } = await supabase
    .from('company_holidays')
    .select('*')
    .gte('holiday_date', startDate.toISOString().split('T')[0])
    .lte('holiday_date', endDate.toISOString().split('T')[0])
    .order('holiday_date');
  
  if (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
  
  return data || [];
}

// Fetch teams
export async function getTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
  
  return data || [];
}

// Fetch team capacity for date range
export async function getTeamCapacity(
  teamId: string,
  startDate: Date,
  endDate: Date
): Promise<TeamCapacity[]> {
  const { data, error } = await supabase
    .from('team_capacity')
    .select('*')
    .eq('team_id', teamId)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date');
  
  if (error) {
    console.error('Error fetching team capacity:', error);
    return [];
  }
  
  return data || [];
}

// Fetch blackout windows
export async function getBlackoutWindows(
  startDate: Date,
  endDate: Date
): Promise<BlackoutWindow[]> {
  const { data, error } = await supabase
    .from('blackout_windows')
    .select('*')
    .lte('start_date', endDate.toISOString())
    .gte('end_date', startDate.toISOString())
    .order('start_date');
  
  if (error) {
    console.error('Error fetching blackout windows:', error);
    return [];
  }
  
  return data || [];
}

// Fetch project tasks for scheduling
export async function getProjectTasks(
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  const { data, error } = await supabase
    .from('project_tasks')
    .select(`
      *,
      teams:team_id (
        id,
        name,
        color,
        trade
      )
    `)
    .or(`scheduled_start.is.null,and(scheduled_start.gte.${startDate.toISOString()},scheduled_end.lte.${endDate.toISOString()})`)
    .order('scheduled_start', { ascending: true, nullsFirst: false });
  
  if (error) {
    console.error('Error fetching project tasks:', error);
    return [];
  }
  
  return data || [];
}

// Check if date is a working day
export function isWorkingDay(
  date: Date,
  workingHours: WorkingHours[],
  holidays: CompanyHoliday[]
): boolean {
  const dayOfWeek = date.getDay();
  const dateStr = date.toISOString().split('T')[0];
  
  // Check if it's a holiday
  if (holidays.some(h => h.holiday_date === dateStr)) {
    return false;
  }
  
  // Check working hours for this day
  const dayHours = workingHours.find(wh => wh.day_of_week === dayOfWeek);
  return dayHours?.is_working_day || false;
}

// Calculate business days between two dates
export function calculateBusinessDays(
  startDate: Date,
  endDate: Date,
  workingHours: WorkingHours[],
  holidays: CompanyHoliday[]
): number {
  let days = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    if (isWorkingDay(current, workingHours, holidays)) {
      days++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return days;
}

// Add business days to a date
export function addBusinessDays(
  startDate: Date,
  daysToAdd: number,
  workingHours: WorkingHours[],
  holidays: CompanyHoliday[]
): Date {
  const result = new Date(startDate);
  let daysAdded = 0;
  
  while (daysAdded < daysToAdd) {
    result.setDate(result.getDate() + 1);
    if (isWorkingDay(result, workingHours, holidays)) {
      daysAdded++;
    }
  }
  
  return result;
}

// Check if task is in frozen zone
export function isInFrozenZone(
  taskDate: Date,
  frozenDays: number = 3
): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const frozenUntil = new Date(today);
  frozenUntil.setDate(frozenUntil.getDate() + frozenDays);
  
  return taskDate < frozenUntil;
}

// Calculate ripple effect when moving a task
export async function calculateRippleEffect(
  task: ProjectTask,
  newStartDate: Date,
  allTasks: ProjectTask[],
  workingHours: WorkingHours[],
  holidays: CompanyHoliday[]
): Promise<Map<string, { newStart: Date; newEnd: Date }>> {
  const updates = new Map<string, { newStart: Date; newEnd: Date }>();
  
  // Calculate new end date for the moved task
  const newEndDate = addBusinessDays(
    newStartDate,
    task.duration_days,
    workingHours,
    holidays
  );
  
  updates.set(task.id, { newStart: newStartDate, newEnd: newEndDate });
  
  // Find all dependent tasks
  const dependentTasks = allTasks.filter(t => 
    t.depends_on_codes?.includes(task.code)
  );
  
  // Recursively update dependent tasks
  for (const dependent of dependentTasks) {
    const depNewStart = new Date(newEndDate);
    depNewStart.setDate(depNewStart.getDate() + 1);
    
    // Skip weekends to next business day
    while (!isWorkingDay(depNewStart, workingHours, holidays)) {
      depNewStart.setDate(depNewStart.getDate() + 1);
    }
    
    const depUpdates = await calculateRippleEffect(
      dependent,
      depNewStart,
      allTasks,
      workingHours,
      holidays
    );
    
    depUpdates.forEach((value, key) => {
      updates.set(key, value);
    });
  }
  
  return updates;
}

// Update task schedule
export async function updateTaskSchedule(
  taskId: string,
  scheduledStart: Date,
  scheduledEnd: Date,
  teamId?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('project_tasks')
    .update({
      scheduled_start: scheduledStart.toISOString(),
      scheduled_end: scheduledEnd.toISOString(),
      team_id: teamId,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId);
  
  if (error) {
    console.error('Error updating task schedule:', error);
    return false;
  }
  
  return true;
}

// Check team capacity conflicts
export async function checkCapacityConflicts(
  teamId: string,
  date: Date
): Promise<{ hasConflict: boolean; availableSlots: number }> {
  const dateStr = date.toISOString().split('T')[0];
  
  // Get team info
  const { data: team } = await supabase
    .from('teams')
    .select('default_capacity')
    .eq('id', teamId)
    .single();
  
  if (!team) {
    return { hasConflict: false, availableSlots: 1 };
  }
  
  // Get capacity for this date
  const { data: capacity } = await supabase
    .from('team_capacity')
    .select('*')
    .eq('team_id', teamId)
    .eq('date', dateStr)
    .maybeSingle();
  
  const totalSlots = capacity?.total_slots || team.default_capacity;
  const usedSlots = capacity?.used_slots || 0;
  const availableSlots = totalSlots - usedSlots;
  
  return {
    hasConflict: availableSlots <= 0,
    availableSlots
  };
}

// Get frozen zone settings
export async function getFrozenZoneSettings(): Promise<number> {
  const { data } = await supabase
    .from('company_details')
    .select('frozen_zone_days')
    .single();
  
  return data?.frozen_zone_days || 3;
}