import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FolderOpen, 
  Users, 
  CheckSquare, 
  Plus, 
  TrendingUp,
  Clock,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalContractors: 0,
    pendingTasks: 0,
    completedTasks: 0,
    overdueTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    try {
      // Load projects count
      const { count: totalProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .eq('owner_id', user?.id);

      const { count: activeProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .eq('owner_id', user?.id)
        .eq('status', 'active');

      // Load contractors count
      const { count: totalContractors } = await supabase
        .from('contractors')
        .select('*', { count: 'exact' })
        .eq('owner_id', user?.id);

      // Load work items stats
      const { count: pendingTasks } = await supabase
        .from('work_items')
        .select('*', { count: 'exact' })
        .in('status', ['not_started', 'in_progress']);

      const { count: completedTasks } = await supabase
        .from('work_items')
        .select('*', { count: 'exact' })
        .eq('status', 'completed');

      const { count: overdueTasks } = await supabase
        .from('work_items')
        .select('*', { count: 'exact' })
        .lt('due_date', new Date().toISOString())
        .neq('status', 'completed');

      setStats({
        totalProjects: totalProjects || 0,
        activeProjects: activeProjects || 0,
        totalContractors: totalContractors || 0,
        pendingTasks: pendingTasks || 0,
        completedTasks: completedTasks || 0,
        overdueTasks: overdueTasks || 0
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'New Project', icon: Plus, action: () => navigate('/projects/new'), color: 'primary' },
    { label: 'Add Contractor', icon: Users, action: () => navigate('/contractors/new'), color: 'secondary' },
    { label: 'Create Task', icon: CheckSquare, action: () => navigate('/work-items/new'), color: 'success' },
  ];

  const statCards = [
    { label: 'Active Projects', value: stats.activeProjects, icon: FolderOpen, color: 'text-primary' },
    { label: 'Total Contractors', value: stats.totalContractors, icon: Users, color: 'text-secondary' },
    { label: 'Pending Tasks', value: stats.pendingTasks, icon: Clock, color: 'text-warning' },
    { label: 'Overdue Tasks', value: stats.overdueTasks, icon: AlertCircle, color: 'text-destructive' },
  ];

  const completionRate = stats.pendingTasks + stats.completedTasks > 0
    ? (stats.completedTasks / (stats.pendingTasks + stats.completedTasks)) * 100
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your project overview.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              onClick={action.action}
              className="h-auto py-4 flex flex-col items-center gap-2"
              variant="outline"
            >
              <Icon className="h-6 w-6" />
              <span>{action.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Task Completion Rate</span>
              <span className="font-medium">{completionRate.toFixed(0)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed Tasks:</span>
              <span className="font-medium text-success">{stats.completedTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending Tasks:</span>
              <span className="font-medium text-warning">{stats.pendingTasks}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State for New Users */}
      {stats.totalProjects === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Get Started with Your First Project</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project to start tracking work and managing contractors.
            </p>
            <Button onClick={() => navigate('/projects/new')} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}