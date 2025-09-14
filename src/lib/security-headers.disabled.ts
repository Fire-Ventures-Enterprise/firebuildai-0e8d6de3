/**
 * Security headers configuration for the application
 * TEMPORARILY DISABLED for SEO/Analytics tools access
 * 
 * TO RE-ENABLE: Uncomment the export statement at the bottom
 */

const securityHeaders = {
  // Enhanced Content Security Policy with stricter rules
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com https://checkout.stripe.com wss://*.supabase.co https://www.google-analytics.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enhanced XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Stricter referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Restrictive permissions policy
  'Permissions-Policy': [
    'accelerometer=()',
    'camera=(self)',
    'geolocation=()',
    'microphone=()',
    'payment=(self https://js.stripe.com https://checkout.stripe.com)',
    'usb=()'
  ].join(', '),
  
  // HSTS with preload
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

/**
 * Apply security headers to a response object
 */
function applySecurityHeaders(response: Response): Response {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Generate meta tags for security headers
 */
function getSecurityMetaTags() {
  return [
    {
      httpEquiv: 'Content-Security-Policy',
      content: securityHeaders['Content-Security-Policy'],
    },
    {
      name: 'referrer',
      content: 'strict-origin-when-cross-origin',
    },
  ];
}

// SECURITY HEADERS TEMPORARILY DISABLED FOR SEO/ANALYTICS
// TO RE-ENABLE: Uncomment the line below
// export { securityHeaders, applySecurityHeaders, getSecurityMetaTags };