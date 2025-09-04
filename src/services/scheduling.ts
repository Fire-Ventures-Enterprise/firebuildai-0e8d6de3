import { supabase } from "@/integrations/supabase/client";
import { InvoiceScheduleInput } from "@/types/scheduling";

export async function getInvoiceSchedule(invoiceId: string) {
  const { data, error } = await supabase
    .from("invoice_scheduling")
    .select("*")
    .eq("invoice_id", invoiceId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

export async function upsertInvoiceSchedule(payload: InvoiceScheduleInput) {
  // Ensure required fields are present
  const scheduleData = {
    invoice_id: payload.invoice_id,
    starts_at: payload.starts_at,
    ends_at: payload.ends_at,
    team_id: payload.team_id || null,
    status: payload.status || 'scheduled',
    notes: payload.notes || null
  };

  const { error } = await supabase
    .from("invoice_scheduling")
    .upsert(scheduleData, { onConflict: "invoice_id" });
  
  if (error) throw error;

  // Sync to calendar using the database function
  const { error: syncError } = await supabase.rpc("sync_invoice_schedule_to_calendar", { 
    p_invoice_id: payload.invoice_id 
  });
  
  if (syncError) throw syncError;
}

export async function deleteInvoiceSchedule(invoiceId: string) {
  const { error } = await supabase
    .from("invoice_scheduling")
    .delete()
    .eq("invoice_id", invoiceId);
  
  if (error) throw error;
  
  // This will also delete the calendar event via the sync function
  const { error: syncError } = await supabase.rpc("sync_invoice_schedule_to_calendar", { 
    p_invoice_id: invoiceId 
  });
  
  if (syncError) throw syncError;
}

// Note: Teams functionality is not currently implemented in the database
// This can be added later when teams/crew management is built