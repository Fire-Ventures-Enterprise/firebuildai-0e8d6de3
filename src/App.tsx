import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/app/DashboardPage";
import { EstimatesPage } from "./pages/app/EstimatesPage";
import { InvoicesPage } from "./pages/app/InvoicesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* App Routes - SaaS Platform */}
          <Route path="/" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/estimates" element={<AppLayout><EstimatesPage /></AppLayout>} />
          <Route path="/invoices" element={<AppLayout><InvoicesPage /></AppLayout>} />
          <Route path="/scheduling" element={<AppLayout><div className="p-8 text-center"><h2 className="text-2xl font-bold">Scheduling Coming Soon</h2></div></AppLayout>} />
          <Route path="/fleet" element={<AppLayout><div className="p-8 text-center"><h2 className="text-2xl font-bold">Fleet Management Coming Soon</h2></div></AppLayout>} />
          <Route path="/teams" element={<AppLayout><div className="p-8 text-center"><h2 className="text-2xl font-bold">Teams Coming Soon</h2></div></AppLayout>} />
          <Route path="/analytics" element={<AppLayout><div className="p-8 text-center"><h2 className="text-2xl font-bold">Analytics Coming Soon</h2></div></AppLayout>} />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
