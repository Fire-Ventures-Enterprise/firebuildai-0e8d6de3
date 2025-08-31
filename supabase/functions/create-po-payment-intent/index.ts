import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );

  try {
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { po_id, amount_cents, currency = "usd" } = await req.json();
    
    // Validate PO ownership and get details
    const { data: po, error: poError } = await supabaseClient
      .from('purchase_orders')
      .select('*, vendor:vendors(name, email)')
      .eq('id', po_id)
      .eq('user_id', user.id)
      .single();
      
    if (poError || !po) {
      throw new Error('Purchase order not found or access denied');
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const pi = await stripe.paymentIntents.create({
      amount: amount_cents,
      currency,
      metadata: { 
        po_id,
        po_number: po.po_number,
        user_id: user.id,
        vendor_name: po.vendor?.name || 'Unknown'
      },
      description: `Payment for PO #${po.po_number}`,
      automatic_payment_methods: { enabled: true },
    });

    return new Response(
      JSON.stringify({ clientSecret: pi.client_secret }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});