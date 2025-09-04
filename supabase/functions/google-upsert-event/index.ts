import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: Deno.env.get('GOOGLE_CLIENT_ID')!,
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      console.error('Failed to refresh token');
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event_id } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the event
    const { data: event, error: eventError } = await supabaseClient
      .from('calendar_events')
      .select('*')
      .eq('id', event_id)
      .eq('user_id', user.id)
      .single();

    if (eventError || !event) {
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get attendees
    const { data: attendees } = await supabaseClient
      .from('calendar_event_attendees')
      .select('*')
      .eq('event_id', event_id);

    // Get Google account
    const { data: googleAccount, error: accountError } = await supabaseClient
      .from('google_accounts')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (accountError || !googleAccount) {
      return new Response(
        JSON.stringify({ connected: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get selected calendar
    const { data: selectedCalendar } = await supabaseClient
      .from('google_calendars')
      .select('*')
      .eq('account_id', googleAccount.id)
      .eq('is_selected', true)
      .single();

    const calendarId = selectedCalendar?.calendar_id || 'primary';

    // Check if token needs refresh
    let accessToken = googleAccount.access_token;
    if (!googleAccount.token_expiry || new Date(googleAccount.token_expiry) <= new Date()) {
      console.log('Token expired, refreshing...');
      accessToken = await refreshAccessToken(googleAccount.refresh_token);
      
      if (!accessToken) {
        return new Response(
          JSON.stringify({ error: 'Failed to refresh token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update the stored token
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      await supabaseAdmin
        .from('google_accounts')
        .update({
          access_token: accessToken,
          token_expiry: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour
          updated_at: new Date().toISOString(),
        })
        .eq('id', googleAccount.id);
    }

    // Build event payload
    const googleEvent = {
      summary: event.title,
      description: `Internal link: ${Deno.env.get('APP_URL') || 'https://app.firebuildai.com'}/app/${event.source}s/${event.source_id}`,
      location: event.location || '',
      start: {
        dateTime: new Date(event.starts_at).toISOString(),
        timeZone: 'America/Toronto',
      },
      end: {
        dateTime: new Date(event.ends_at).toISOString(),
        timeZone: 'America/Toronto',
      },
      attendees: attendees?.map(a => ({
        email: a.email,
        displayName: a.name,
        responseStatus: a.response_status || 'needsAction',
      })) || [],
      sendUpdates: 'all',
    };

    let googleResponse;
    if (event.external_event_id) {
      // Update existing event
      googleResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${event.external_event_id}?sendUpdates=all`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(googleEvent),
        }
      );
    } else {
      // Create new event
      googleResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?sendUpdates=all`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(googleEvent),
        }
      );
    }

    if (!googleResponse.ok) {
      const errorData = await googleResponse.text();
      console.error('Google Calendar API error:', errorData);
      
      // Update sync state
      await supabaseClient
        .from('calendar_events')
        .update({
          sync_state: 'error',
          sync_error: errorData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', event_id);

      return new Response(
        JSON.stringify({ error: 'Failed to sync with Google Calendar', details: errorData }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const googleEventData = await googleResponse.json();
    
    // Update event with Google details
    await supabaseClient
      .from('calendar_events')
      .update({
        external_provider: 'google',
        external_calendar_id: calendarId,
        external_event_id: googleEventData.id,
        sync_state: 'synced',
        sync_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', event_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        googleEventId: googleEventData.id,
        htmlLink: googleEventData.htmlLink 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in google-upsert-event:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});