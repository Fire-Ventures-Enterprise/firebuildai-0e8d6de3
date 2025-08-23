// FireBuild App Configuration
// Handles environment-specific settings for the SaaS application

export const appConfig = {
  // Application metadata
  app: {
    name: 'FireBuild',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },

  // URLs configuration
  urls: {
    app: import.meta.env.VITE_APP_URL || 'https://app.firebuildai.com',
    marketing: import.meta.env.VITE_MARKETING_URL || 'https://firebuildai.com',
    api: import.meta.env.VITE_API_URL || 'https://api.firebuildai.com',
  },

  // Feature flags
  features: {
    estimates: true,
    invoicing: true,
    scheduling: true,
    fleet: true,
    teams: true,
    analytics: true,
    mobileSync: true,
    realTimeSync: true,
  },

  // Real-time sync configuration
  sync: {
    enabled: true,
    interval: 1000, // milliseconds
    maxRetries: 3,
    retryDelay: 2000,
  },

  // Mobile app configuration
  mobile: {
    deepLinkPrefix: 'firebuild://',
    appStoreUrl: '', // To be added when published
    playStoreUrl: '', // To be added when published
  },

  // SEO configuration for app subdomain
  seo: {
    appTitle: 'FireBuild - Contractor Management Platform',
    appDescription: 'Professional contractor management, estimates, invoicing, and team coordination platform',
    appKeywords: 'contractor management, estimates, invoicing, scheduling, fleet management',
  },
};