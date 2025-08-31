import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Frontend landing route that opens the app or falls back to store/portal
const LANDING_BASE = Deno.env.get("MOBILE_PAIR_LANDING_BASE") || "https://app.firebuildai.com/get/mobile";
const APP_REDIRECT_URL = Deno.env.get("APP_REDIRECT_URL") || "https://app.firebuildai.com";

function generateToken(length = 8): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length }, 
    () => alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join("");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { 
        status: 405,
        headers: corsHeaders 
      });
    }

    // Get current user from Authorization header
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    
    if (!token) {
      return new Response("Unauthorized", { 
        status: 401,
        headers: corsHeaders 
      });
    }

    // Create admin client
    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify the JWT and get user info
    const { data: { user }, error: userError } = await adminClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response("Unauthorized", { 
        status: 401,
        headers: corsHeaders 
      });
    }

    const email = user.email!;
    const userId = user.id;

    console.log("Generating pairing link for user:", email);

    // Generate a magic link for this user
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { 
        redirectTo: APP_REDIRECT_URL 
      }
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error("Link generation error:", linkError);
      return new Response(
        JSON.stringify({ error: linkError?.message ?? "Failed to generate link" }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const actionLink = linkData.properties.action_link as string;
    const pairingToken = generateToken(8);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    // Store pairing info
    const { error: insertError } = await adminClient
      .from("device_pairings")
      .insert({
        user_id: userId,
        email,
        pairing_token: pairingToken,
        action_link: actionLink,
        expires_at: expiresAt.toISOString(),
        device_meta: { 
          ip: req.headers.get("x-forwarded-for") ?? null,
          userAgent: req.headers.get("user-agent") ?? null
        }
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: insertError.message }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Build landing URL with encoded action link
    const pairUrl = `${LANDING_BASE}?al=${encodeURIComponent(actionLink)}&pt=${pairingToken}`;

    console.log("Pairing link created successfully");

    return new Response(
      JSON.stringify({ 
        pairUrl, 
        token: pairingToken, 
        expiresAt: expiresAt.toISOString() 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});