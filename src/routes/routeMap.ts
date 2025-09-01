/**
 * Central route manifest for FireBuildAI
 * All routes should be defined here and imported where needed
 */

export const R = {
  // Authentication & Public Routes
  home: "/",
  login: "/login",
  signup: "/signup",
  tutorials: "/tutorials",
  download: "/download",
  help: "/help",
  about: "/about",
  blog: "/blog",
  careers: "/careers",
  contact: "/contact",
  api: "/api-docs",
  helpCenter: "/help-center",
  documentation: "/docs",
  status: "/status",
  terms: "/terms",
  privacy: "/privacy",

  // Main App Routes
  dashboard: "/app/dashboard",
  
  // Company & Admin
  company: "/app/company",
  settings: "/app/settings",
  admin: "/admin",
  adminLogin: "/admin/login",
  adminDashboard: "/admin/dashboard",
  adminConsultations: "/admin/consultations",
  upgrade: "/app/upgrade",
  
  // Client Management
  clients: "/app/client-portal",
  clientReports: "/app/client-reports",
  clientMessages: "/app/client-portal", // Same as clients for now
  
  // Team & Fleet Management
  teams: "/app/teams",
  fleet: "/app/fleet",
  contractorTracking: "/app/contractors/tracking",
  
  // Job & Scheduling
  scheduling: "/app/scheduling",
  jobs: "/app/jobs",
  jobNew: "/app/jobs/create",
  jobDetail: (id: string) => `/app/jobs/${id}`,
  jobChat: (id: string) => `/app/jobs/${id}/chat`,
  
  // Financial Routes
  finance: "/app/finance",
  estimates: "/app/estimates",
  estimateNew: "/app/estimates/new",
  estimateDetail: (id: string) => `/app/estimates/${id}`,
  estimateEdit: (id: string) => `/app/estimates/${id}/edit`,
  
  invoices: "/app/invoices",
  invoiceNew: "/app/invoices/new",
  invoiceDetail: (id: string) => `/app/invoices/${id}`,
  invoiceEdit: (id: string) => `/app/invoices/${id}/edit`,
  
  purchaseOrders: "/app/purchase-orders",
  purchaseOrderNew: "/app/purchase-orders/create",
  purchaseOrderDetail: (id: string) => `/app/purchase-orders/${id}`,
  purchaseOrderEdit: (id: string) => `/app/purchase-orders/${id}/edit`,
  
  expenses: "/app/finance/expenses",
  expenseNew: "/app/finance/expenses/new",
  vendors: "/app/finance/vendors",
  vendorNew: "/app/finance/vendors/new",
  vendorDetail: (id: string) => `/app/finance/vendors/${id}`,
  
  financialAnalytics: "/app/financial-analytics",
  
  // Analytics Routes
  analyticsHub: "/app/analytics",
  jobPerformance: "/app/job-performance",
  teamPerformance: "/app/team-performance",
  
  // Portal Routes (External/Public)
  portalEstimate: (token: string) => `/portal/estimate/${token}`,
  portalInvoice: (token: string) => `/portal/invoice/${token}`,
  estimateOpen: (id: string) => `/open/estimate/${id}`,
  
  // Mobile & Pairing
  mobilePair: (code: string) => `/get/mobile-pair/${code}`,
  downloadApp: "/download",
  
  // Billing & Payments
  billingPacket: (poId: string) => `/app/purchase-orders/${poId}/billing`,
} as const;

// Type-safe route params extractor
export type RouteParams = {
  [K in keyof typeof R]: typeof R[K] extends (...args: any[]) => string 
    ? Parameters<typeof R[K]> 
    : never;
};

// Helper to check if we're on a specific route
export const isRoute = (currentPath: string, route: string | ((id: string) => string)): boolean => {
  if (typeof route === 'string') {
    return currentPath === route;
  }
  // For dynamic routes, we'd need more complex matching
  return false;
};

// Helper to get breadcrumb path
export const getBreadcrumbPath = (path: string): Array<{ label: string; path: string }> => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; path: string }> = [];
  
  if (segments[0] === 'app') {
    breadcrumbs.push({ label: 'Dashboard', path: R.dashboard });
    
    // Add more breadcrumb logic based on path segments
    if (segments[1] === 'estimates') {
      breadcrumbs.push({ label: 'Estimates', path: R.estimates });
      if (segments[2] === 'new') {
        breadcrumbs.push({ label: 'New Estimate', path: R.estimateNew });
      }
    } else if (segments[1] === 'invoices') {
      breadcrumbs.push({ label: 'Invoices', path: R.invoices });
      if (segments[2] === 'new') {
        breadcrumbs.push({ label: 'New Invoice', path: R.invoiceNew });
      }
    } else if (segments[1] === 'purchase-orders') {
      breadcrumbs.push({ label: 'Purchase Orders', path: R.purchaseOrders });
      if (segments[2] === 'create') {
        breadcrumbs.push({ label: 'New Purchase Order', path: R.purchaseOrderNew });
      }
    } else if (segments[1] === 'jobs') {
      breadcrumbs.push({ label: 'Jobs', path: R.jobs });
      if (segments[2] === 'create') {
        breadcrumbs.push({ label: 'New Job', path: R.jobNew });
      }
    } else if (segments[1] === 'finance') {
      breadcrumbs.push({ label: 'Finance', path: R.finance });
      if (segments[2] === 'expenses') {
        breadcrumbs.push({ label: 'Expenses', path: R.expenses });
      } else if (segments[2] === 'vendors') {
        breadcrumbs.push({ label: 'Vendors', path: R.vendors });
      }
    }
  }
  
  return breadcrumbs;
};