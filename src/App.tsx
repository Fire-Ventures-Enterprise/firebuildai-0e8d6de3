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
import { UpgradePage } from "./pages/UpgradePage";

// Admin pages
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

// Other pages
import NotFound from "./pages/NotFound";

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
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;