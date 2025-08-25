import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Users, CreditCard, Building2, TrendingUp, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminSubscribersTable } from '@/components/admin/AdminSubscribersTable';
import { AdminPaymentsTable } from '@/components/admin/AdminPaymentsTable';
import { AdminMetrics } from '@/components/admin/AdminMetrics';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsAdmin(true);
        setAdminRole(data.role);
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <Badge variant="secondary">{adminRole}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Main Site
              </Button>
              <Button 
                variant="ghost" 
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate('/admin/login');
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AdminMetrics />

        <Tabs defaultValue="subscribers" className="mt-8">
          <TabsList>
            <TabsTrigger value="subscribers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Companies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscribers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Subscribers</CardTitle>
                <CardDescription>
                  View and manage all subscriber accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminSubscribersTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  View all payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminPaymentsTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Companies</CardTitle>
                <CardDescription>
                  View all registered companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Company management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};