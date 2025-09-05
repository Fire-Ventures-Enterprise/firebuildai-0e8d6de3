import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CONTRACTOR-PAYOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Get auth user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Unauthorized");
    }

    // Parse request body
    const { invoiceId, connectedAccountId, amount, description } = await req.json();
    
    if (!invoiceId || !connectedAccountId || !amount) {
      throw new Error("Missing required fields");
    }
    
    logStep("Request parsed", { invoiceId, connectedAccountId, amount });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Create a transfer to the connected account
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "cad",
      destination: connectedAccountId,
      description: description || `Payment for invoice ${invoiceId}`,
      metadata: {
        invoice_id: invoiceId,
        user_id: userData.user.id
      }
    });

    logStep("Transfer created", { transferId: transfer.id, amount: transfer.amount });

    // Record the payout in database
    const { error: insertError } = await supabase
      .from("contractor_payouts")
      .insert({
        invoice_id: invoiceId,
        connected_account_id: connectedAccountId,
        stripe_transfer_id: transfer.id,
        amount: amount,
        status: "completed",
        user_id: userData.user.id
      });

    if (insertError) {
      logStep("Error recording payout", insertError);
      // Continue anyway - transfer was successful
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        transferId: transfer.id,
        amount: transfer.amount / 100
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    logStep("Error in function", { message: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});