import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-INVOICE-PAYMENT] ${step}${detailsStr}`);
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

    // Parse request body
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Missing session ID");
    }
    
    logStep("Request parsed", { sessionId });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Retrieve checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Retrieved Stripe session", { 
      status: session.payment_status,
      invoiceId: session.metadata?.invoiceId 
    });

    // Update payment record based on Stripe session status
    const paymentStatus = session.payment_status === 'paid' ? 'completed' : 
                         session.payment_status === 'unpaid' ? 'failed' : 'pending';

    const { data: payment, error: updateError } = await supabase
      .from("invoice_payments")
      .update({
        status: paymentStatus,
        stripe_payment_intent_id: session.payment_intent as string,
        processed_at: paymentStatus === 'completed' ? new Date().toISOString() : null,
        metadata: {
          customerEmail: session.customer_email,
          invoiceNumber: session.metadata?.invoiceNumber,
          stripeCustomerId: session.customer,
          amountReceived: session.amount_total ? session.amount_total / 100 : 0
        }
      })
      .eq("stripe_session_id", sessionId)
      .select()
      .single();
    
    if (updateError) {
      logStep("Error updating payment", updateError);
      throw new Error("Failed to update payment record");
    }
    
    logStep("Payment updated successfully", { paymentStatus });

    // If payment is completed, the trigger will automatically update invoice balance

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: paymentStatus,
        payment 
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