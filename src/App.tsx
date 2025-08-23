import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/app/DashboardPage";
import { EstimatesPage } from "./pages/app/EstimatesPage";
import { InvoicesPage } from "./pages/app/InvoicesPage";
import { HomePage } from "./pages/marketing/HomePage";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { UpgradePage } from "./pages/UpgradePage";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
            
            {/* Auth routes */}
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/upgrade" element={
              <ProtectedRoute requireActive={false}>
                <UpgradePage />
              </ProtectedRoute>
            } />
            
            {/* App Routes - Protected */}
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/app/dashboard" element={
              <ProtectedRoute>
                <AppLayout><DashboardPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/app/estimates" element={
              <ProtectedRoute>
                <AppLayout><EstimatesPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/app/invoices" element={
              <ProtectedRoute>
                <AppLayout><InvoicesPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/app/scheduling" element={
              <ProtectedRoute>
                <AppLayout><div className="p-8 text-center"><h2 className="text-2xl font-bold">Scheduling Coming Soon</h2></div></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/app/fleet" element={
              <ProtectedRoute>
                <AppLayout><div className="p-8 text-center"><h2 className="text-2xl font-bold">Fleet Management Coming Soon</h2></div></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/app/teams" element={
              <ProtectedRoute>
                <AppLayout><div className="p-8 text-center"><h2 className="text-2xl font-bold">Teams Coming Soon</h2></div></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/app/analytics" element={
              <ProtectedRoute>
                <AppLayout><div className="p-8 text-center"><h2 className="text-2xl font-bold">Analytics Coming Soon</h2></div></AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;