import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./layouts/AppLayout";

// Marketing pages
import { HomePage } from "./pages/marketing/HomePage";

// Auth pages
import { SignUpPage } from "./pages/auth/SignUpPage";
import { LoginPage } from "./pages/auth/LoginPage";

// App pages
import { DashboardPage } from "./pages/app/DashboardPage";
import { EstimatesPage } from "./pages/app/EstimatesPage";
import { InvoicesPage } from "./pages/app/InvoicesPage";
import ClientPortalPage from "./pages/app/ClientPortalPage";
import CompanyPage from "./pages/app/CompanyPage";
import JobsPage from "./pages/app/JobsPage";
import JobDetailsPage from "./pages/app/JobDetailsPage";
import CreateJobPage from "./pages/app/CreateJobPage";
import PurchaseOrdersPage from "./pages/app/PurchaseOrdersPage";
import CreatePurchaseOrderPage from "./pages/app/CreatePurchaseOrderPage";
import ContractorTrackingPage from "./pages/app/ContractorTrackingPage";
import ExpensesPage from "./pages/app/ExpensesPage";
import FinancialAnalyticsPage from "./pages/app/FinancialAnalyticsPage";
import SettingsPage from "./pages/app/SettingsPage";
import { UpgradePage } from "./pages/UpgradePage";

// Admin pages
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ConsultationManagement } from "./pages/admin/ConsultationManagement";

// Other pages
import NotFound from "./pages/NotFound";

// Portal pages
import EstimatePortalPage from "./pages/portal/EstimatePortalPage";
import InvoicePortalPage from "./pages/portal/InvoicePortalPage";
import EstimateOpenPage from "./pages/open/EstimateOpenPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Marketing Site */}
            <Route path="/" element={<HomePage />} />
            
            {/* Auth Routes */}
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Portal Routes - Public */}
            <Route path="/open/estimate/:token" element={<EstimateOpenPage />} />
            <Route path="/portal/estimate/:token" element={<EstimatePortalPage />} />
            <Route path="/portal/invoice/:token" element={<InvoicePortalPage />} />
            
            {/* Upgrade Page */}
            <Route path="/upgrade" element={<UpgradePage />} />
            
            {/* App Routes - Protected */}
            <Route path="/app" element={
              <ProtectedRoute>
                <AppLayout>
                  <Navigate to="/app/dashboard" replace />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/estimates" element={
              <ProtectedRoute>
                <AppLayout>
                  <EstimatesPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/invoices" element={
              <ProtectedRoute>
                <AppLayout>
                  <InvoicesPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/client-portal" element={
              <ProtectedRoute>
                <AppLayout>
                  <ClientPortalPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/company" element={
              <ProtectedRoute>
                <AppLayout>
                  <CompanyPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/jobs" element={
              <ProtectedRoute>
                <AppLayout>
                  <JobsPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/jobs/:jobId" element={
              <ProtectedRoute>
                <AppLayout>
                  <JobDetailsPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/jobs/create" element={
              <ProtectedRoute>
                <AppLayout>
                  <CreateJobPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/purchase-orders" element={
              <ProtectedRoute>
                <AppLayout>
                  <PurchaseOrdersPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/purchase-orders/create" element={
              <ProtectedRoute>
                <AppLayout>
                  <CreatePurchaseOrderPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/contractors/tracking" element={
              <ProtectedRoute>
                <AppLayout>
                  <ContractorTrackingPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/finance/expenses" element={
              <ProtectedRoute>
                <AppLayout>
                  <ExpensesPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/fleet" element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="p-8">
                    <h1 className="text-3xl font-bold">Fleet Management</h1>
                    <p className="text-muted-foreground mt-2">Fleet management dashboard coming soon...</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/clients/messages" element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="p-8">
                    <h1 className="text-3xl font-bold">Client Messages</h1>
                    <p className="text-muted-foreground mt-2">Client messaging system coming soon...</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/financial-analytics" element={
              <ProtectedRoute>
                <AppLayout>
                  <FinancialAnalyticsPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/settings" element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin Routes - Secret URL */}
            <Route path="/secure-admin-2024-fb-portal/login" element={<AdminLoginPage />} />
            <Route path="/secure-admin-2024-fb-portal" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/secure-admin-2024-fb-portal/consultations" element={
              <ProtectedRoute>
                <ConsultationManagement />
              </ProtectedRoute>
            } />
            
            {/* Legacy admin routes - redirect to home to hide them */}
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
            <Route path="/admin/login" element={<Navigate to="/" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;