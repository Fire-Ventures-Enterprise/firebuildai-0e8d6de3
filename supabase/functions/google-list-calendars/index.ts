import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Check if user has a Google account connected
    const { data: googleAccount, error: accountError } = await supabaseClient
      .from('google_accounts')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (accountError || !googleAccount) {
      return new Response(
        JSON.stringify({ connected: false, calendars: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get calendars for this account
    const { data: calendars, error: calendarsError } = await supabaseClient
      .from('google_calendars')
      .select('*')
      .eq('account_id', googleAccount.id)
      .order('is_primary', { ascending: false });

    if (calendarsError) {
      console.error('Error fetching calendars:', calendarsError);
      return new Response(
        JSON.stringify({ connected: true, calendars: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        connected: true, 
        account: {
          email: googleAccount.email,
          id: googleAccount.id
        },
        calendars: calendars || [] 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in google-list-calendars:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});