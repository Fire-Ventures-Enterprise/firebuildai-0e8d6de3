// App Layout Component - Main layout for the SaaS application
import { ReactNode } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();

  // Sync active tab with current route
  useEffect(() => {
    const path = location.pathname.substring(1) || 'dashboard';
    setActiveTab(path);
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DashboardHeader />
      <div className="flex">
        <DraggableSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          <AppBreadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
};