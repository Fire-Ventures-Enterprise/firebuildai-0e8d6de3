import { supabase } from "@/lib/supabase";

export interface WorkOrder {
  id: string;
  user_id: string;
  invoice_id: string;
  schedule_id?: string;
  title: string;
  service_address?: string;
  starts_at: string;
  ends_at: string;
  team_id?: string;
  instructions?: string;
  status: 'issued' | 'in_progress' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WorkOrderItem {
  id: string;
  work_order_id: string;
  source_invoice_item_id?: string;
  kind: 'task' | 'material' | 'equipment' | 'note';
  description: string;
  quantity: number;
  unit?: string;
  sort_order: number;
}

export interface WorkOrderReport {
  id: string;
  work_order_id: string;
  completed_at?: string;
  notes?: string;
  labor_hours: number;
  materials_used: any[];
  photos: any[];
  signatures: any[];
}

export async function createWorkOrderFromInvoice(invoiceId: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase.rpc('create_work_order_from_invoice' as any, {
    p_invoice_id: invoiceId
  });

  if (error) throw error;
  return data as string;
}

export async function getWorkOrder(id: string): Promise<WorkOrder | null> {
  const { data, error } = await supabase
    .from('work_orders' as any)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching work order:', error);
    return null;
  }

  return data as WorkOrder;
}

export async function getWorkOrderItems(workOrderId: string): Promise<WorkOrderItem[]> {
  const { data, error } = await supabase
    .from('work_order_items' as any)
    .select('*')
    .eq('work_order_id', workOrderId)
    .order('sort_order');

  if (error) {
    console.error('Error fetching work order items:', error);
    return [];
  }

  return (data || []) as WorkOrderItem[];
}

export async function updateWorkOrderStatus(id: string, status: WorkOrder['status']): Promise<void> {
  const { error } = await supabase
    .from('work_orders' as any)
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function createWorkOrderToken(workOrderId: string): Promise<string> {
  const { data, error } = await supabase.rpc('create_work_order_token' as any, { 
    p_work_order_id: workOrderId 
  });
  
  if (error) throw error;
  return data as string; // plaintext token
}

export async function getWorkOrderByToken(token: string): Promise<any> {
  const { data, error } = await supabase.rpc('get_work_order_by_token' as any, {
    p_token: token
  });

  if (error) throw error;
  return data;
}

export async function submitWorkOrderReport(
  token: string,
  report: {
    notes?: string;
    labor_hours?: number;
    materials_used?: any[];
    photos?: any[];
    signatures?: any[];
  }
): Promise<boolean> {
  const { data, error } = await supabase.rpc('submit_work_order_report_by_token' as any, {
    p_token: token,
    p_notes: report.notes || null,
    p_labor_hours: report.labor_hours || 0,
    p_materials_used: report.materials_used || [],
    p_photos: report.photos || [],
    p_signatures: report.signatures || []
  });

  if (error) throw error;
  return data as boolean;
}

export async function getWorkOrderReport(workOrderId: string): Promise<WorkOrderReport | null> {
  const { data, error } = await supabase
    .from('work_order_reports' as any)
    .select('*')
    .eq('work_order_id', workOrderId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching work order report:', error);
  }

  return data as WorkOrderReport;
}