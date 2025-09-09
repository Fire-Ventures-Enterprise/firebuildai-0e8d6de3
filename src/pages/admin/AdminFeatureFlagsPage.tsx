import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const features = [
  {
    id: 'ai-scheduling',
    name: 'AI Scheduling',
    description: 'Intelligent job scheduling with AI optimization',
    status: 'beta',
    enabled: true,
  },
  {
    id: 'xactimate-integration',
    name: 'Xactimate Integration',
    description: 'Import and export Xactimate files',
    status: 'stable',
    enabled: true,
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    description: 'Automated workflow management system',
    status: 'experimental',
    enabled: false,
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'Native mobile application for iOS and Android',
    status: 'beta',
    enabled: true,
  },
  {
    id: 'analytics-pro',
    name: 'Analytics Pro',
    description: 'Advanced analytics and reporting features',
    status: 'stable',
    enabled: true,
  },
];

export const AdminFeatureFlagsPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Package className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Feature Flags</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Features</CardTitle>
                  <CardDescription>
                    Enable or disable features across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{feature.name}</h3>
                          <Badge
                            variant={
                              feature.status === 'stable'
                                ? 'default'
                                : feature.status === 'beta'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {feature.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                      <Switch defaultChecked={feature.enabled} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};