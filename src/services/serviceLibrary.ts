import { supabase } from '@/lib/supabase';
import { ProjectTask } from '@/types/projectTasks';
import { topoSort } from '@/lib/toposort';
import { computeForwardSchedule } from '@/lib/scheduleForward';

export interface Template {
  id: string;
  name: string;
  description: string;
  industry: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateTask {
  id: string;
  template_id: string;
  task_name: string;
  task_code: string;
  duration_days: number;
  depends_on_codes?: string[];
  trade?: string;
  lead_time?: boolean;
  sequence_order: number;
}

export interface TemplateMetric {
  id: string;
  template_id: string;
  metric_name: string;
  display_name: string;
  unit: string;
  default_value?: number;
  required: boolean;
}

export interface TemplateOption {
  id: string;
  template_id: string;
  option_name: string;
  display_name: string;
  description?: string;
  default_selected: boolean;
  affects_tasks?: string[];
}

export async function getTemplates(): Promise<Template[]> {
  const { data, error } = await supabase
    .from('service_templates')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function getTemplateWithTasks(templateId: string) {
  const [templateResult, tasksResult, metricsResult, optionsResult, milestonesResult] = await Promise.all([
    supabase.from('service_templates').select('*').eq('id', templateId).single(),
    supabase.from('service_template_tasks').select('*').eq('template_id', templateId).order('sequence_order'),
    supabase.from('service_template_metrics').select('*').eq('template_id', templateId),
    supabase.from('service_template_options').select('*').eq('template_id', templateId),
    supabase.from('service_template_milestones').select('*').eq('template_id', templateId).order('percentage')
  ]);

  if (templateResult.error) throw templateResult.error;
  
  return {
    ...templateResult.data,
    tasks: tasksResult.data || [],
    metrics: metricsResult.data || [],
    options: optionsResult.data || [],
    milestones: milestonesResult.data || []
  };
}

export async function createProjectTasksFromTemplate(
  templateId: string,
  invoiceId: string,
  metrics: Record<string, number>,
  options: Record<string, boolean>
): Promise<ProjectTask[]> {
  const { data: tasks, error } = await supabase
    .from('service_template_tasks')
    .select('*')
    .eq('template_id', templateId)
    .order('sequence_order');
  
  if (error) throw error;
  if (!tasks) return [];
  
  // Apply metric-based duration adjustments
  const adjustedTasks = tasks.map(task => {
    let duration = task.duration_days;
    
    // Example: Adjust duration based on square footage for certain tasks
    if (metrics.square_footage && task.task_name.toLowerCase().includes('flooring')) {
      duration = Math.ceil(metrics.square_footage / 500); // 500 sq ft per day
    }
    
    return {
      invoice_id: invoiceId,
      code: task.task_code,
      label: task.task_name,
      trade: task.trade,
      duration_days: duration,
      depends_on_codes: task.depends_on_codes || [],
      lead_time: task.lead_time || false,
      status: 'planned' as const
    };
  });
  
  // Filter tasks based on selected options
  const filteredTasks = adjustedTasks.filter(task => {
    // If task is affected by an option, only include if option is selected
    const affectedByOption = Object.entries(options).find(([optionName, selected]) => {
      // This would need to be implemented based on your option configuration
      return false; // Placeholder
    });
    
    return !affectedByOption || affectedByOption[1];
  });
  
  return filteredTasks;
}

export async function scheduleProjectTasks(
  invoiceId: string,
  tasks: ProjectTask[],
  startDate: Date,
  options: {
    workingHours?: any;
    holidays?: string[];
    bufferDaysPerTask?: number;
  }
): Promise<ProjectTask[]> {
  // Get company working hours and holidays
  const { data: companyData } = await supabase
    .from('company_details')
    .select('working_hours, holidays')
    .single();
  
  const workingHours = options.workingHours || companyData?.working_hours || {
    1: [{ start: '08:00', end: '17:00' }],
    2: [{ start: '08:00', end: '17:00' }],
    3: [{ start: '08:00', end: '17:00' }],
    4: [{ start: '08:00', end: '17:00' }],
    5: [{ start: '08:00', end: '17:00' }]
  };
  
  const holidays = options.holidays || companyData?.holidays || [];
  const bufferDaysPerTask = options.bufferDaysPerTask || 0;
  
  // Use the forward scheduling algorithm
  const scheduledTasks = computeForwardSchedule(tasks, {
    from: startDate,
    workingHours,
    holidays,
    bufferDaysPerTask
  });
  
  // Save scheduled tasks to database
  const { error } = await supabase
    .from('project_tasks')
    .upsert(scheduledTasks);
  
  if (error) throw error;
  
  return scheduledTasks;
}

export async function getIndustryServices(industry: string) {
  const { data, error } = await supabase
    .from('service_templates')
    .select('*')
    .eq('industry', industry)
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function createCustomTemplate(template: Partial<Template>, tasks: Partial<TemplateTask>[]) {
  // Start a transaction
  const { data: newTemplate, error: templateError } = await supabase
    .from('service_templates')
    .insert(template)
    .select()
    .single();
  
  if (templateError) throw templateError;
  
  // Add tasks to the template
  const tasksWithTemplateId = tasks.map(task => ({
    ...task,
    template_id: newTemplate.id
  }));
  
  const { error: tasksError } = await supabase
    .from('service_template_tasks')
    .insert(tasksWithTemplateId);
  
  if (tasksError) throw tasksError;
  
  return newTemplate;
}