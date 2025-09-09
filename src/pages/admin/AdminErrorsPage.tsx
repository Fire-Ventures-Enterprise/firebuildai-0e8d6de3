import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Search, Filter } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const mockErrors = [
  {
    id: '1',
    timestamp: '2024-01-09 14:32:11',
    level: 'error',
    message: 'Failed to fetch user profile',
    service: 'auth-service',
    count: 12,
    status: 'unresolved',
  },
  {
    id: '2',
    timestamp: '2024-01-09 14:28:45',
    level: 'warning',
    message: 'Rate limit exceeded for API endpoint',
    service: 'api-gateway',
    count: 34,
    status: 'investigating',
  },
  {
    id: '3',
    timestamp: '2024-01-09 14:15:22',
    level: 'critical',
    message: 'Database connection timeout',
    service: 'database',
    count: 3,
    status: 'resolved',
  },
];

export const AdminErrorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getLevelBadge = (level: string) => {
    const variants: Record<string, any> = {
      critical: 'destructive',
      error: 'destructive',
      warning: 'secondary',
      info: 'outline',
    };
    return <Badge variant={variants[level] || 'outline'}>{level}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      unresolved: 'destructive',
      investigating: 'secondary',
      resolved: 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <AlertCircle className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Error Tracking</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search errors..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Errors</CardTitle>
                  <CardDescription>
                    System errors and warnings from the last 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockErrors.map((error) => (
                        <TableRow key={error.id}>
                          <TableCell className="font-mono text-sm">
                            {error.timestamp}
                          </TableCell>
                          <TableCell>{getLevelBadge(error.level)}</TableCell>
                          <TableCell className="max-w-md truncate">
                            {error.message}
                          </TableCell>
                          <TableCell>{error.service}</TableCell>
                          <TableCell>{error.count}</TableCell>
                          <TableCell>{getStatusBadge(error.status)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};