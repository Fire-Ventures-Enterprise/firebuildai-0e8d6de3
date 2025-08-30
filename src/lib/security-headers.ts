/**
 * Security headers configuration for the application
 * These should be set at the server/CDN level in production
 */

export const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com wss://*.supabase.co",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS filter
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=(self https://js.stripe.com)',
  ].join(', '),
  
  // HSTS (only in production)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

/**
 * Apply security headers to a response object
 * @param response - The response object to apply headers to
 */
export function applySecurityHeaders(response: Response): Response {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Generate meta tags for security headers that can't be set via HTTP headers
 * @returns Array of meta tag objects
 */
export function getSecurityMetaTags() {
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