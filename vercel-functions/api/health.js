export default function handler(req, res) {
  // Set CORS headers for SEO tools
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Return health check
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'FireBuild.ai'
  });
}