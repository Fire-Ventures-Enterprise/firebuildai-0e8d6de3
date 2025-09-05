import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

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

    // Handle checkout.session.completed for invoice payments and deposits
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract metadata
      const invoice_id = session.metadata?.invoice_id;
      const estimate_id = session.metadata?.estimate_id;
      const payment_type = session.metadata?.payment_type || 'other';
      const customer_email = session.customer_email || session.metadata?.customer_email;
      
      let effectiveInvoiceId = invoice_id;
      
      // Handle estimate deposit - convert to invoice
      if (payment_type === 'deposit' && estimate_id && !invoice_id) {
        console.log(`Converting estimate ${estimate_id} to invoice after deposit payment`);
        
        const { data: newInvoiceId, error: convError } = await supabase.rpc("convert_estimate_to_invoice", {
          p_estimate_id: estimate_id
        });
        
        if (convError) {
          console.error("Error converting estimate to invoice:", convError);
          throw convError;
        }
        
        effectiveInvoiceId = newInvoiceId;
        console.log(`Created invoice ${effectiveInvoiceId} from estimate ${estimate_id}`);
      }
      
      if (effectiveInvoiceId) {
        // Get payment amount
        let amount = session.amount_total;
        
        if (typeof session.payment_intent === "string") {
          const pi = await stripe.paymentIntents.retrieve(session.payment_intent);
          amount = pi.amount_received || amount;
        }

        console.log(`Recording ${payment_type} payment for invoice ${effectiveInvoiceId}: ${amount} cents`);

        // Use process_deposit_payment for deposits, regular function for other payments
        if (payment_type === 'deposit') {
          const { error } = await supabase.rpc("process_deposit_payment", {
            p_invoice_id: effectiveInvoiceId,
            p_amount: amount / 100,
            p_payment_ref: session.id,
          });
          
          if (error) {
            console.error("Error processing deposit payment:", error);
            throw error;
          }
          
          // Send email notifications for deposit
          if (customer_email) {
            try {
              // Send customer receipt
              await resend.emails.send({
                from: "FireBuildAI <no-reply@firebuildai.com>",
                to: [customer_email],
                subject: "Deposit received – Schedule your job",
                html: `
                  <h2>Thank you for your deposit!</h2>
                  <p>We've received your deposit payment and your invoice is ready for scheduling.</p>
                  <p>Please click the link below to schedule your job:</p>
                  <p><a href="${Deno.env.get("SUPABASE_URL")}/app/invoices/${effectiveInvoiceId}?schedule=1" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Schedule Your Job</a></p>
                  <p>If the button doesn't work, copy and paste this link:</p>
                  <p>${Deno.env.get("SUPABASE_URL")}/app/invoices/${effectiveInvoiceId}?schedule=1</p>
                  <p>Best regards,<br>FireBuildAI Team</p>
                `,
              });
              
              // Send internal notification
              const opsEmail = Deno.env.get("OPS_EMAIL") || "ops@firebuildai.com";
              await resend.emails.send({
                from: "FireBuildAI <no-reply@firebuildai.com>",
                to: [opsEmail],
                subject: "Deposit paid - Ready for scheduling",
                html: `
                  <h2>Deposit Payment Received</h2>
                  <ul>
                    <li>Invoice: ${effectiveInvoiceId}</li>
                    <li>Amount: $${(amount / 100).toFixed(2)}</li>
                    <li>Customer: ${customer_email}</li>
                    ${estimate_id ? `<li>Original Estimate: ${estimate_id}</li>` : ''}
                  </ul>
                  <p><a href="${Deno.env.get("SUPABASE_URL")}/app/invoices/${effectiveInvoiceId}">View Invoice</a></p>
                `,
              });
            } catch (emailError) {
              console.error("Error sending emails:", emailError);
              // Don't throw - payment was successful even if email fails
            }
          }
        } else {
          // Regular payment (not deposit)
          const { error } = await supabase.rpc("record_invoice_card_payment", {
            p_invoice_id: effectiveInvoiceId,
            p_amount_cents: amount,
            p_provider: "stripe",
            p_reference: session.id,
          });
          
          if (error) {
            console.error("Error recording payment:", error);
            throw error;
          }
        }

        console.log(`Payment recorded successfully for invoice ${effectiveInvoiceId}`);
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