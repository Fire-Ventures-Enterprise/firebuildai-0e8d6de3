import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  
  // Handle errors from Google
  if (error) {
    console.error('OAuth error:', error);
    return Response.redirect(`${Deno.env.get('APP_URL') || 'https://app.firebuildai.com'}/app/company?error=${error}`);
  }

  if (!code || !state) {
    return Response.redirect(`${Deno.env.get('APP_URL') || 'https://app.firebuildai.com'}/app/company?error=missing_params`);
  }

  try {
    // Decode and verify state
    const stateData = JSON.parse(atob(state));
    const { userId } = stateData;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: Deno.env.get('GOOGLE_CLIENT_ID')!,
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
        redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-oauth-callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return Response.redirect(`${Deno.env.get('APP_URL') || 'https://app.firebuildai.com'}/app/company?error=token_exchange_failed`);
    }

    const tokens = await tokenResponse.json();
    console.log('Received tokens');

    // Get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${tokens.access_token}` },
    });

    const userInfo = await userInfoResponse.json();
    console.log('User info:', userInfo.email);

    // Initialize Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store or update Google account
    const { error: accountError } = await supabaseAdmin
      .from('google_accounts')
      .upsert({
        user_id: userId,
        email: userInfo.email,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: new Date(Date.now() + (tokens.expires_in * 1000)).toISOString(),
        scope: tokens.scope?.split(' ') || [],
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (accountError) {
      console.error('Failed to store Google account:', accountError);
      return Response.redirect(`${Deno.env.get('APP_URL') || 'https://app.firebuildai.com'}/app/company?error=storage_failed`);
    }

    // Get calendar list
    const calendarListResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: { 'Authorization': `Bearer ${tokens.access_token}` },
    });

    if (calendarListResponse.ok) {
      const calendarList = await calendarListResponse.json();
      
      // Get the account ID we just created/updated
      const { data: accountData } = await supabaseAdmin
        .from('google_accounts')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (accountData) {
        // Store calendars
        for (const calendar of calendarList.items || []) {
          await supabaseAdmin
            .from('google_calendars')
            .upsert({
              account_id: accountData.id,
              calendar_id: calendar.id,
              summary: calendar.summary,
              is_primary: calendar.primary || false,
              is_selected: calendar.primary || false, // Auto-select primary calendar
            }, {
              onConflict: 'account_id,calendar_id'
            });
        }
      }
    }

    // Redirect back to settings page with success
    return Response.redirect(`${Deno.env.get('APP_URL') || 'https://app.firebuildai.com'}/app/company?google_connected=true`);
    
  } catch (error) {
    console.error('Error in google-oauth-callback:', error);
    return Response.redirect(`${Deno.env.get('APP_URL') || 'https://app.firebuildai.com'}/app/company?error=unexpected`);
  }
});