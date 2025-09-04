import { supabase } from "@/integrations/supabase/client";
import { InvoiceScheduleInput, InvoiceSchedule } from "@/types/scheduling";

export async function getInvoiceSchedule(invoiceId: string): Promise<InvoiceSchedule | null> {
  const { data, error } = await supabase
    .from("invoice_scheduling")
    .select("*")
    .eq("invoice_id", invoiceId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching invoice schedule:', error);
    throw error;
  }
  
  return data as InvoiceSchedule | null;
}

export async function upsertInvoiceSchedule(payload: InvoiceScheduleInput): Promise<void> {
  const dbPayload = {
    invoice_id: payload.invoice_id,
    starts_at: payload.starts_at,
    ends_at: payload.ends_at,
    team_id: payload.team_id || null,
    status: payload.status || 'scheduled',
    notes: payload.notes || null
  };
  
  const { error } = await supabase
    .from("invoice_scheduling")
    .upsert(dbPayload, { onConflict: "invoice_id" });
  
  if (error) {
    console.error('Error upserting invoice schedule:', error);
    throw error;
  }

  // Sync to calendar using the database function
  const { error: syncError } = await supabase.rpc("sync_invoice_schedule_to_calendar", { 
    p_invoice_id: payload.invoice_id 
  });
  
  if (syncError) {
    console.error('Error syncing to calendar:', syncError);
    // Don't throw here - schedule is saved even if sync fails
  }
}

export async function deleteInvoiceSchedule(invoiceId: string): Promise<void> {
  const { error } = await supabase
    .from("invoice_scheduling")
    .delete()
    .eq("invoice_id", invoiceId);
  
  if (error) {
    console.error('Error deleting invoice schedule:', error);
    throw error;
  }
  
  // Remove from calendar
  const { error: syncError } = await supabase.rpc("sync_invoice_schedule_to_calendar", { 
    p_invoice_id: invoiceId 
  });
  
  if (syncError) {
    console.error('Error removing from calendar:', syncError);
  }
}