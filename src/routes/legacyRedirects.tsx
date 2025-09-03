import { Navigate, Route } from "react-router-dom";
import { R } from "./routeMap";

// Legacy path redirects - old URLs that should redirect to new ones
export const legacyPaths = [
  // Finance redirects
  ["/finance/po", R.purchaseOrders],
  ["/finance/vendor", R.vendors],
  ["/app/finance/po", R.purchaseOrders],
  ["/app/finance/vendor", R.vendors],
  
  // Jobs redirects
  ["/jobs/new", R.jobNew],
  ["/app/jobs/new", R.jobNew],
  ["/job/create", R.jobNew],
  
  // Old estimate paths
  ["/quotes", R.estimates],
  ["/app/quotes", R.estimates],
  ["/estimates/create", R.estimateNew],
  
  // Old invoice paths
  ["/invoicing", R.invoices],
  ["/app/invoicing", R.invoices],
  ["/invoice/create", R.invoiceNew],
  
  // Old expense paths
  ["/app/finance/expense", R.expenses],
  ["/app/expenses/create", R.expenseNew],
  
  // Company/settings
  ["/settings", R.settings],
  ["/app/profile", R.company],
  ["/app/account", R.company],
  
  // Analytics
  ["/reports", R.analyticsHub],
  ["/app/reports", R.analyticsHub],
  ["/app/analytics/job", R.jobPerformance],
  ["/app/analytics/team", R.teamPerformance],
  
  // Client paths
  ["/customers", R.clients],
  ["/app/customers", R.clients],
  ["/app/client-messages", R.clientMessages],
  
  // Teams/contractors
  ["/app/crew", R.teams],
  ["/app/contractors", R.teams],
  ["/app/gps-tracking", R.contractorTracking],
  
  // Dashboard
  ["/home", R.dashboard],
  ["/app/home", R.dashboard],
  ["/dashboard", R.dashboard],
  
  // Admin
  ["/admin", R.admin],
  ["/admin/dashboard", R.admin],
];

// Generate Route components for legacy redirects
export const legacyRedirects = legacyPaths.map(([from, to]) => (
  <Route 
    key={from} 
    path={from} 
    element={<Navigate to={to} replace />} 
  />
));