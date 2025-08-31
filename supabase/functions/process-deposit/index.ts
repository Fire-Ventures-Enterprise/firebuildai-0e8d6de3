import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-DEPOSIT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    // Parse request body
    const { estimateToken, depositAmount, customerEmail, estimateNumber } = await req.json();
    
    logStep("Request data", { estimateToken, depositAmount, customerEmail, estimateNumber });

    if (!estimateToken || !depositAmount || !customerEmail || !estimateNumber) {
      throw new Error('Missing required fields: estimate token, deposit amount, customer email, or estimate number');
    }

    // Validate estimate eligibility (must be sent and via public token)
    const { data: estimate, error: estError } = await supabaseService
      .from("estimates")
      .select("id, sent_at, status, customer_id, user_id")
      .eq("public_token", estimateToken)
      .single();

    if (estError || !estimate) {
      logStep("Estimate not found", { estimateToken, error: estError });
      throw new Error("Estimate not found or invalid token");
    }

    if (!estimate.sent_at) {
      logStep("Estimate not sent", { estimateId: estimate.id });
      throw new Error("Estimate must be sent to customer before deposit can be collected");
    }

    if (!["sent", "viewed", "accepted"].includes(estimate.status)) {
      logStep("Invalid estimate status", { status: estimate.status });
      throw new Error("Estimate is not eligible for deposit payment");
    }

    logStep("Estimate validated", { 
      estimateId: estimate.id, 
      status: estimate.status,
      sentAt: estimate.sent_at 
    });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if Stripe customer exists
    const customers = await stripe.customers.list({ 
      email: customerEmail, 
      limit: 1 
    });
    
    let stripeCustomerId;
    if (customers.data.length > 0) {
      stripeCustomerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { stripeCustomerId });
    } else {
      // Create new Stripe customer
      const newCustomer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          supabase_customer_id: estimate.customer_id,
          supabase_user_id: estimate.user_id
        }
      });
      stripeCustomerId = newCustomer.id;
      logStep("Created new Stripe customer", { stripeCustomerId });
      
      // Update customer record with Stripe ID
      if (estimate.customer_id) {
        await supabaseService.from("customers").update({
          stripe_customer_id: stripeCustomerId
        }).eq("id", estimate.customer_id);
      }
    }

    // Create payment session for deposit
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: { 
              name: `Deposit for Estimate #${estimateNumber}`,
              description: "Initial deposit payment to begin work"
            },
            unit_amount: Math.round(depositAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/portal/estimate/${estimateToken}?payment=success`,
      cancel_url: `${req.headers.get("origin")}/portal/estimate/${estimateToken}?payment=cancelled`,
      metadata: {
        estimate_id: estimate.id,
        estimate_token: estimateToken,
        customer_id: estimate.customer_id,
        user_id: estimate.user_id,
        payment_type: 'deposit'
      }
    });

    logStep("Checkout session created", { sessionId: session.id });

    // Create payment stage record for tracking
    await supabaseService.from("payment_stages").insert({
      estimate_id: estimate.id,
      stage_number: 1,
      description: "Initial Deposit",
      amount: depositAmount,
      status: "pending",
      stripe_payment_intent_id: session.id
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});