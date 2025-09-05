import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CONNECT-ACCOUNT] ${step}${detailsStr}`);
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
    const { email, businessName, country = "CA" } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }
    
    logStep("Request parsed", { email, businessName, country });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Create a connected account
    const account = await stripe.accounts.create({
      type: "standard",
      country,
      email,
      metadata: {
        user_id: userData.user.id,
        business_name: businessName || ""
      }
    });

    logStep("Connected account created", { accountId: account.id });

    // Create account link for onboarding
    const origin = req.headers.get("origin") || "http://localhost:5173";
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${origin}/app/contractors`,
      return_url: `${origin}/app/contractors?connected=true`,
      type: "account_onboarding"
    });

    logStep("Account link created", { url: accountLink.url });

    // Store connected account in database
    const { error: insertError } = await supabase
      .from("contractor_accounts")
      .insert({
        user_id: userData.user.id,
        stripe_account_id: account.id,
        email,
        business_name: businessName,
        status: "pending",
        country
      });

    if (insertError) {
      logStep("Error storing account", insertError);
      // Continue anyway - account was created
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        accountId: account.id,
        onboardingUrl: accountLink.url
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