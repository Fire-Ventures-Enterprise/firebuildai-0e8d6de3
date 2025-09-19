// App Layout Component - Main layout for the SaaS application
import { ReactNode } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { MVPAppSidebar } from '@/components/navigation/MVPAppSidebar';
import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { SidebarProvider } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-hero">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <MVPAppSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Single Dashboard Header - contains all header elements */}
          <DashboardHeader />
          
          {/* Page Content with improved spacing */}
          <main className="flex-1 px-8 py-6 lg:px-12 lg:py-8">
            <div className="max-w-[1600px] mx-auto">
              <AppBreadcrumbs />
              <div className="mt-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};