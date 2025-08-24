import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_type: null,
        subscription_tier: null,
        subscription_end: null,
        company_count: 0,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionType = null;
    let subscriptionTier = null;
    let subscriptionEnd = null;
    let companyCount = 0;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      
      // Analyze subscription items to determine type and tier
      const items = subscription.items.data;
      let totalAmount = 0;
      let hasWhiteLabelBase = false;
      let additionalCompanies = 0;

      for (const item of items) {
        const price = item.price;
        const amount = price.unit_amount || 0;
        const quantity = item.quantity || 1;
        
        logStep("Analyzing item", { 
          amount, 
          quantity, 
          productId: price.product,
          nickname: price.nickname 
        });

        // Check if this is white label base ($499)
        if (amount === 49900) {
          hasWhiteLabelBase = true;
          subscriptionType = 'whitelabel';
        }
        // Check if this is additional companies ($59 each)
        else if (amount === 5900) {
          additionalCompanies = quantity;
        }
        // Otherwise, it's a standalone tier
        else {
          subscriptionType = 'standalone';
          if (amount === 3900) {
            subscriptionTier = 'tier1';
          } else if (amount === 6900) {
            subscriptionTier = 'tier2';
          } else if (amount === 9900) {
            subscriptionTier = 'tier3';
          }
        }
        
        totalAmount += amount * quantity;
      }

      if (hasWhiteLabelBase) {
        companyCount = additionalCompanies;
      }

      logStep("Determined subscription details", { 
        subscriptionType, 
        subscriptionTier, 
        companyCount,
        totalAmount 
      });
    } else {
      logStep("No active subscription found");
    }

    await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscribed: hasActiveSub,
      subscription_type: subscriptionType,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      company_count: companyCount,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("Updated database with subscription info", { 
      subscribed: hasActiveSub, 
      subscriptionType,
      subscriptionTier,
      companyCount 
    });

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_type: subscriptionType,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      company_count: companyCount
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
