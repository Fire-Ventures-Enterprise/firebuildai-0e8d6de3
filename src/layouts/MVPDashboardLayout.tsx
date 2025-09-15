import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MVPDashboardSidebar } from '@/components/navigation/MVPDashboardSidebar';
import { MVPDashboardHeader } from '@/components/navigation/MVPDashboardHeader';

interface MVPDashboardLayoutProps {
  children: React.ReactNode;
}

export default function MVPDashboardLayout({ children }: MVPDashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <MVPDashboardSidebar />
        <div className="flex-1 flex flex-col">
          <MVPDashboardHeader />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}