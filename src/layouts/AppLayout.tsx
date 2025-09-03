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
          {/* Header with Mobile Menu */}
          <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                {/* Mobile Menu */}
                <div className="md:hidden">
                  <MobileMenu />
                </div>
                {/* Desktop Sidebar Toggle */}
                <div className="hidden md:block">
                  <SidebarTrigger />
                </div>
                <DashboardHeader />
              </div>
            </div>
          </header>
          
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