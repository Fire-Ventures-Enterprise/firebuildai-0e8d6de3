import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, FileText, CheckCircle, Clock, 
  DollarSign, FileSignature, CreditCard, FileCheck,
  ClipboardList, Send, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch project details
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch estimates
  const { data: estimates = [] } = useQuery({
    queryKey: ['project-estimates', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  // Fetch proposals
  const { data: proposals = [] } = useQuery({
    queryKey: ['project-proposals', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  // Fetch invoices
  const { data: invoices = [] } = useQuery({
    queryKey: ['project-invoices', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('invoices_enhanced')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  // Fetch work orders
  const { data: workOrders = [] } = useQuery({
    queryKey: ['project-work-orders', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('work_orders')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <p className="text-destructive">Project not found</p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/dashboard/projects')}
          >
            Back to Projects
          </Button>
        </Card>
      </div>
    );
  }

  // Calculate workflow progress
  const workflowSteps = [
    { key: 'estimate', label: 'Estimate', icon: FileText, completed: estimates.length > 0 },
    { key: 'proposal', label: 'Proposal', icon: FileSignature, completed: proposals.some(p => p.status === 'sent' || p.status === 'accepted') },
    { key: 'signature', label: 'Signature', icon: CheckCircle, completed: proposals.some((p: any) => p.accepted_at) },
    { key: 'deposit', label: 'Deposit', icon: CreditCard, completed: invoices.some((i: any) => i.deposit_paid_at) },
    { key: 'invoice', label: 'Invoice', icon: FileCheck, completed: invoices.length > 0 },
    { key: 'work_order', label: 'Work Order', icon: ClipboardList, completed: workOrders.length > 0 },
  ];

  const completedSteps = workflowSteps.filter(step => step.completed).length;
  const progress = (completedSteps / workflowSteps.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard/projects')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">
              {project.address}, {project.city} {project.province}
            </p>
          </div>
        </div>
        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
          {project.status}
        </Badge>
      </div>

      {/* Workflow Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Progress</CardTitle>
          <CardDescription>Track your project through each stage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border ${
                    step.completed 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-muted border-border'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${
                    step.completed ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <span className="text-xs text-center font-medium">
                    {step.label}
                  </span>
                  {step.completed && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Take the next step in your workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {estimates.length === 0 && (
              <Button 
                onClick={() => navigate(`/dashboard/estimates/new?project=${id}`)}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Create Estimate
              </Button>
            )}
            {estimates.length > 0 && proposals.length === 0 && (
              <Button 
                onClick={() => navigate(`/dashboard/proposals/new?project=${id}`)}
                className="gap-2"
              >
                <FileSignature className="h-4 w-4" />
                Create Proposal
              </Button>
            )}
            {proposals.some((p: any) => p.accepted_at) && invoices.length === 0 && (
              <Button 
                onClick={() => navigate(`/dashboard/invoices/new?project=${id}`)}
                className="gap-2"
              >
                <FileCheck className="h-4 w-4" />
                Create Invoice
              </Button>
            )}
            {invoices.length > 0 && workOrders.length === 0 && (
              <Button 
                onClick={() => navigate(`/dashboard/work-orders/new?project=${id}`)}
                className="gap-2"
              >
                <ClipboardList className="h-4 w-4" />
                Create Work Order
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="estimates">
            Estimates {estimates.length > 0 && `(${estimates.length})`}
          </TabsTrigger>
          <TabsTrigger value="proposals">
            Proposals {proposals.length > 0 && `(${proposals.length})`}
          </TabsTrigger>
          <TabsTrigger value="invoices">
            Invoices {invoices.length > 0 && `(${invoices.length})`}
          </TabsTrigger>
          <TabsTrigger value="work-orders">
            Work Orders {workOrders.length > 0 && `(${workOrders.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{project.project_type || 'General'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">
                    {project.budget || project.estimated_budget ? 
                      `$${(project.budget || project.estimated_budget).toLocaleString()}` : 
                      'TBD'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {format(new Date(project.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
              </div>
              {project.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{project.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estimates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Estimates</CardTitle>
                <CardDescription>Manage project estimates</CardDescription>
              </div>
              <Button 
                onClick={() => navigate(`/dashboard/estimates/new?project=${id}`)}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Estimate
              </Button>
            </CardHeader>
            <CardContent>
              {estimates.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No estimates yet. Create your first estimate to get started.
                </p>
              ) : (
                <div className="space-y-2">
                  {estimates.map((estimate: any) => (
                    <div 
                      key={estimate.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/dashboard/estimates/${estimate.id}`)}
                    >
                      <div>
                        <p className="font-medium">{estimate.estimate_number}</p>
                        <p className="text-sm text-muted-foreground">
                          ${estimate.total?.toLocaleString()} • {estimate.status}
                        </p>
                      </div>
                      <Badge variant={estimate.status === 'accepted' ? 'default' : 'secondary'}>
                        {estimate.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Proposals</CardTitle>
                <CardDescription>Track proposal status</CardDescription>
              </div>
              {estimates.length > 0 && (
                <Button 
                  onClick={() => navigate(`/dashboard/proposals/new?project=${id}`)}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Proposal
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {proposals.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No proposals yet. Create an estimate first, then convert it to a proposal.
                </p>
              ) : (
                <div className="space-y-2">
                  {proposals.map((proposal: any) => (
                    <div 
                      key={proposal.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">Proposal #{proposal.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {proposal.status} • Expires {proposal.expires_at || proposal.expiration_date ? format(new Date(proposal.expires_at || proposal.expiration_date), 'MMM d, yyyy') : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {proposal.accepted_at && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <Badge variant={proposal.status === 'accepted' ? 'default' : 'secondary'}>
                          {proposal.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Manage project invoices</CardDescription>
              </div>
              <Button 
                onClick={() => navigate(`/dashboard/invoices/new?project=${id}`)}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Invoice
              </Button>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No invoices yet. Complete a proposal to create invoices.
                </p>
              ) : (
                <div className="space-y-2">
                  {invoices.map((invoice: any) => (
                    <div 
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/dashboard/invoices/${invoice.id}`)}
                    >
                      <div>
                        <p className="font-medium">{invoice.invoice_number}</p>
                        <p className="text-sm text-muted-foreground">
                          ${invoice.total?.toLocaleString()} • Due {invoice.due_date ? format(new Date(invoice.due_date), 'MMM d, yyyy') : 'N/A'}
                        </p>
                      </div>
                      <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'overdue' ? 'destructive' : 'secondary'}>
                        {invoice.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work-orders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Work Orders</CardTitle>
                <CardDescription>Manage work assignments</CardDescription>
              </div>
              <Button 
                onClick={() => navigate(`/dashboard/work-orders/new?project=${id}`)}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Work Order
              </Button>
            </CardHeader>
            <CardContent>
              {workOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No work orders yet. Create work orders after invoice approval.
                </p>
              ) : (
                <div className="space-y-2">
                  {workOrders.map((order) => (
                    <div 
                      key={order.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/dashboard/work-orders/${order.id}`)}
                    >
                      <div>
                        <p className="font-medium">{order.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.status} • {order.service_address}
                        </p>
                      </div>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}