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

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { invoice_id } = await req.json();

    // Get invoice details
    const { data: invoice, error } = await supabaseClient
      .from('invoices_enhanced')
      .select('*')
      .eq('id', invoice_id)
      .single();

    if (error || !invoice) {
      return new Response(JSON.stringify({ error: 'Invoice not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404
      });
    }

    const balance = invoice.balance || (invoice.total - (invoice.paid_amount || 0));
    if (balance <= 0) {
      return new Response(JSON.stringify({ error: 'Nothing due' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'cad',
          unit_amount: Math.round(balance * 100),
          product_data: {
            name: `Invoice ${invoice.invoice_number}`,
            description: `Payment for invoice ${invoice.invoice_number}`
          }
        }
      }],
      metadata: {
        invoice_id,
        invoice_number: invoice.invoice_number
      },
      success_url: `${req.headers.get('origin')}/app/invoices/${invoice_id}?payment=success`,
      cancel_url: `${req.headers.get('origin')}/app/invoices/${invoice_id}?payment=cancelled`,
      customer_email: invoice.customer_email || undefined,
    });

    return new Response(
      JSON.stringify({ url: session.url, expires_at: session.expires_at }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});