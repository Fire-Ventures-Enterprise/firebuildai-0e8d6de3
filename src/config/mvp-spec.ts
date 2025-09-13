// FireBuild.ai MVP Specification
// Based on comprehensive requirements document

export const MVP_SPEC = {
  // Core MVP Features (Must Have)
  core: {
    authentication: {
      name: 'Authentication System',
      features: [
        'Email/password registration',
        'Email verification',
        'Secure login/logout',
        'Password reset',
        'Protected routes',
        'Session persistence'
      ]
    },
    projects: {
      name: 'Project Management',
      features: [
        'Create new project',
        'Project list view',
        'Project details',
        'Edit project info',
        'Status management',
        'Archive/delete',
        'Search and filter'
      ]
    },
    contractors: {
      name: 'Contractor Management',
      features: [
        'Add contractors',
        'Contractor directory',
        'Assign to projects',
        'Contact actions',
        'Trade filtering',
        'Performance notes'
      ]
    },
    workItems: {
      name: 'Work Item Tracking',
      features: [
        'Add work items',
        'Task assignment',
        'Due dates',
        'Priority levels',
        'Status tracking',
        'Progress calculation',
        'Timeline view'
      ]
    },
    communication: {
      name: 'Communication & Notes',
      features: [
        'Project notes',
        'Photo attachments',
        'Timestamps',
        'Note categories',
        'Timeline view',
        'Export to PDF'
      ]
    }
  },

  // Features to defer to Phase 2+
  deferred: {
    invoicing: 'Invoice generation and payment processing',
    analytics: 'Advanced reporting and analytics',
    scheduling: 'Calendar and scheduling integration',
    integrations: 'Third-party integrations (QuickBooks, etc.)',
    templates: 'Advanced project templates',
    workflows: 'Automated workflows and notifications',
    api: 'API for external integrations',
    teams: 'Team collaboration features',
    multiCompany: 'Multi-company management',
    whiteLabel: 'White-label solutions'
  },

  // Technical Requirements
  technical: {
    performance: {
      lighthouse: 90,
      fcp: 1.5, // First Contentful Paint < 1.5s
      lcp: 2.5, // Largest Contentful Paint < 2.5s
      cls: 0.1, // Cumulative Layout Shift < 0.1
      fid: 100, // First Input Delay < 100ms
      tti: 3,   // Time to Interactive < 3s
      bundleSize: 500 // < 500KB gzipped
    },
    mobile: {
      touchTargets: 44, // minimum 44px
      breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280
      },
      loadTime3G: 2 // < 2 seconds on 3G
    },
    accessibility: 'WCAG 2.1 AA'
  },

  // Design System
  design: {
    colors: {
      primary: '#2563eb',    // Blue
      secondary: '#6b7280',  // Gray
      success: '#10b981',    // Green
      warning: '#f59e0b',    // Yellow
      error: '#ef4444',      // Red
      background: '#ffffff', // White
      surface: '#f9fafb',    // Gray-50
      text: '#111827'        // Gray-900
    },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      headings: 'font-semibold to font-bold',
      body: 'font-normal',
      small: 'text-sm'
    }
  },

  // Timeline
  timeline: {
    week1_2: 'Foundation - Auth, Navigation, Database',
    week3_4: 'Core Features - Projects, Contractors',
    week5_6: 'Advanced Features - Work Items, Notes',
    week7_8: 'Polish & Testing - Optimization, Deployment'
  }
} as const;