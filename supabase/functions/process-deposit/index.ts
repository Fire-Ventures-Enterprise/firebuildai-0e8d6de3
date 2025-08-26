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

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { 
      estimateId, 
      customerId,
      depositAmount,
      customerEmail,
      estimateNumber 
    } = await req.json();
    
    logStep("Request data", { estimateId, depositAmount, estimateNumber });

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
          supabase_customer_id: customerId,
          supabase_user_id: user.id
        }
      });
      stripeCustomerId = newCustomer.id;
      logStep("Created new Stripe customer", { stripeCustomerId });
      
      // Update customer record with Stripe ID
      await supabaseService.from("customers").update({
        stripe_customer_id: stripeCustomerId
      }).eq("id", customerId);
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
      success_url: `${req.headers.get("origin")}/app/estimates?payment=success&estimate=${estimateId}`,
      cancel_url: `${req.headers.get("origin")}/app/estimates?payment=cancelled`,
      metadata: {
        estimate_id: estimateId,
        customer_id: customerId,
        user_id: user.id,
        payment_type: 'deposit'
      }
    });

    logStep("Checkout session created", { sessionId: session.id });

    // Create payment stage record for tracking
    await supabaseService.from("payment_stages").insert({
      estimate_id: estimateId,
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
      status: 500,
    });
  }
});