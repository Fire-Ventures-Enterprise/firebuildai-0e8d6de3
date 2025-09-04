import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  getWorkOrder, 
  getWorkOrderItems, 
  getWorkOrderReport, 
  updateWorkOrderStatus,
  createWorkOrderToken 
} from "@/services/workOrders";
import { CreateCrewLinkButton } from "@/components/workorders/CreateCrewLinkButton";
import { WorkOrderPrintSheet } from "@/components/workorders/WorkOrderPrintSheet";
import { 
  Clipboard, 
  Calendar, 
  MapPin, 
  Clock, 
  Printer, 
  ExternalLink,
  Loader2,
  Copy,
  CheckCircle,
  AlertCircle,
  FileText,
  Camera
} from "lucide-react";
import { format } from "date-fns";

interface WorkOrder {
  id: string;
  user_id: string;
  invoice_id: string;
  schedule_id?: string;
  title: string;
  service_address?: string;
  starts_at: string;
  ends_at: string;
  team_id?: string;
  instructions?: string;
  status: 'issued' | 'in_progress' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface WorkOrderItem {
  id: string;
  work_order_id: string;
  source_invoice_item_id?: string;
  kind: 'task' | 'material' | 'equipment' | 'note';
  description: string;
  quantity: number;
  unit?: string;
  sort_order: number;
}

export default function WorkOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [items, setItems] = useState<WorkOrderItem[]>([]);
  const [report, setReport] = useState<any>(null);
  const [copyingLink, setCopyingLink] = useState(false);
  const [showCrewLinkModal, setShowCrewLinkModal] = useState(false);
  const [showPrintSheet, setShowPrintSheet] = useState(false);

  useEffect(() => {
    if (id) {
      loadWorkOrder();
    }
  }, [id]);

  async function loadWorkOrder() {
    setLoading(true);
    try {
      const [wo, woItems, woReport] = await Promise.all([
        getWorkOrder(id!),
        getWorkOrderItems(id!),
        getWorkOrderReport(id!)
      ]);

      if (!wo) {
        toast({
          title: "Error",
          description: "Work order not found",
          variant: "destructive"
        });
        navigate('/app/invoices');
        return;
      }

      setWorkOrder(wo as any);
      setItems(woItems as any);
      setReport(woReport);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load work order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function generateCrewLink() {
    if (!workOrder) return;
    
    setCopyingLink(true);
    try {
      // Generate token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);

      // For now, we'll use a temporary approach until types are updated
      const { error } = await supabase
        .from('work_order_tokens' as any)
        .insert({
          work_order_id: workOrder.id,
          token_hash: token, // In production, this should be hashed
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      // Generate URL
      const url = `${window.location.origin}/portal/work-order/${token}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(url);
      
      toast({
        title: "Link Copied",
        description: "Crew portal link copied to clipboard (expires in 48 hours)"
      });
    } catch (error: any) {
      console.error('Error generating link:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate crew link",
        variant: "destructive"
      });
    } finally {
      setCopyingLink(false);
    }
  }

  async function updateStatus(newStatus: WorkOrder['status']) {
    if (!workOrder) return;
    
    try {
      const { error } = await supabase
        .from('work_orders' as any)
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', workOrder.id);

      if (error) throw error;

      setWorkOrder({ ...workOrder, status: newStatus });
      
      toast({
        title: "Status Updated",
        description: `Work order marked as ${newStatus}`
      });
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    }
  }

  function handlePrint() {
    setShowPrintSheet(true);
    setTimeout(() => {
      window.print();
      setShowPrintSheet(false);
    }, 100);
  }

  function openInCalendar() {
    if (!workOrder) return;
    const date = workOrder.starts_at.slice(0, 10);
    window.open(`/app/scheduling?date=${date}&focus=work-order:${workOrder.id}`, '_blank');
  }

  const statusColors = {
    issued: 'default',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'destructive'
  };

  const statusIcons = {
    issued: <FileText className="w-3 h-3" />,
    in_progress: <Clock className="w-3 h-3" />,
    completed: <CheckCircle className="w-3 h-3" />,
    cancelled: <AlertCircle className="w-3 h-3" />
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground">Work order not found</p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6" data-testid="wo-detail">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{workOrder.title}</h1>
          <p className="text-muted-foreground">Created {format(new Date(workOrder.created_at), 'PPP')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusColors[workOrder.status] as any}>
            <span className="flex items-center gap-1">
              {statusIcons[workOrder.status]}
              {workOrder.status.replace('_', ' ').toUpperCase()}
            </span>
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCrewLinkModal(true)}
          >
            <Copy className="w-4 h-4 mr-2" />
            Create Crew Link / QR
          </Button>
            <Button variant="outline" onClick={openInCalendar}>
              <Calendar className="w-4 h-4 mr-2" />
              View in Calendar
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print Work Order
            </Button>
            {workOrder.status === 'issued' && (
              <Button 
                variant="secondary"
                onClick={() => updateStatus('in_progress')}
              >
                Mark In Progress
              </Button>
            )}
            {workOrder.status === 'in_progress' && (
              <Button 
                variant="default"
                onClick={() => updateStatus('completed')}
              >
                Mark Complete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="report">Field Report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Schedule</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(workOrder.starts_at), 'PPP p')} - {format(new Date(workOrder.ends_at), 'p')}
                    </span>
                  </div>
                </div>
                {workOrder.service_address && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Service Address</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{workOrder.service_address}</span>
                    </div>
                  </div>
                )}
              </div>
              {workOrder.instructions && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Instructions</p>
                  <p className="text-sm">{workOrder.instructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tasks & Materials */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks & Materials</CardTitle>
              <CardDescription>Work to be completed (no pricing shown to crew)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                    <Badge variant="outline" className="mt-0.5">
                      {item.kind}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} {item.unit || ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <CardDescription>Photos, documents, and other files</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No files attached yet</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report">
          <Card>
            <CardHeader>
              <CardTitle>Field Report</CardTitle>
              <CardDescription>Completion details submitted by crew</CardDescription>
            </CardHeader>
            <CardContent>
              {report ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed At</p>
                    <p>{format(new Date(report.completed_at), 'PPPp')}</p>
                  </div>
                  {report.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p>{report.notes}</p>
                    </div>
                  )}
                  {report.labor_hours > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Labor Hours</p>
                      <p>{report.labor_hours} hours</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No field report submitted yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Crew Link Modal */}
      {showCrewLinkModal && workOrder && (
        <CreateCrewLinkButton 
          workOrderId={workOrder.id} 
          trigger={showCrewLinkModal}
          onClose={() => setShowCrewLinkModal(false)}
        />
      )}

      {/* Work Order Print Sheet (hidden, for printing) */}
      {showPrintSheet && workOrder && (
        <div className="hidden print:block">
          <WorkOrderPrintSheet 
            workOrder={workOrder} 
            items={items}
            crewUrl={`${window.location.origin}/portal/work-order/[token]`}
          />
        </div>
      )}
    </div>
  );
}