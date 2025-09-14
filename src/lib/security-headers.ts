/**
 * Security headers configuration for the application
 * These should be set at the server/CDN level in production
 */

export const securityHeaders = {
  // SEO-friendly Content Security Policy - allows crawlers while maintaining security
  'Content-Security-Policy': [
    "default-src 'self' https:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
    "style-src 'self' 'unsafe-inline' https:",
    "img-src * data: blob:",
    "font-src 'self' data: https:",
    "connect-src *",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https:",
    "frame-ancestors *", // Allow any domain to embed (for SEO tools)
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
    'ambient-light-sensor=()',
    'autoplay=()',
    'battery=()',
    'camera=(self)', // Only on specific pages that need it
    'cross-origin-isolated=()',
    'display-capture=()',
    'document-domain=()',
    'encrypted-media=()',
    'execution-while-not-rendered=()',
    'execution-while-out-of-viewport=()',
    'fullscreen=(self)',
    'geolocation=()',
    'gyroscope=()',
    'keyboard-map=()',
    'magnetometer=()',
    'microphone=()',
    'midi=()',
    'navigation-override=()',
    'payment=(self https://js.stripe.com https://checkout.stripe.com)',
    'picture-in-picture=()',
    'publickey-credentials-get=()',
    'screen-wake-lock=()',
    'sync-xhr=()',
    'usb=()',
    'web-share=()',
    'xr-spatial-tracking=()'
  ].join(', '),
  
  // HSTS with preload
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  
  // Additional security headers
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-Download-Options': 'noopen',
  'X-DNS-Prefetch-Control': 'off',
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