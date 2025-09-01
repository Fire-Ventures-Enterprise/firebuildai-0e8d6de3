import { supabase } from "@/integrations/supabase/client";

export const SalesPublic = {
  // Use secure token-based function to fetch estimate
  async getEstimateByToken(token: string) {
    // Get estimate via secure RPC function
    const { data: estimateData, error: estimateError } = await supabase
      .rpc('get_estimate_by_token', { p_token: token });
    
    if (estimateError) throw estimateError;
    if (!estimateData || estimateData.length === 0) {
      throw new Error('Estimate not found');
    }
    
    const estimate = estimateData[0];
    
    // Get items via secure RPC function
    const { data: itemsData, error: itemsError } = await supabase
      .rpc('get_estimate_items_by_token', { p_token: token });
    
    if (itemsError) {
      console.error('Error fetching items:', itemsError);
    }
    
    // Format client data from the estimate
    const client = estimate.customer_name ? {
      id: null,
      name: estimate.customer_name,
      email: estimate.customer_email,
      address: estimate.service_address ? 
        `${estimate.service_address}, ${estimate.service_city}, ${estimate.service_province} ${estimate.service_postal_code}` : 
        null
    } : null;
    
    return { 
      ...estimate, 
      client,
      items: itemsData || [],
      customer: client // Add customer for backward compatibility
    };
  },

  async markViewedEstimate(token: string) {
    const { error } = await supabase.rpc("mark_estimate_viewed", { p_token: token });
    if (error) console.error("Failed to mark viewed:", error);
  },

  async acceptEstimate(token: string, signer: { 
    name?: string; 
    email?: string; 
    signature?: string;
    agreedToTerms?: boolean;
  }) {
    // Use the RPC function that requires sent_at
    const { error } = await supabase.rpc("accept_estimate", { 
      p_token: token,
      p_name: signer.name || null,
      p_email: signer.email || null
    });
    
    if (error) {
      console.error("Accept estimate error:", error);
      throw new Error(error.message || "Failed to accept estimate");
    }
    
    // Also update signature data if provided
    if (signer.signature) {
      const { error: sigError } = await supabase
        .from("estimates")
        .update({
          signature_data: signer.signature,
          signed_at: new Date().toISOString(),
          signed_by_name: signer.name || null,
          signed_by_email: signer.email || null,
        })
        .eq("public_token", token);
      
      if (sigError) throw sigError;
    }
  },

  async getInvoiceByToken(token: string) {
    // Get invoice via secure RPC function
    const { data: invoiceData, error: invoiceError } = await supabase
      .rpc('get_invoice_by_token', { p_token: token });
    
    if (invoiceError) throw invoiceError;
    if (!invoiceData || invoiceData.length === 0) {
      throw new Error('Invoice not found');
    }
    
    const invoice = invoiceData[0];
    
    // Get items via secure RPC function
    const { data: itemsData, error: itemsError } = await supabase
      .rpc('get_invoice_items_by_token', { p_token: token });
    
    if (itemsError) {
      console.error('Error fetching items:', itemsError);
    }
    
    // Get payments (still need direct access for this)
    const { data: paymentsData } = await supabase
      .from("invoice_payments")
      .select("*")
      .eq("invoice_id", invoice.id);
    
    // Format client data from the invoice
    const client = invoice.customer_name ? {
      id: null,
      name: invoice.customer_name,
      email: invoice.customer_email,
      address: invoice.customer_address ? 
        `${invoice.customer_address}, ${invoice.customer_city}, ${invoice.customer_province} ${invoice.customer_postal_code}` : 
        null
    } : null;
    
    // Transform items to expected format
    const items = itemsData ? itemsData.map((item: any) => ({
      id: item.id,
      description: item.item_name || item.description,
      quantity: item.quantity,
      unit_price: item.rate,
      tax_rate: item.tax ? 13 : 0,
      line_total: item.amount
    })) : [];
    
    return { 
      ...invoice, 
      client, 
      items,
      payments: paymentsData || []
    };
  },
};