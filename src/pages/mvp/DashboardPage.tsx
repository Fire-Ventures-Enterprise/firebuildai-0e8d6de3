import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { supabase } from '@/integrations/supabase/client';
import { 
  FolderOpen, 
  Users, 
  CheckSquare, 
  Clock,
  AlertCircle,
  TrendingUp,
  Zap,
  Code2,
  Home
} from 'lucide-react';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentProjects } from '@/components/dashboard/RecentProjects';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { BlockTracker } from '@/components/development/BlockTracker';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentBlock, getBlockProgress } from '@/config/development-blocks';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalContractors: 0,
    pendingTasks: 0,
    completedTasks: 0,
    overdueTasks: 0
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const currentBlock = getCurrentBlock();
  const blockProgress = getBlockProgress();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const [
        { count: totalProjects },
        { count: activeProjects },
        { count: totalContractors },
        { count: pendingTasks },
        { count: completedTasks },
        { count: overdueTasks }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact' }).eq('owner_id', user?.id),
        supabase.from('projects').select('*', { count: 'exact' }).eq('owner_id', user?.id).eq('status', 'active'),
        supabase.from('contractors').select('*', { count: 'exact' }).eq('owner_id', user?.id),
        supabase.from('work_items').select('*', { count: 'exact' }).in('status', ['not_started', 'in_progress']),
        supabase.from('work_items').select('*', { count: 'exact' }).eq('status', 'completed'),
        supabase.from('work_items').select('*', { count: 'exact' }).lt('due_date', new Date().toISOString()).neq('status', 'completed')
      ]);

      // Load recent projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Format projects for display
      const formattedProjects = projectsData?.map(p => ({
        id: p.id,
        name: p.name,
        status: p.status || 'planning',
        progress: 0, // Will be calculated based on work items
        dueDate: p.start_date ? new Date(p.start_date).toLocaleDateString() : 'No deadline',
        contractorCount: 0 // Will be populated with real data
      })) || [];

      setStats({
        totalProjects: totalProjects || 0,
        activeProjects: activeProjects || 0,
        totalContractors: totalContractors || 0,
        pendingTasks: pendingTasks || 0,
        completedTasks: completedTasks || 0,
        overdueTasks: overdueTasks || 0
      });

      setRecentProjects(formattedProjects);

      // Mock activities for now - will be replaced with real data
      setActivities([
        {
          id: '1',
          type: 'project_created',
          description: 'Project "Kitchen Renovation" was created',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          type: 'contractor_added',
          description: 'Mike Johnson added as contractor',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { 
      label: 'Active Projects', 
      value: stats.activeProjects, 
      icon: FolderOpen, 
      color: 'primary' as const,
      trend: { value: 12, isPositive: true }
    },
    { 
      label: 'Total Contractors', 
      value: stats.totalContractors, 
      icon: Users, 
      color: 'success' as const
    },
    { 
      label: 'Pending Tasks', 
      value: stats.pendingTasks, 
      icon: Clock, 
      color: 'warning' as const
    },
    { 
      label: 'Overdue Tasks', 
      value: stats.overdueTasks, 
      icon: AlertCircle, 
      color: 'error' as const,
      trend: { value: 5, isPositive: false }
    },
  ];

  const completionRate = stats.pendingTasks + stats.completedTasks > 0
    ? (stats.completedTasks / (stats.pendingTasks + stats.completedTasks)) * 100
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header with Development Status */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's your project overview for today
              </p>
            </div>
            {currentBlock && (
              <Badge variant="outline" className="hidden md:flex items-center gap-1">
                <Code2 className="h-3 w-3" />
                {currentBlock.name}
              </Badge>
            )}
          </div>

          {/* Development Progress Card */}
          {currentBlock && (
            <Card className="p-4 bg-primary/5 border-primary/20 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">MVP Development Progress</h3>
                <span className="text-xs text-muted-foreground">
                  {currentBlock.name}
                </span>
              </div>
              <Progress value={blockProgress.overallProgress} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                Block {blockProgress.completedBlocks}/{blockProgress.totalBlocks} • {blockProgress.overallProgress}% Complete
              </p>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <QuickActions />
        </div>

        {/* Stats Grid */}
        <div className="mb-6">
          <StatsGrid stats={statsData} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Projects - spans 2 columns on large screens */}
          <div className="lg:col-span-2">
            <RecentProjects projects={recentProjects} />
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed activities={activities} />
          </div>
        </div>

        {/* Overall Progress Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Overall Progress</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Task Completion Rate</span>
                <span className="font-medium">{completionRate.toFixed(0)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{stats.completedTasks}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{stats.pendingTasks}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.totalProjects}</p>
                <p className="text-xs text-muted-foreground">Total Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{stats.overdueTasks}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Empty State for New Users */}
        {stats.totalProjects === 0 && (
          <Card className="text-center py-12 mt-6">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Get Started with FireBuild</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start managing your construction projects efficiently. Create your first project to begin tracking work and coordinating with contractors.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/mvp/projects/new')} size="lg">
                Create Your First Project
              </Button>
              <Button 
                onClick={() => navigate('/mvp/contractors/new')} 
                variant="outline" 
                size="lg"
              >
                Add a Contractor
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}