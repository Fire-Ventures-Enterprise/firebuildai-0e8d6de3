import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { renderEmail } from "./render.tsx";
import { sendWithRetry, validateEmail, normalizeEmail } from "./transport.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseService = createClient(supabaseUrl, serviceKey);

  try {
    // Get auth header for user context
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseService.auth.getUser(token);
      userId = user?.id || null;
    }

    const { 
      template, 
      ref_id, 
      to, 
      cc = [], 
      bcc = [], 
      subject, 
      payload,
      skipQueue = false // Option to send immediately without queuing
    } = await req.json();

    // Validate required fields
    if (!template || !to || !subject || !payload) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: template, to, subject, payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email addresses
    const toEmails = normalizeEmail(to);
    if (toEmails.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check suppression list
    const { data: suppressed } = await supabaseService.rpc("is_email_suppressed", {
      p_email: toEmails[0]
    });

    if (suppressed) {
      console.log(`Email suppressed: ${toEmails[0]}`);
      // Still create outbox entry but mark as suppressed
      const { data: outbox } = await supabaseService
        .from("email_outbox")
        .insert({
          template,
          ref_id,
          user_id: userId,
          to_email: toEmails[0],
          cc,
          bcc,
          subject,
          payload,
          status: "suppressed",
          error: "Email address is suppressed"
        })
        .select()
        .single();

      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: "Email address is suppressed",
          id: outbox?.id 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check rate limit
    const { data: canSend } = await supabaseService.rpc("check_email_rate_limit", {
      p_email: toEmails[0],
      p_limit: 10,
      p_window_minutes: 60
    });

    if (!canSend) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create outbox entry
    const { data: outbox, error: outboxError } = await supabaseService
      .from("email_outbox")
      .insert({
        template,
        ref_id,
        user_id: userId,
        to_email: toEmails[0],
        cc: cc.length > 0 ? normalizeEmail(cc) : null,
        bcc: bcc.length > 0 ? normalizeEmail(bcc) : null,
        subject,
        payload,
        status: skipQueue ? "sending" : "queued"
      })
      .select()
      .single();

    if (outboxError) {
      console.error("Failed to create outbox entry:", outboxError);
      throw new Error("Failed to queue email");
    }

    // If skipQueue is true or we're in immediate send mode, send now
    if (skipQueue || template === "receipt") {
      try {
        // Render email
        const { html, text } = await renderEmail(template, payload);

        // Send email with retry
        const result = await sendWithRetry({
          to: toEmails,
          cc: cc.length > 0 ? normalizeEmail(cc) : undefined,
          bcc: bcc.length > 0 ? normalizeEmail(bcc) : undefined,
          subject,
          html,
          text,
          headers: {
            'X-Outbox-ID': outbox.id,
            'X-Template': template,
            'X-Ref-ID': ref_id || ''
          }
        });

        // Update outbox with success
        await supabaseService
          .from("email_outbox")
          .update({
            status: "sent",
            provider_id: result.id,
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("id", outbox.id);

        console.log(`Email sent successfully: ${outbox.id} via ${result.provider}`);

        return new Response(
          JSON.stringify({ 
            ok: true, 
            id: outbox.id,
            provider_id: result.id,
            status: "sent"
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (sendError: any) {
        console.error("Failed to send email:", sendError);
        
        // Update outbox with failure
        await supabaseService
          .from("email_outbox")
          .update({
            status: "failed",
            error: sendError.message,
            retry_count: 1,
            next_retry_at: new Date(Date.now() + 30000).toISOString(), // Retry in 30s
            updated_at: new Date().toISOString()
          })
          .eq("id", outbox.id);

        return new Response(
          JSON.stringify({ 
            ok: false, 
            error: "Failed to send email",
            id: outbox.id,
            details: sendError.message
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Return queued status
    return new Response(
      JSON.stringify({ 
        ok: true, 
        id: outbox.id,
        status: "queued",
        message: "Email queued for sending"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: error.message || "Internal server error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});