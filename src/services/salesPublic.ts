import { supabase } from "@/integrations/supabase/client";

export const SalesPublic = {
  // Use secure bundle RPC for estimates
  async getEstimateByToken(token: string) {
    try {
      // Get complete bundle in one secure call
      const { data, error } = await supabase.rpc('get_estimate_bundle_by_token', {
        p_token: token,
        p_user_agent: navigator.userAgent,
        p_ip: null
      });
      
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Estimate not found');
      }
      
      const bundle = data[0];
      const estimate = bundle.estimate || {};
      const items = bundle.items || [];
      
      // Format client data for backward compatibility
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
        items,
        customer: client // Backward compatibility
      };
    } catch (error) {
      console.error('Failed to fetch estimate:', error);
      throw error;
    }
  },

  async markViewedEstimate(token: string) {
    // View marking is now handled atomically in get_estimate_bundle_by_token
    // Keeping this for backward compatibility
  },

  async acceptEstimate(token: string, signer: { 
    name?: string; 
    email?: string; 
    signature?: string;
    agreedToTerms?: boolean;
  }) {
    // Use secure accept function
    const { data, error } = await supabase.rpc("accept_estimate_secure", { 
      p_token: token,
      p_name: signer.name || null,
      p_email: signer.email || null,
      p_signature: signer.signature || null,
      p_user_agent: navigator.userAgent,
      p_ip: null
    });
    
    if (error) {
      console.error("Accept estimate error:", error);
      throw new Error(error.message || "Failed to accept estimate");
    }
    
    if (!data) {
      throw new Error("Failed to accept estimate - invalid token or already accepted");
    }
  },

  async getInvoiceByToken(token: string) {
    try {
      // Get complete bundle in one secure call
      const { data, error } = await supabase.rpc('get_invoice_bundle_by_token', {
        p_token: token,
        p_user_agent: navigator.userAgent,
        p_ip: null
      });
      
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Invoice not found');
      }
      
      const bundle = data[0];
      const invoice = bundle.invoice || {};
      const items = bundle.items || [];
      const payments = bundle.payments || [];
      
      // Format client data for backward compatibility
      const client = invoice.customer_name ? {
        id: null,
        name: invoice.customer_name,
        email: invoice.customer_email,
        address: invoice.customer_address ? 
          `${invoice.customer_address}, ${invoice.customer_city}, ${invoice.customer_province} ${invoice.customer_postal_code}` : 
          null
      } : null;
      
      // Transform items to expected format
      const formattedItems = items.map((item: any) => ({
        id: item.id,
        description: item.item_name || item.description,
        quantity: item.quantity,
        unit_price: item.rate,
        tax_rate: item.tax ? 13 : 0,
        line_total: item.amount
      }));
      
      return { 
        ...invoice,
        client,
        items: formattedItems,
        payments
      };
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      throw error;
    }
  },
};