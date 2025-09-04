import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./layouts/AppLayout";
import WorkOrderDetailPage from "./pages/app/WorkOrderDetailPage";
import WorkOrdersListPage from "./pages/app/WorkOrdersListPage";
import WorkOrderPortalPage from "./pages/portal/WorkOrderPortalPage";
import { DeploymentInfo } from "./components/DeploymentInfo";
import { R } from "./routes/routeMap";

// Marketing pages
import { HomePage } from "./pages/marketing/HomePage";
import TutorialsPage from "./pages/marketing/TutorialsPage";
import AboutPage from "./pages/marketing/AboutPage";
import { PricingPage } from "./pages/PricingPage";

// Feature pages
import { ProfessionalEstimatesPage } from "./pages/features/ProfessionalEstimatesPage";
import { InvoicePaymentsPage } from "./pages/features/InvoicePaymentsPage";
import { JobSchedulingPage } from "./pages/features/JobSchedulingPage";
import { CrewManagementPage } from "./pages/features/CrewManagementPage";
import { AnalyticsPage as FeaturesAnalyticsPage } from "./pages/features/AnalyticsPage";
import { MobileAppPage } from "./pages/features/MobileAppPage";

// Public pages
import HelpPage from "./pages/HelpPage";

// Auth pages
import { SignUpPage } from "./pages/auth/SignUpPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";

// App pages
import { DashboardPage } from "./pages/app/DashboardPage";
import { EstimatesPage } from "./pages/app/EstimatesPage";
import { InvoicesPage } from "./pages/app/InvoicesPage";
import InvoiceDetailPage from "./pages/app/InvoiceDetailPage";
import ClientPortalPage from "./pages/app/ClientPortalPage";
import CompanyPage from "./pages/app/CompanyPage";
import TeamsPage from "./pages/app/TeamsPage";
import SchedulingPage from "./pages/app/SchedulingPage";
import JobsPage from "./pages/app/JobsPage";
import JobDetailsPage from "./pages/app/JobDetailsPage";
import CreateJobPage from "./pages/app/CreateJobPage";
import PurchaseOrdersPage from "./pages/app/PurchaseOrdersPage";
import CreatePurchaseOrderPage from "./pages/app/CreatePurchaseOrderPage";
import ContractorTrackingPage from "./pages/app/ContractorTrackingPage";
import ExpensesPage from "./pages/app/ExpensesPage";
import FinancialAnalyticsPage from "./pages/app/FinancialAnalyticsPage";
import SettingsPage from "./pages/app/SettingsPage";
import VendorsPage from "./pages/app/VendorsPage";
import ExpensesNewPage from "./pages/app/ExpensesNewPage";
import MobilePairLanding from "./pages/get/MobilePairLanding";
import { UpgradePage } from "./pages/UpgradePage";

// Analytics pages
import AnalyticsPage from "./pages/AnalyticsPage";
import JobPerformancePage from "./pages/JobPerformancePage";
import TeamPerformancePage from "./pages/TeamPerformancePage";
import ClientReportsPage from "./pages/ClientReportsPage";
import FleetPage from "./pages/FleetPage";

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
import DownloadAppPage from "./pages/marketing/DownloadAppPage";

// Legacy redirects
import { legacyRedirects } from "./routes/legacyRedirects";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Legacy redirects */}
            {legacyRedirects}
            {/* Marketing Site */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/download" element={<DownloadAppPage />} />
            <Route path="/tutorials" element={<TutorialsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* Feature Pages */}
            <Route path="/features/estimates" element={<ProfessionalEstimatesPage />} />
            <Route path="/features/invoicing" element={<InvoicePaymentsPage />} />
            <Route path="/features/scheduling" element={<JobSchedulingPage />} />
            <Route path="/features/crew" element={<CrewManagementPage />} />
            <Route path="/features/analytics" element={<FeaturesAnalyticsPage />} />
            <Route path="/features/mobile" element={<MobileAppPage />} />
            
            {/* Auth Routes */}
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
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
            
            <Route path="/app/invoices/:id" element={
              <ProtectedRoute>
                <AppLayout>
                  <InvoiceDetailPage />
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
            
            <Route path="/app/teams" element={
              <ProtectedRoute>
                <AppLayout>
                  <TeamsPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/scheduling" element={
              <ProtectedRoute>
                <AppLayout>
                  <SchedulingPage />
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
            
            <Route path="/app/work-orders" element={
              <ProtectedRoute>
                <AppLayout>
                  <WorkOrdersListPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/work-orders/:id" element={
              <ProtectedRoute>
                <AppLayout>
                  <WorkOrderDetailPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/portal/work-order/:token" element={<WorkOrderPortalPage />} />
            
            <Route path="/app/finance/expenses" element={
              <ProtectedRoute>
                <AppLayout>
                  <ExpensesPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/expenses/new" element={
              <ProtectedRoute>
                <AppLayout>
                  <ExpensesNewPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/fleet" element={
              <ProtectedRoute>
                <AppLayout>
                  <FleetPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/finance/vendors" element={
              <ProtectedRoute>
                <AppLayout>
                  <VendorsPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/analytics" element={
              <ProtectedRoute>
                <AppLayout>
                  <AnalyticsPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/job-performance" element={
              <ProtectedRoute>
                <AppLayout>
                  <JobPerformancePage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/team-performance" element={
              <ProtectedRoute>
                <AppLayout>
                  <TeamPerformancePage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/client-reports" element={
              <ProtectedRoute>
                <AppLayout>
                  <ClientReportsPage />
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
        {/* Mobile Pairing Landing */}
        <Route path="/get/mobile" element={<MobilePairLanding />} />
        
        <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;