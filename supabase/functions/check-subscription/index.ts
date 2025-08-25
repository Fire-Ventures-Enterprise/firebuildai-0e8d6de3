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
      
      // Get or create subscriber record
      const { data: existingSubscriber } = await supabaseClient
        .from("subscribers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      const subscriberData = {
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_tier: null,
        subscription_type: null,
        subscription_end: null,
        status: 'inactive',
        company_count: 0,
        updated_at: new Date().toISOString(),
      };

      if (existingSubscriber) {
        await supabaseClient.from("subscribers").update(subscriberData).eq("id", existingSubscriber.id);
      } else {
        await supabaseClient.from("subscribers").insert(subscriberData);
      }

      return new Response(JSON.stringify({ subscribed: false, status: 'inactive' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Get all subscriptions (including canceled ones)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
    });

    // Find the most recent active or trialing subscription
    const activeSubscription = subscriptions.data.find(
      sub => sub.status === 'active' || sub.status === 'trialing'
    );

    let subscriptionData = {
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscribed: false,
      subscription_tier: null,
      subscription_type: null,
      subscription_end: null,
      stripe_subscription_id: null,
      current_period_start: null,
      current_period_end: null,
      cancel_at_period_end: false,
      canceled_at: null,
      trial_start: null,
      trial_end: null,
      status: 'inactive',
      company_count: 0,
      updated_at: new Date().toISOString(),
    };

    if (activeSubscription) {
      // Determine subscription type and tier from the subscription items
      let subscriptionType = 'standalone';
      let subscriptionTier = null;
      let companyCount = 0;

      for (const item of activeSubscription.items.data) {
        const price = item.price;
        const amount = price.unit_amount || 0;
        
        // Check if it's white label (base price $499)
        if (amount === 49900) {
          subscriptionType = 'whitelabel';
        } 
        // Check for additional companies in white label
        else if (amount === 5900) {
          companyCount = item.quantity || 0;
        }
        // Standalone tiers with correct pricing
        else if (amount === 4900) {
          subscriptionTier = 'tier1';
        } else if (amount === 9900) {
          subscriptionTier = 'tier2';
        } else if (amount === 24900) {
          subscriptionTier = 'tier3';
        }
      }

      subscriptionData = {
        ...subscriptionData,
        subscribed: true,
        subscription_tier: subscriptionTier,
        subscription_type: subscriptionType,
        subscription_end: new Date(activeSubscription.current_period_end * 1000).toISOString(),
        stripe_subscription_id: activeSubscription.id,
        current_period_start: new Date(activeSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(activeSubscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: activeSubscription.cancel_at_period_end || false,
        canceled_at: activeSubscription.canceled_at ? new Date(activeSubscription.canceled_at * 1000).toISOString() : null,
        trial_start: activeSubscription.trial_start ? new Date(activeSubscription.trial_start * 1000).toISOString() : null,
        trial_end: activeSubscription.trial_end ? new Date(activeSubscription.trial_end * 1000).toISOString() : null,
        status: activeSubscription.status,
        company_count: companyCount,
      };

      logStep("Active subscription found", { 
        subscriptionId: activeSubscription.id, 
        status: activeSubscription.status,
        type: subscriptionType,
        tier: subscriptionTier 
      });

      // Fetch recent payments/invoices
      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit: 10,
      });

      // Get or create subscriber record first
      const { data: existingSubscriber } = await supabaseClient
        .from("subscribers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      const { data: subscriber } = existingSubscriber
        ? await supabaseClient.from("subscribers").update(subscriptionData).eq("id", existingSubscriber.id).select().single()
        : await supabaseClient.from("subscribers").insert(subscriptionData).select().single();

      if (subscriber && invoices.data.length > 0) {
        // Store payment history for paid invoices
        const paymentRecords = invoices.data
          .filter(inv => inv.status === 'paid' && inv.amount_paid > 0)
          .map(inv => ({
            subscriber_id: subscriber.id,
            stripe_invoice_id: inv.id,
            stripe_payment_intent_id: inv.payment_intent as string,
            amount: inv.amount_paid,
            currency: inv.currency,
            status: 'succeeded',
            payment_date: new Date(inv.status_transitions?.paid_at ? inv.status_transitions.paid_at * 1000 : Date.now()).toISOString(),
            description: inv.description || `Payment for ${subscriptionType === 'whitelabel' ? 'White Label' : `Tier ${subscriptionTier?.replace('tier', '')}`} subscription`,
          }));

        if (paymentRecords.length > 0) {
          // Check which payments already exist
          const { data: existingPayments } = await supabaseClient
            .from("payment_history")
            .select("stripe_invoice_id")
            .in("stripe_invoice_id", paymentRecords.map(p => p.stripe_invoice_id));

          const existingInvoiceIds = new Set(existingPayments?.map(p => p.stripe_invoice_id) || []);
          const newPayments = paymentRecords.filter(p => p.stripe_invoice_id && !existingInvoiceIds.has(p.stripe_invoice_id));

          if (newPayments.length > 0) {
            await supabaseClient.from("payment_history").insert(newPayments);
            logStep("Payment history updated", { newPayments: newPayments.length });
          }
        }
      }
    } else {
      // No active subscription but customer exists
      logStep("No active subscription found for customer");
      
      const { data: existingSubscriber } = await supabaseClient
        .from("subscribers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingSubscriber) {
        await supabaseClient.from("subscribers").update(subscriptionData).eq("id", existingSubscriber.id);
      } else {
        await supabaseClient.from("subscribers").insert(subscriptionData);
      }
    }

    // Update profile subscription status
    await supabaseClient
      .from("profiles")
      .update({
        is_subscribed: subscriptionData.subscribed,
        subscription_status: subscriptionData.status === 'active' ? 'active' : 
                           subscriptionData.status === 'trialing' ? 'trial' : 
                           'expired',
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    logStep("Updated database with subscription info", { 
      subscribed: subscriptionData.subscribed, 
      status: subscriptionData.status 
    });

    return new Response(JSON.stringify({
      subscribed: subscriptionData.subscribed,
      subscription_tier: subscriptionData.subscription_tier,
      subscription_type: subscriptionData.subscription_type,
      subscription_end: subscriptionData.subscription_end,
      status: subscriptionData.status,
      company_count: subscriptionData.company_count,
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