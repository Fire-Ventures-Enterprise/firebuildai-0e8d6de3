import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const type = url.searchParams.get('type');
    const redirectTo = url.searchParams.get('redirect_to') || 'https://firebuild.ai/login';

    // If this is an email confirmation
    if (type === 'email' || type === 'signup') {
      // Redirect to the app with a success message
      const successUrl = new URL(redirectTo);
      successUrl.searchParams.set('confirmed', 'true');
      
      return Response.redirect(successUrl.toString(), 302);
    }

    // For other types, just redirect
    return Response.redirect(redirectTo, 302);

  } catch (error) {
    console.error('Email confirmation error:', error);
    // Redirect to login with error
    return Response.redirect('https://firebuild.ai/login?error=confirmation_failed', 302);
  }
});