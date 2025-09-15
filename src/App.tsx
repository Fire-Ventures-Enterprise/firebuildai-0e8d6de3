import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ScrollToTop } from "./components/ScrollToTop";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./layouts/AppLayout";
import { MVPAppLayout } from "./layouts/MVPAppLayout";
import WorkOrderDetailPage from "./pages/app/WorkOrderDetailPage";
import WorkOrdersListPage from "./pages/app/WorkOrdersListPage";
import WorkOrderPortalPage from "./pages/portal/WorkOrderPortalPage";
import { DeploymentInfo } from "./components/DeploymentInfo";
import { R } from "./routes/routeMap";
import { getMarketingRoute, getDomainStrategy } from "./utils/marketingStrategy";

// Marketing pages
import { HomePage } from "./pages/marketing/HomePage";
import { LegacyDomainPage } from "./pages/marketing/LegacyDomainPage";
import { IndustryLandingPage } from "./pages/marketing/IndustryLandingPage";
import TutorialsPage from "./pages/marketing/TutorialsPage";
import AboutPage from "./pages/marketing/AboutPage";
import { PricingPage } from "./pages/PricingPage";
import { BlogPage } from "./pages/marketing/BlogPage";
import { CareersPage } from "./pages/marketing/CareersPage";
import { ContactPage } from "./pages/marketing/ContactPage";
import { ApiDocsPage } from "./pages/marketing/ApiDocsPage";
import { HelpCenterPage } from "./pages/marketing/HelpCenterPage";
import { DocumentationPage } from "./pages/marketing/DocumentationPage";
import { StatusPage } from "./pages/marketing/StatusPage";
import { TermsPrivacyPage } from "./pages/marketing/TermsPrivacyPage";

// Product landing pages
import { AISchedulingPage } from "./pages/products/AISchedulingPage";
import { XactimatePlusPage } from "./pages/products/XactimatePlusPage";
import { AnalyticsProPage } from "./pages/products/AnalyticsProPage";
import { WorkflowAutomationPage } from "./pages/products/WorkflowAutomationPage";

// Feature pages
import { ProfessionalEstimatesPage } from "./pages/features/ProfessionalEstimatesPage";
import { InvoicePaymentsPage } from "./pages/features/InvoicePaymentsPage";
import { JobSchedulingPage } from "./pages/features/JobSchedulingPage";
import { CrewManagementPage } from "./pages/features/CrewManagementPage";
import { AnalyticsPage as FeaturesAnalyticsPage } from "./pages/features/AnalyticsPage";
import { MobileAppPage } from "./pages/features/MobileAppPage";
import { WorkflowAutomationPage as FeaturesWorkflowPage } from "./pages/features/WorkflowAutomationPage";
import { XactimatePage as FeaturesXactimatePage } from "./pages/features/XactimatePage";

// Trade pages
import GeneralContractorsPage from "./pages/trades/GeneralContractorsPage";
import ElectriciansPage from "./pages/trades/ElectriciansPage";
import PlumbersPage from "./pages/trades/PlumbersPage";
import RoofersPage from "./pages/trades/RoofersPage";
import PaintersPage from "./pages/trades/PaintersPage";
import LandscapersPage from "./pages/trades/LandscapersPage";
import CarpentersPage from "./pages/trades/CarpentersPage";
import HVACPage from "./pages/trades/HVACPage";
import WindowsPage from "./pages/trades/WindowsPage";
import FlooringPage from "./pages/trades/FlooringPage";
import DrywallPage from "./pages/trades/DrywallPage";
import RestorationPage from "./pages/trades/RestorationPage";

// Public pages
import HelpPage from "./pages/HelpPage";

// Auth pages
import { SignUpPage } from "./pages/auth/SignUpPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import AuthPage from "./pages/auth/AuthPage";

// MVP Dashboard
import { MVPAuthProvider } from "./contexts/MVPAuthContext";
import { ProtectedRoute as MVPProtectedRoute } from "./components/auth/ProtectedRoute";
import MVPDashboardLayout from "./layouts/MVPDashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProjectsPage from "./pages/dashboard/ProjectsPage";
import ProjectDetailsPage from "./pages/dashboard/ProjectDetailsPage";
import ProposalsPage from "./pages/dashboard/ProposalsPage";
import ProjectsListPage from "./pages/dashboard/ProjectsListPage";
import CreateProjectPage from "./pages/dashboard/CreateProjectPage";
import ProjectDetailPage from "./pages/dashboard/ProjectDetailPage";

// Feature pages (imported for LiDAR)
import LiDARScanningPage from "./pages/features/LiDARScanningPage";

// SEO Landing pages
import LiDAREstimatingSoftwarePage from "./pages/seo/LiDAREstimatingSoftwarePage";

// App pages
import { DashboardPage } from "./pages/app/DashboardPage";
import { EstimatesPage } from "./pages/app/EstimatesPage";
import { ContractorsPage } from "./pages/mvp/ContractorsPage";
import { InvoicesPage } from "./pages/app/InvoicesPage";
import InvoiceDetailPage from "./pages/app/InvoiceDetailPage";
import ClientPortalPage from "./pages/app/ClientPortalPage";
import CompanySetupPage from "./pages/app/CompanySetupPage";
import CalendarPage from "./pages/app/CalendarPage";
import CompanyProfileSetup from "./pages/auth/CompanyProfileSetup";
import FireBuildDashboard from "./pages/app/FireBuildDashboard";
import MVPSettingsPage from "./pages/app/MVPSettingsPage";
import TeamsPage from "./pages/app/TeamsPage";
import ClientsPage from "./pages/app/ClientsPage";
import CustomerDetailsPage from "./pages/app/CustomerDetailsPage";
import SchedulingPage from "./pages/app/SchedulingPage";
import JobsPage from "./pages/app/JobsPage";
import JobDetailsPage from "./pages/app/JobDetailsPage";
import CreateJobPage from "./pages/app/CreateJobPage";
import PurchaseOrdersPage from "./pages/app/PurchaseOrdersPage";
import CreatePurchaseOrderPage from "./pages/app/CreatePurchaseOrderPage";
import ContractorTrackingPage from "./pages/app/ContractorTrackingPage";
import ContractorSettingsPage from "./pages/app/ContractorSettingsPage";
import ExpensesPage from "./pages/app/ExpensesPage";
import FinancialAnalyticsPage from "./pages/app/FinancialAnalyticsPage";
import SettingsPage from "./pages/app/SettingsPage";
import VendorsPage from "./pages/app/VendorsPage";
import ExpensesNewPage from "./pages/app/ExpensesNewPage";
import BankingSettingsPage from "./pages/app/BankingSettingsPage";
import XactimatePage from "./pages/app/XactimatePage";
import WorkflowCalendarPage from "./pages/app/WorkflowCalendarPage";
import WorkflowSequencingPage from "./pages/app/WorkflowSequencingPage";
import WorkflowTestPage from "./pages/app/WorkflowTestPage";
import WorkflowDashboardPage from "./pages/app/WorkflowDashboardPage";
import CommunicationPage from "./pages/app/CommunicationPage";
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
import { AdminAnalyticsPage } from "./pages/admin/AdminAnalyticsPage";
import { AdminFeatureFlagsPage } from "./pages/admin/AdminFeatureFlagsPage";
import { AdminErrorsPage } from "./pages/admin/AdminErrorsPage";
import { AdminSubscribersPage } from "./pages/admin/AdminSubscribersPage";

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

const App = () => {
  // Check domain and get marketing route
  const [marketingRoute, setMarketingRoute] = useState<any>(null);
  
  useEffect(() => {
    const route = getMarketingRoute();
    setMarketingRoute(route);
  }, []);

  // If on secondary domain with special marketing campaign
  if (getDomainStrategy() === 'secondary' && marketingRoute) {
    const MarketingComponent = 
      marketingRoute.component === 'IndustryLandingPage' ? IndustryLandingPage :
      marketingRoute.component === 'LegacyDomainPage' ? LegacyDomainPage :
      HomePage;
    
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MarketingComponent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Otherwise show the normal app
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
      <BrowserRouter>
        <ScrollToTop />
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
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/api-docs" element={<ApiDocsPage />} />
            <Route path="/help-center" element={<HelpCenterPage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/terms" element={<TermsPrivacyPage />} />
            <Route path="/privacy" element={<TermsPrivacyPage />} />
            
            {/* Feature Pages */}
            <Route path="/features/estimates" element={<ProfessionalEstimatesPage />} />
            <Route path="/features/invoicing" element={<InvoicePaymentsPage />} />
            <Route path="/features/scheduling" element={<JobSchedulingPage />} />
            <Route path="/jobscheduling" element={<JobSchedulingPage />} /> {/* Legacy route */}
            <Route path="/features/crew" element={<CrewManagementPage />} />
            <Route path="/features/analytics" element={<FeaturesAnalyticsPage />} />
            <Route path="/features/mobile" element={<MobileAppPage />} />
            <Route path="/features/workflow" element={<FeaturesWorkflowPage />} />
            <Route path="/features/xactimate" element={<FeaturesXactimatePage />} />
            <Route path="/features/lidar-scanning" element={<LiDARScanningPage />} />
            
            {/* SEO Landing Pages */}
            <Route path="/lidar-estimating-software" element={<LiDAREstimatingSoftwarePage />} />
            
            {/* Trade Pages */}
            <Route path="/trades/general-contractors" element={<GeneralContractorsPage />} />
            <Route path="/trades/electricians" element={<ElectriciansPage />} />
            <Route path="/trades/plumbers" element={<PlumbersPage />} />
            <Route path="/trades/roofers" element={<RoofersPage />} />
            <Route path="/trades/painters" element={<PaintersPage />} />
            <Route path="/trades/landscapers" element={<LandscapersPage />} />
        <Route path="/trades/carpenters" element={<CarpentersPage />} />
        <Route path="/trades/hvac" element={<HVACPage />} />
        <Route path="/trades/windows" element={<WindowsPage />} />
        <Route path="/trades/flooring" element={<FlooringPage />} />
        <Route path="/trades/drywall" element={<DrywallPage />} />
        <Route path="/trades/restoration" element={<RestorationPage />} />
            
            {/* Product Landing Pages - Coming Soon */}
            <Route path="/products/ai-scheduling" element={<AISchedulingPage />} />
            <Route path="/products/xactimate-plus" element={<XactimatePlusPage />} />
            <Route path="/products/analytics-pro" element={<AnalyticsProPage />} />
            <Route path="/products/workflow-automation" element={<WorkflowAutomationPage />} />
            
            {/* Auth Routes */}
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/company-setup" element={<CompanyProfileSetup />} />
            
            {/* MVP Dashboard Auth */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* MVP Dashboard Routes - Protected */}
            <Route path="/dashboard" element={
              <MVPAuthProvider>
                <MVPProtectedRoute>
                  <MVPDashboardLayout>
                    <DashboardHome />
                  </MVPDashboardLayout>
                </MVPProtectedRoute>
              </MVPAuthProvider>
            } />
            
            <Route path="/dashboard/projects" element={
              <MVPAuthProvider>
                <MVPProtectedRoute>
                  <MVPDashboardLayout>
                    <ProjectsListPage />
                  </MVPDashboardLayout>
                </MVPProtectedRoute>
              </MVPAuthProvider>
            } />
            
            <Route path="/dashboard/projects/new" element={
              <MVPAuthProvider>
                <MVPProtectedRoute>
                  <MVPDashboardLayout>
                    <CreateProjectPage />
                  </MVPDashboardLayout>
                </MVPProtectedRoute>
              </MVPAuthProvider>
            } />
            
            <Route path="/dashboard/projects/:id" element={
              <MVPAuthProvider>
                <MVPProtectedRoute>
                  <MVPDashboardLayout>
                    <ProjectDetailPage />
                  </MVPDashboardLayout>
                </MVPProtectedRoute>
              </MVPAuthProvider>
            } />
            
            <Route path="/dashboard/estimates" element={
              <MVPAuthProvider>
                <MVPProtectedRoute>
                  <MVPDashboardLayout>
                    <EstimatesPage />
                  </MVPDashboardLayout>
                </MVPProtectedRoute>
              </MVPAuthProvider>
            } />
            
            <Route path="/dashboard/estimates/new" element={
              <MVPAuthProvider>
                <MVPProtectedRoute>
                  <MVPDashboardLayout>
                    <EstimatesPage />
                  </MVPDashboardLayout>
                </MVPProtectedRoute>
              </MVPAuthProvider>
            } />
            
            <Route path="/dashboard/invoices" element={
              <MVPAuthProvider>
                <MVPProtectedRoute>
                  <MVPDashboardLayout>
                    <InvoicesPage />
                  </MVPDashboardLayout>
                </MVPProtectedRoute>
              </MVPAuthProvider>
            } />
            
            <Route path="/dashboard/invoices/new" element={
              <MVPAuthProvider>
                <MVPProtectedRoute>
                  <MVPDashboardLayout>
                    <InvoicesPage />
                  </MVPDashboardLayout>
                </MVPProtectedRoute>
              </MVPAuthProvider>
            } />
            
            <Route path="/dashboard/work-orders" element={
              <MVPAuthProvider>
                <MVPProtectedRoute>
                  <MVPDashboardLayout>
                    <WorkOrdersListPage />
                  </MVPDashboardLayout>
                </MVPProtectedRoute>
              </MVPAuthProvider>
            } />
            
            <Route path="/dashboard/work-orders/new" element={
              <MVPAuthProvider>
                <MVPProtectedRoute>
                  <MVPDashboardLayout>
                    <WorkOrdersListPage />
                  </MVPDashboardLayout>
                </MVPProtectedRoute>
              </MVPAuthProvider>
            } />
            
            <Route path="/dashboard/proposals" element={
              <MVPAuthProvider>
                <MVPProtectedRoute>
                  <MVPDashboardLayout>
                    <ProposalsPage />
                  </MVPDashboardLayout>
                </MVPProtectedRoute>
              </MVPAuthProvider>
            } />
            
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
                <MVPAppLayout>
                  <FireBuildDashboard />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/estimates" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <EstimatesPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/estimates/new" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <CreateProjectPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/calendar" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <CalendarPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/settings-mvp" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <MVPSettingsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/invoices" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <InvoicesPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/invoices/:id" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <InvoiceDetailPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/client-portal" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <ClientPortalPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/company-setup" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <CompanySetupPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/company" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <CompanySetupPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/teams" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <TeamsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/scheduling" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <SchedulingPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/workflow" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <WorkflowDashboardPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/jobs" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <JobsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/jobs/:jobId" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <JobDetailsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/jobs/create" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <CreateJobPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/clients" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <ClientsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/customers/:id" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <CustomerDetailsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/purchase-orders" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <PurchaseOrdersPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/purchase-orders/create" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <CreatePurchaseOrderPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/contractors/tracking" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <ContractorTrackingPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/contractors/settings" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <ContractorSettingsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/work-orders" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <WorkOrdersListPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/work-orders/:id" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <WorkOrderDetailPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/portal/work-order/:token" element={<WorkOrderPortalPage />} />
            
            <Route path="/app/workflow-sequencing" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <WorkflowSequencingPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/workflow-test" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <WorkflowTestPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/contractor-settings" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <ContractorSettingsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/finance/expenses" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <ExpensesPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/expenses/new" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <ExpensesNewPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/fleet" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <FleetPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/finance/vendors" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <VendorsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/analytics" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <AnalyticsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/job-performance" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <JobPerformancePage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/team-performance" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <TeamPerformancePage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/client-reports" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <ClientReportsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/clients/messages" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <div className="p-8">
                    <h1 className="text-3xl font-bold">Client Messages</h1>
                    <p className="text-muted-foreground mt-2">Client messaging system coming soon...</p>
                  </div>
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/communication" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <CommunicationPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/financial-analytics" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <FinancialAnalyticsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/banking-settings" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <BankingSettingsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/xactimate" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <XactimatePage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/app/settings" element={
              <ProtectedRoute>
                <MVPAppLayout>
                  <SettingsPage />
                </MVPAppLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin Routes - Secret URL */}
            <Route path="/secure-admin-2024-fb-portal/login" element={<AdminLoginPage />} />
            <Route path="/secure-admin-2024-fb-portal" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/secure-admin-2024-fb-portal/subscribers" element={
              <ProtectedRoute>
                <AdminSubscribersPage />
              </ProtectedRoute>
            } />
            <Route path="/secure-admin-2024-fb-portal/consultations" element={
              <ProtectedRoute>
                <ConsultationManagement />
              </ProtectedRoute>
            } />
            <Route path="/secure-admin-2024-fb-portal/analytics" element={
              <ProtectedRoute>
                <AdminAnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/secure-admin-2024-fb-portal/features" element={
              <ProtectedRoute>
                <AdminFeatureFlagsPage />
              </ProtectedRoute>
            } />
            <Route path="/secure-admin-2024-fb-portal/errors" element={
              <ProtectedRoute>
                <AdminErrorsPage />
              </ProtectedRoute>
            } />
            
            {/* Legacy admin routes - redirect to home to hide them */}
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
            <Route path="/admin/login" element={<Navigate to="/" replace />} />
            
            {/* Health Check Endpoints */}
            <Route path="/health" element={<div>OK</div>} />
            <Route path="/app/health" element={<div>OK</div>} />
            
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
};

export default App;