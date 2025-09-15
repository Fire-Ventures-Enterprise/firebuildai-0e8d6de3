import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  DollarSign, 
  FileText, 
  TrendingUp,
  FolderOpen,
  ClipboardList,
  Calculator,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardHome() {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Active Projects',
      value: '12',
      description: '3 new this week',
      icon: FolderOpen,
      trend: '+15%',
    },
    {
      title: 'Revenue This Month',
      value: '$45,230',
      description: 'CAD',
      icon: DollarSign,
      trend: '+22%',
    },
    {
      title: 'Pending Invoices',
      value: '8',
      description: '$12,450 total',
      icon: FileText,
      trend: '-5%',
    },
    {
      title: 'Active Contractors',
      value: '24',
      description: '2 new this month',
      icon: Users,
      trend: '+8%',
    },
  ];

  const quickActions = [
    { label: 'New Project', icon: FolderOpen, path: '/dashboard/projects/new' },
    { label: 'Create Estimate', icon: Calculator, path: '/dashboard/estimates/new' },
    { label: 'New Invoice', icon: FileText, path: '/dashboard/invoices/new' },
    { label: 'Assign Work Order', icon: ClipboardList, path: '/dashboard/work-orders/new' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="flex items-center pt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Start your workflow with these common actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">123 Main Street Renovation</p>
                    <p className="text-sm text-muted-foreground">Kitchen & Bathroom</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$24,500</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: 'Submit proposal - Oak Ave', date: 'Today', type: 'Proposal' },
                { task: 'Invoice #1234 due', date: 'Tomorrow', type: 'Invoice' },
                { task: 'Site inspection - 456 Elm', date: 'Dec 28', type: 'Work Order' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.task}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}