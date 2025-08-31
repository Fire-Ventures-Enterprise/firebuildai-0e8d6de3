import { supabase } from "@/integrations/supabase/client";

export const SalesPublic = {
  // Fetch by token (RLS should permit SELECT where public_token = :token)
  async getEstimateByToken(token: string) {
    const { data, error } = await supabase
      .from("estimates")
      .select(`
        *,
        items:estimate_items(*)
      `)
      .eq("public_token", token)
      .single();
    if (error) throw error;
    
    // Get customer separately to avoid type issues
    let client = null;
    if (data.customer_id) {
      const { data: customerData } = await supabase
        .from("customers")
        .select("*")
        .eq("id", data.customer_id)
        .single();
      
      if (customerData) {
        client = {
          id: customerData.id,
          name: customerData.company_name || `${customerData.first_name || ''} ${customerData.last_name || ''}`.trim(),
          email: customerData.email,
          address: customerData.address ? `${customerData.address}, ${customerData.city}, ${customerData.province} ${customerData.postal_code}` : null
        };
      }
    }
    
    return { ...data, client };
  },

  async markViewedEstimate(token: string) {
    const { error } = await supabase.rpc("mark_estimate_viewed", { p_token: token });
    if (error) console.error("Failed to mark viewed:", error);
  },

  async acceptEstimate(token: string, signer: { name?: string; email?: string }) {
    const { error } = await supabase.rpc("accept_estimate", { 
      p_token: token, 
      p_name: signer.name ?? null, 
      p_email: signer.email ?? null 
    });
    if (error) throw error;
  },

  async getInvoiceByToken(token: string) {
    const { data, error } = await supabase
      .from("invoices_enhanced")
      .select(`
        *,
        items:invoice_items_enhanced(*),
        payments:invoice_payments(*)
      `)
      .eq("public_token", token)
      .single();
    if (error) throw error;
    
    // Get customer separately to avoid type issues
    let client = null;
    if (data.customer_id) {
      const { data: customerData } = await supabase
        .from("customers")
        .select("*")
        .eq("id", data.customer_id)
        .single();
      
      if (customerData) {
        client = {
          id: customerData.id,
          name: customerData.company_name || `${customerData.first_name || ''} ${customerData.last_name || ''}`.trim(),
          email: customerData.email,
          address: customerData.address ? `${customerData.address}, ${customerData.city}, ${customerData.province} ${customerData.postal_code}` : null
        };
      }
    }
    
    // Transform items to expected format
    const items = data.items ? data.items.map((item: any) => ({
      id: item.id,
      description: item.item_name || item.description,
      quantity: item.quantity,
      unit_price: item.rate,
      tax_rate: item.tax ? 13 : 0,
      line_total: item.amount
    })) : [];
    
    return { ...data, client, items };
  },
};