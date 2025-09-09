import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSubscribersTable } from '@/components/admin/AdminSubscribersTable';

export const AdminSubscribersPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Users className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Subscribers Management</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Active Subscribers</CardTitle>
                  <CardDescription>
                    Manage and monitor all platform subscribers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminSubscribersTable />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};