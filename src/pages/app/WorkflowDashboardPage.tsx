import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  AlertCircle, 
  CheckCircle, 
  PlayCircle,
  FileText,
  QrCode,
  Bell,
  ChevronRight,
  Package,
  Wrench,
  Copy,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { WorkOrder, ConstructionPhase } from '@/types/workflow';
import { ContractorWorkflowEngine } from '@/services/contractorWorkflowEngine';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function WorkflowDashboardPage() {
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [crewLinkDialogOpen, setCrewLinkDialogOpen] = useState(false);
  const [selectedWorkOrderToken, setSelectedWorkOrderToken] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkflowData();
  }, []);

  const fetchWorkflowData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch active work orders
      const { data: workOrders, error: woError } = await supabase
        .from('work_orders')
        .select(`
          *,
          invoice:invoices_enhanced(
            invoice_number,
            customer_name,
            service_address,
            service_city,
            total
          ),
          work_order_items(*)
        `)
        .eq('user_id', user.id)
        .in('status', ['draft', 'in_progress'])
        .order('created_at', { ascending: false });

      if (woError) {
        console.error('Error fetching work orders:', woError);
      } else if (workOrders) {
        setActiveJobs(workOrders);
      }

      // Fetch invoices with deposits paid but no work order
      const { data: invoices, error: invError } = await supabase
        .from('invoices_enhanced')
        .select(`
          *,
          invoice_items:invoice_items_enhanced(*)
        `)
        .eq('user_id', user.id)
        .gt('deposit_paid_at', new Date(0).toISOString())
        .is('work_order_id', null)
        .order('deposit_paid_at', { ascending: true });

      if (invError) {
        console.error('Error fetching invoices:', invError);
      } else if (invoices) {
        setPendingInvoices(invoices);
      }

      // For now, we'll create some mock notifications
      setNotifications([
        {
          id: '1',
          type: 'deposit_received',
          message: 'Deposit received for Johnson Kitchen - ready to schedule',
          sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          actionRequired: true
        },
        {
          id: '2',
          type: 'work_scheduled',
          message: 'Smith Bathroom renovation scheduled for next Monday',
          sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          actionRequired: false
        }
      ]);
    } catch (error) {
      console.error('Error fetching workflow data:', error);
      toast({
        title: "Error",
        description: "Failed to load workflow data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateWorkOrder = async (invoiceId: string) => {
    try {
      const workOrder = await ContractorWorkflowEngine.generateWorkOrder(invoiceId);
      toast({
        title: "Work Order Generated",
        description: `Work Order ${workOrder.workOrderNumber} created with ${workOrder.items.length} sequenced tasks.`
      });
      fetchWorkflowData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate work order: " + error.message,
        variant: "destructive"
      });
    }
  };

  const startJob = async (workOrderId: string) => {
    try {
      await ContractorWorkflowEngine.startWork(workOrderId);
      toast({
        title: "Job Started",
        description: "Work order is now active. Crew can begin work."
      });
      fetchWorkflowData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start job: " + error.message,
        variant: "destructive"
      });
    }
  };

  const generateCrewLink = async (workOrderId: string) => {
    try {
      // Generate or regenerate crew token
      const { data: token, error } = await supabase.rpc('regenerate_wo_token', {
        p_wo_id: workOrderId
      });

      if (error) throw error;

      setSelectedWorkOrderToken(token);
      setCrewLinkDialogOpen(true);
    } catch (error: any) {
      console.error('Error generating crew link:', error);
      toast({
        title: "Error",
        description: "Failed to generate crew link",
        variant: "destructive"
      });
    }
  };

  const copyCrewLink = () => {
    const link = `${window.location.origin}/portal/work-order/${selectedWorkOrderToken}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Crew access link has been copied to clipboard"
    });
  };

  const getPhaseLabel = (phase: string): string => {
    return phase.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'draft': 'bg-muted text-muted-foreground',
      'in_progress': 'bg-primary/10 text-primary',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'blocked': 'bg-destructive/10 text-destructive'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading workflow data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Notifications */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Workflow Dashboard</h1>
          <p className="text-muted-foreground">Manage your construction projects with AI-powered sequencing</p>
        </div>
        <div className="flex items-center gap-4">
          {notifications.filter(n => n.actionRequired).length > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              {notifications.filter(n => n.actionRequired).length} actions required
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs.filter(j => j.status === 'in_progress').length}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices.length}</div>
            <p className="text-xs text-muted-foreground">Ready to schedule</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs.filter(j => j.status === 'draft').length}</div>
            <p className="text-xs text-muted-foreground">Ready to start</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeJobs.reduce((sum, job) => sum + (job.work_order_items?.length || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all jobs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active-jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active-jobs">Active Jobs ({activeJobs.length})</TabsTrigger>
          <TabsTrigger value="pending-orders">Pending Orders ({pendingInvoices.length})</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Active Jobs Tab */}
        <TabsContent value="active-jobs" className="space-y-4">
          {activeJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No active jobs. Generate work orders from pending invoices to get started.
                  </p>
                  {pendingInvoices.length > 0 && (
                    <Button onClick={() => {
                      const pendingTab = document.querySelector('[data-value="pending-orders"]') as HTMLElement;
                      if (pendingTab) pendingTab.click();
                    }}>
                      View Pending Orders
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {job.service_address || job.invoice?.service_address}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(job.status)}>
                          {job.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {job.invoice && (
                          <span className="text-sm text-muted-foreground">
                            Invoice #{job.invoice.invoice_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{job.work_order_items?.length || 0} tasks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {job.starts_at ? format(new Date(job.starts_at), 'MMM d') : 'Not scheduled'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{job.invoice?.total ? `$${job.invoice.total.toFixed(2)}` : 'N/A'}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {job.status === 'draft' && (
                          <Button 
                            size="sm" 
                            onClick={() => startJob(job.id)}
                            className="flex items-center gap-1"
                          >
                            <PlayCircle className="h-4 w-4" />
                            Start Job
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/app/work-orders/${job.id}`)}
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => generateCrewLink(job.id)}
                        >
                          <QrCode className="h-4 w-4" />
                          Crew Link
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pending Work Orders Tab */}
        <TabsContent value="pending-orders" className="space-y-4">
          {pendingInvoices.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No invoices ready for work order generation.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingInvoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{invoice.customer_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Invoice #{invoice.invoice_number} • 
                          Deposit paid {invoice.deposit_paid_at && format(new Date(invoice.deposit_paid_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        READY FOR SCHEDULING
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Service Address:</span>
                          <p>{invoice.service_address}, {invoice.service_city}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Project Value:</span>
                          <p className="font-medium">${invoice.total.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Line Items:</span>
                        <p className="text-sm">{invoice.invoice_items?.length || 0} items to be sequenced</p>
                      </div>

                      <Button 
                        onClick={() => generateWorkOrder(invoice.id)}
                        className="w-full"
                      >
                        Generate Work Order & Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No new notifications</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <Card key={notification.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {notification.actionRequired ? (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        ) : (
                          <Bell className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(notification.sentAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Crew Link Dialog */}
      <Dialog open={crewLinkDialogOpen} onOpenChange={setCrewLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crew Access Link</DialogTitle>
            <DialogDescription>
              Share this link with your crew members to give them access to the work order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  value={`${window.location.origin}/portal/work-order/${selectedWorkOrderToken}`}
                  readOnly
                />
              </div>
              <Button type="button" size="sm" className="px-3" onClick={copyCrewLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>This link provides access to:</p>
              <ul className="list-disc list-inside mt-1">
                <li>View work order details</li>
                <li>Mark tasks as complete</li>
                <li>Submit daily field reports</li>
                <li>Report issues or material shortages</li>
              </ul>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open(`${window.location.origin}/portal/work-order/${selectedWorkOrderToken}`, '_blank')}
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}