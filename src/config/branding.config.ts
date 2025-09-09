/**
 * Centralized branding configuration
 * This file contains all branding-related settings that should be configurable
 * rather than hardcoded throughout the application
 */

export const brandingConfig = {
  // Company Information
  company: {
    name: import.meta.env.VITE_COMPANY_NAME || 'Your Company',
    tagline: import.meta.env.VITE_COMPANY_TAGLINE || 'Professional Contractor Management Platform',
    description: import.meta.env.VITE_COMPANY_DESCRIPTION || 'The leading contractor management platform designed to streamline construction operations',
  },
  
  // Logo Configuration
  logos: {
    // These should be uploaded through the app settings or configured via environment variables
    light: import.meta.env.VITE_LOGO_LIGHT || '/placeholder-logo-light.svg',
    dark: import.meta.env.VITE_LOGO_DARK || '/placeholder-logo-dark.svg',
    // Legacy paths for backward compatibility
    legacyLight: '/lovable-uploads/6051e38e-b331-47c4-b218-10bea1030315.png',
    legacyDark: '/lovable-uploads/467a434f-0eee-4143-bd64-3d716cce95b1.png',
  },
  
  // Contact Information
  contact: {
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@example.com',
    salesEmail: import.meta.env.VITE_SALES_EMAIL || 'sales@example.com',
    phone: import.meta.env.VITE_COMPANY_PHONE || '',
    address: import.meta.env.VITE_COMPANY_ADDRESS || '',
  },
  
  // URLs
  urls: {
    marketing: import.meta.env.VITE_MARKETING_URL || window.location.origin,
    app: import.meta.env.VITE_APP_URL || window.location.origin,
    api: import.meta.env.VITE_API_URL || window.location.origin,
    documentation: import.meta.env.VITE_DOCS_URL || '/docs',
  },
  
  // SEO Configuration
  seo: {
    defaultTitle: import.meta.env.VITE_SEO_TITLE || 'Construction Management Software',
    titleTemplate: import.meta.env.VITE_SEO_TITLE_TEMPLATE || '%s | Construction Management',
    defaultDescription: import.meta.env.VITE_SEO_DESCRIPTION || 'Professional construction management software for contractors',
  },
  
  // Feature Flags
  features: {
    useCustomBranding: import.meta.env.VITE_USE_CUSTOM_BRANDING === 'true',
    allowLogoUpload: import.meta.env.VITE_ALLOW_LOGO_UPLOAD !== 'false',
  }
};

/**
 * Helper function to get company name with fallback
 */
export const getCompanyName = (userCompanyName?: string): string => {
  return userCompanyName || brandingConfig.company.name;
};

/**
 * Helper function to get logo URL based on theme and user settings
 */
export const getLogoUrl = (theme: 'light' | 'dark', customLogoUrl?: string): string => {
  if (customLogoUrl && brandingConfig.features.useCustomBranding) {
    return customLogoUrl;
  }
  
  // Check if custom logos are configured
  const configuredLogo = theme === 'dark' ? brandingConfig.logos.dark : brandingConfig.logos.light;
  if (configuredLogo && !configuredLogo.includes('placeholder')) {
    return configuredLogo;
  }
  
  // Fall back to legacy logos if they exist
  return theme === 'dark' ? brandingConfig.logos.legacyDark : brandingConfig.logos.legacyLight;
};

/**
 * Helper function to format page title
 */
export const formatPageTitle = (pageTitle?: string): string => {
  if (!pageTitle) {
    return brandingConfig.seo.defaultTitle;
  }
  return brandingConfig.seo.titleTemplate.replace('%s', pageTitle);
};