import { supabase } from '@/integrations/supabase/client';

// SEO Health Check endpoint for crawlers
export async function GET(request: Request) {
  // Allow all origins for SEO tools
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'X-Robots-Tag': 'index, follow',
  });

  // Return basic site info for crawlers
  const siteInfo = {
    status: 'ok',
    site: 'FireBuild.AI',
    description: 'AI-powered construction management platform',
    features: [
      'LiDAR Scanning',
      'Smart Estimates',
      'Automated Workflows',
      'Invoice Management',
      'Work Orders',
      'Purchase Orders',
      'Crew Management',
      'Job Scheduling'
    ],
    contact: {
      email: 'info@firebuild.ai',
      support: 'support@firebuild.ai'
    },
    api_version: '1.0',
    timestamp: new Date().toISOString()
  };

  return new Response(JSON.stringify(siteInfo, null, 2), {
    status: 200,
    headers
  });
}