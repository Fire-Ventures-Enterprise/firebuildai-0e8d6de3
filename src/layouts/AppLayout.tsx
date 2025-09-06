// App Layout Component - Main layout for the SaaS application
import { ReactNode } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar';
import { MobileMenu } from '@/components/navigation/MobileMenu';
import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-hero">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <DesktopSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Single Dashboard Header - contains all header elements */}
          <DashboardHeader />
          
          {/* Page Content */}
          <main className="flex-1 p-6">
            <AppBreadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};