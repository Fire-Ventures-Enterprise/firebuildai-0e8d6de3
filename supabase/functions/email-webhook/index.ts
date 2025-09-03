import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import * as crypto from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Verify webhook signature (for Resend)
async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  
  const signatureBytes = encoder.encode(signature);
  const dataBytes = encoder.encode(payload);
  
  return await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    dataBytes
  );
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const webhookSecret = Deno.env.get("WEBHOOK_SECRET_EMAIL");
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const payload = await req.text();
    const signature = req.headers.get("webhook-signature") || 
                     req.headers.get("x-webhook-signature") ||
                     req.headers.get("x-resend-signature");

    // Verify signature if secret is configured
    if (webhookSecret && signature) {
      const isValid = await verifyWebhookSignature(payload, signature, webhookSecret);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response("Unauthorized", { status: 401 });
      }
    }

    const data = JSON.parse(payload);
    console.log("Webhook received:", data.type || data.event);

    // Normalize webhook data based on provider
    let event: string;
    let messageId: string;
    let email: string;
    let subject: string | null = null;
    let metadata: any = data;

    // Handle Resend webhook format
    if (data.type) {
      event = data.type;
      messageId = data.data?.email_id || data.data?.message_id;
      email = data.data?.to?.[0] || data.data?.email;
      subject = data.data?.subject;
      
      // Map Resend events to our standard events
      switch (event) {
        case "email.sent":
          event = "sent";
          break;
        case "email.delivered":
          event = "delivered";
          break;
        case "email.opened":
          event = "opened";
          break;
        case "email.clicked":
          event = "clicked";
          break;
        case "email.bounced":
          event = "bounced";
          break;
        case "email.complained":
          event = "complaint";
          break;
      }
    } else {
      // Generic format
      event = data.event;
      messageId = data.message_id || data.provider_id;
      email = data.to || data.email;
      subject = data.subject;
    }

    // Store event
    const { error: eventError } = await supabase
      .from("email_events")
      .insert({
        provider_id: messageId,
        event,
        to_email: email,
        subject,
        meta: metadata
      });

    if (eventError) {
      console.error("Failed to store event:", eventError);
    }

    // Update outbox status based on event
    if (messageId) {
      let newStatus: string | null = null;
      let errorMessage: string | null = null;

      switch (event) {
        case "sent":
        case "delivered":
          newStatus = "sent";
          break;
        case "bounced":
          newStatus = "bounced";
          errorMessage = data.data?.bounce_reason || "Email bounced";
          
          // Process bounce (add to suppression for hard bounces)
          if (email) {
            await supabase.rpc("process_email_bounce", {
              p_provider_id: messageId,
              p_email: email,
              p_reason: errorMessage
            });
          }
          break;
        case "complaint":
          newStatus = "bounced";
          errorMessage = "Spam complaint received";
          
          // Add to suppression list
          if (email) {
            await supabase
              .from("email_suppressions")
              .insert({
                email,
                reason: "complaint",
                meta: { provider_id: messageId }
              })
              .onConflict("email")
              .ignore();
          }
          break;
      }

      if (newStatus) {
        const updateData: any = {
          status: newStatus,
          updated_at: new Date().toISOString()
        };
        
        if (errorMessage) {
          updateData.error = errorMessage;
        }

        await supabase
          .from("email_outbox")
          .update(updateData)
          .eq("provider_id", messageId);
      }
    }

    // Log certain events for monitoring
    if (["bounced", "complaint"].includes(event)) {
      console.warn(`Email ${event} for ${email}:`, metadata);
    }

    return new Response("OK", { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error: any) {
    console.error("Error in email-webhook function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});