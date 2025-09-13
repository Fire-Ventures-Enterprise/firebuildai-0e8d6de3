import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  FolderOpen, 
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { seedDemoData } from '@/utils/seedData';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalEstimates: number;
  totalInvoices: number;
  paidJobs: number;
  activeJobs: number;
  pendingAmount: number;
  paidAmount: number;
}

interface RecentActivity {
  id: string;
  type: 'estimate_sent' | 'invoice_sent' | 'payment_received' | 'job_completed';
  description: string;
  timestamp: Date;
  amount?: number;
}

export default function FireBuildDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalEstimates: 0,
    totalInvoices: 0,
    paidJobs: 0,
    activeJobs: 0,
    pendingAmount: 0,
    paidAmount: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      // Load estimates count
      const { count: estimatesCount } = await supabase
        .from('estimates')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Load invoices count
      const { count: invoicesCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Load jobs data
      const { data: jobs } = await supabase
        .from('jobs')
        .select('status, budget')
        .eq('user_id', user.id);

      const activeJobs = jobs?.filter(j => j.status === 'in_progress').length || 0;
      const paidJobs = jobs?.filter(j => j.status === 'completed').length || 0;

      setStats({
        totalEstimates: estimatesCount || 0,
        totalInvoices: invoicesCount || 0,
        paidJobs,
        activeJobs,
        pendingAmount: 15750, // Mock data for MVP
        paidAmount: 45230 // Mock data for MVP
      });

      // Mock recent activity for MVP
      setRecentActivity([
        {
          id: '1',
          type: 'estimate_sent',
          description: 'Estimate #1024 sent to John Smith',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          amount: 5250
        },
        {
          id: '2',
          type: 'payment_received',
          description: 'Payment received for Invoice #1023',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          amount: 3500
        },
        {
          id: '3',
          type: 'job_completed',
          description: 'Kitchen Renovation marked complete',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
          id: '4',
          type: 'invoice_sent',
          description: 'Invoice #1022 sent to Sarah Johnson',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
          amount: 7890
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'estimate_sent':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'invoice_sent':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'payment_received':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'job_completed':
        return <FolderOpen className="h-4 w-4 text-purple-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSeedData = async () => {
    if (!user) return;
    
    try {
      const success = await seedDemoData(user.id);
      if (success) {
        toast({
          title: "Demo Data Added",
          description: "Sample data has been added to your account",
        });
        loadDashboardData();
      } else {
        toast({
          title: "Data Already Exists",
          description: "Demo data has already been added",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add demo data",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header - Mobile responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Welcome back! Here's your business overview
          </p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button 
            onClick={() => navigate('/app/estimates/new')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden lg:inline">New Estimate</span>
          </Button>
          <Button 
            onClick={() => navigate('/app/invoices/new')}
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden lg:inline">New Invoice</span>
          </Button>
        </div>
      </div>

      {/* Quick Actions - Mobile shows first, larger on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 sm:hidden">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/app/estimates/new')}
        >
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 mx-auto mb-1 text-primary" />
            <p className="font-semibold text-sm">Estimate</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/app/invoices/new')}
        >
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto mb-1 text-success" />
            <p className="font-semibold text-sm">Invoice</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/app/jobs/new')}
        >
          <CardContent className="p-4 text-center">
            <FolderOpen className="h-6 w-6 mx-auto mb-1 text-warning" />
            <p className="font-semibold text-sm">Job</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/app/scheduling')}
        >
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 mx-auto mb-1 text-purple-500" />
            <p className="font-semibold text-sm">Schedule</p>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Quick Actions - Hidden on mobile */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/app/estimates/new')}
        >
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-semibold">New Estimate</p>
            <p className="text-sm text-muted-foreground">Create estimate</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/app/invoices/new')}
        >
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-success" />
            <p className="font-semibold">New Invoice</p>
            <p className="text-sm text-muted-foreground">Create invoice</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/app/jobs/new')}
        >
          <CardContent className="p-6 text-center">
            <FolderOpen className="h-8 w-8 mx-auto mb-2 text-warning" />
            <p className="font-semibold">New Job</p>
            <p className="text-sm text-muted-foreground">Track new job</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/app/calendar')}
        >
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="font-semibold">Schedule</p>
            <p className="text-sm text-muted-foreground">View calendar</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid - Mobile responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.paidAmount)}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalInvoices} invoices pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Jobs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.paidJobs} completed this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Stats Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest business activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-secondary">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                      {activity.amount && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs font-medium">
                            {formatCurrency(activity.amount)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Stats Summary</CardTitle>
            <CardDescription>Overview of your documents and jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Estimates</span>
                </div>
                <Badge variant="secondary">{stats.totalEstimates}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Invoices</span>
                </div>
                <Badge variant="secondary">{stats.totalInvoices}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="font-medium">Paid Jobs</span>
                </div>
                <Badge variant="success">{stats.paidJobs}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <span className="font-medium">In Progress</span>
                </div>
                <Badge variant="secondary">{stats.activeJobs}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Data Button - Only show if no data */}
      {stats.totalEstimates === 0 && stats.totalInvoices === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Want to explore the app with sample data?
            </p>
            <Button onClick={handleSeedData} variant="outline">
              Add Demo Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}