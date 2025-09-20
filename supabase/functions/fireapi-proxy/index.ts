import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FIREAPI_KEY = Deno.env.get('FIREAPI_KEY');
const FIREAPI_BASE = 'https://fireapi.dev/api/v1';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the endpoint and body from the request
    const { endpoint, method = 'POST', body } = await req.json();
    
    if (!FIREAPI_KEY) {
      throw new Error('FireAPI key not configured');
    }

    console.log(`FireAPI proxy request to: ${endpoint}`);
    
    // Make the request to FireAPI
    const response = await fetch(`${FIREAPI_BASE}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${FIREAPI_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'FireBuild.AI/1.0'
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('FireAPI error:', data);
      throw new Error(data.error?.message || 'FireAPI request failed');
    }

    console.log('FireAPI response success');
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fireapi-proxy function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: { message: error.message } 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});