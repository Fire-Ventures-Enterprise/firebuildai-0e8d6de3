import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });
  
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );

  try {
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();
    
    // Verify webhook signature if webhook secret is configured
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    let event;
    
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    console.log(`Processing webhook event: ${event.type}`);

    // Handle checkout.session.completed for invoice payments
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract invoice_id and payment type from metadata
      const invoice_id = session.metadata?.invoice_id;
      const payment_type = session.metadata?.payment_type;
      
      if (invoice_id) {
        // Get payment intent details
        let amount = session.amount_total;
        
        if (typeof session.payment_intent === "string") {
          const pi = await stripe.paymentIntents.retrieve(session.payment_intent);
          amount = pi.amount_received || amount;
        }

        console.log(`Recording payment for invoice ${invoice_id}: ${amount} cents (type: ${payment_type})`);

        // Use the SQL function to record payment and update invoice
        const { error } = await supabase.rpc("record_invoice_card_payment", {
          p_invoice_id: invoice_id,
          p_amount_cents: amount,
          p_provider: "stripe",
          p_reference: session.id,
        });

        if (error) {
          console.error("Error recording payment:", error);
          throw error;
        }

        console.log(`Payment recorded successfully for invoice ${invoice_id}`);

        // Check if this is a deposit payment and invoice needs scheduling
        if (payment_type === 'deposit') {
          const { data: invoice } = await supabase
            .from("invoices_enhanced")
            .select("id, deposit_amount, paid_amount")
            .eq("id", invoice_id)
            .single();

          if (invoice && invoice.deposit_amount > 0) {
            console.log(`Deposit payment received for invoice ${invoice_id}. Scheduling can now be set.`);
            // The client-side will detect this payment and prompt for scheduling
          }
        }
      }
    }

    // Handle payment_intent.succeeded for direct payment intents
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const invoice_id = paymentIntent.metadata?.invoice_id;
      
      if (invoice_id) {
        console.log(`Recording direct payment for invoice ${invoice_id}`);

        const { error } = await supabase.rpc("record_invoice_card_payment", {
          p_invoice_id: invoice_id,
          p_amount_cents: paymentIntent.amount_received,
          p_provider: "stripe",
          p_reference: paymentIntent.id,
        });

        if (error) {
          console.error("Error recording payment:", error);
          throw error;
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});