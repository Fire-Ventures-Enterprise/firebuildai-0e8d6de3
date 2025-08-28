import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-INVOICE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Supabase clients
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Client for auth verification
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    
    // Service role client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Authentication failed");
    }
    
    logStep("User authenticated", { userId: user.id });

    // Parse request body
    const { invoiceId, amount, customerEmail, invoiceNumber } = await req.json();
    
    if (!invoiceId || !amount || !customerEmail || !invoiceNumber) {
      throw new Error("Missing required fields");
    }
    
    logStep("Request parsed", { invoiceId, amount, customerEmail, invoiceNumber });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ 
      email: customerEmail, 
      limit: 1 
    });
    
    let customerId: string;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { customerId });
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          invoiceId,
          invoiceNumber
        }
      });
      customerId = customer.id;
      logStep("Created new Stripe customer", { customerId });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Invoice Payment - ${invoiceNumber}`,
              description: `Payment for invoice ${invoiceNumber}`
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/app/invoices?payment=success&invoice=${invoiceId}`,
      cancel_url: `${req.headers.get("origin")}/app/invoices?payment=cancelled`,
      metadata: {
        invoiceId,
        invoiceNumber,
        userId: user.id
      }
    });
    
    logStep("Checkout session created", { sessionId: session.id });

    // Record pending payment in database
    const { error: paymentError } = await supabase
      .from("invoice_payments")
      .insert({
        invoice_id: invoiceId,
        amount: amount,
        payment_method: "stripe",
        stripe_session_id: session.id,
        status: "pending",
        metadata: {
          customerEmail,
          invoiceNumber
        }
      });
    
    if (paymentError) {
      logStep("Error recording payment", paymentError);
      throw new Error("Failed to record payment");
    }
    
    logStep("Payment recorded successfully");

    return new Response(
      JSON.stringify({ url: session.url }),
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