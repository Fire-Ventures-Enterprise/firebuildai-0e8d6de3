import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });
  
  const endpointSecret = Deno.env.get("STRIPE_PO_WEBHOOK_SECRET");
  
  // Use service role key for database writes
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!sig || !endpointSecret) {
    console.error('Missing signature or webhook secret');
    return new Response('Webhook Error: Missing signature or secret', { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const po_id = pi.metadata?.po_id;
    const user_id = pi.metadata?.user_id;
    
    if (po_id && user_id) {
      const amount = (pi.amount_received ?? pi.amount) / 100;
      
      try {
        // Record the payment
        const { data: po } = await supabase
          .from('purchase_orders')
          .select('total, paid_amount')
          .eq('id', po_id)
          .single();
          
        if (po) {
          const newPaidAmount = (po.paid_amount || 0) + amount;
          const paymentStatus = newPaidAmount >= po.total ? 'paid' : 'partial';
          
          // Update PO with payment
          await supabase
            .from('purchase_orders')
            .update({ 
              paid_amount: newPaidAmount,
              payment_status: paymentStatus,
              payment_method: 'card',
              updated_at: new Date().toISOString()
            })
            .eq('id', po_id);
            
          console.log(`Payment recorded for PO ${po_id}: $${amount}`);
        }
      } catch (error) {
        console.error('Error recording payment:', error);
        // Don't fail the webhook - payment was successful even if recording failed
      }
    }
  }

  return new Response('OK', { status: 200 });
});