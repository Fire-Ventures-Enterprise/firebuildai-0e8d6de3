import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";

const queryClient = new QueryClient();

// ADMIN-ONLY APP - Deploy this to firebuildai-admin.com
const AdminApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Admin Portal Only Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            
            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default AdminApp;