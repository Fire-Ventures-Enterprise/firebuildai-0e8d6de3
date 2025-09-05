import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InvoiceSchedulingTab } from "@/components/sales/InvoiceSchedulingTab";
import { EnhancedInvoicePreview } from "@/components/invoicing/EnhancedInvoicePreview";
import { InvoiceSchedulingModal } from "@/components/invoicing/InvoiceSchedulingModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Calendar, Send, Edit, Trash, DollarSign, Wrench, ChevronDown, Link, Printer, AlertTriangle, ExternalLink, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EnhancedInvoice } from "@/types/enhanced-invoice";
import { Skeleton } from "@/components/ui/skeleton";
import { SendEmailDialog } from "@/components/shared/SendEmailDialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CreateCrewLinkButton } from "@/components/workorders/CreateCrewLinkButton";
import { WorkOrderPrintSheet } from "@/components/workorders/WorkOrderPrintSheet";
import { InvoiceWorkOrderActions } from "@/components/invoicing/InvoiceWorkOrderActions";
import { InvoiceAdjustmentsBanner } from "@/components/invoicing/InvoiceAdjustmentsBanner";
import { createWorkOrderFromInvoice, getWorkOrder, getWorkOrderItems } from "@/services/workOrders";
import { R } from "@/routes/routeMap";
import { getInvoiceSchedule } from "@/services/scheduling";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<EnhancedInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [workOrder, setWorkOrder] = useState<any>(null);
  const [hasSchedule, setHasSchedule] = useState(false);
  const [showCrewLinkModal, setShowCrewLinkModal] = useState(false);
  const [showPrintSheet, setShowPrintSheet] = useState(false);
  const [workOrderItems, setWorkOrderItems] = useState<any[]>([]);
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [crewToken, setCrewToken] = useState<string>("");
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [hasDepositPayment, setHasDepositPayment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
      fetchWorkOrder(id);
      checkSchedule(id);
      fetchAdjustments(id);
      checkDepositPayment(id);
    }
  }, [id]);

  // Subscribe to payment updates
  useEffect(() => {
    if (!id) return;

    const subscription = supabase
      .channel(`invoice-payments-${id}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'invoice_payments',
          filter: `invoice_id=eq.${id}`
        },
        (payload) => {
          // Check if this is a deposit payment
          if (payload.new && !hasSchedule) {
            checkDepositPayment(id);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id, hasSchedule]);

  const checkDepositPayment = async (invoiceId: string) => {
    try {
      const { data: invoice } = await supabase
        .from("invoices_enhanced")
        .select("deposit_amount, paid_amount")
        .eq("id", invoiceId)
        .single();

      if (invoice && invoice.deposit_amount > 0 && invoice.paid_amount >= invoice.deposit_amount) {
        setHasDepositPayment(true);
        
        // If no schedule exists and deposit is paid, show scheduling modal
        if (!hasSchedule) {
          setShowSchedulingModal(true);
        }
      }
    } catch (error) {
      console.error("Error checking deposit payment:", error);
    }
  };

  const fetchWorkOrder = async (invoiceId: string) => {
    try {
      const { data: woData, error: woError } = await supabase
        .from("work_orders")
        .select("*")
        .eq("invoice_id", invoiceId)
        .maybeSingle();

      if (woData) {
        setWorkOrder(woData);
        const items = await getWorkOrderItems(woData.id);
        setWorkOrderItems(items);
        
        // Generate crew token for the work order
        const { data: tokenData } = await supabase.rpc('create_work_order_token', {
          p_work_order_id: woData.id
        });
        if (tokenData) {
          setCrewToken(tokenData);
        }
      }
    } catch (error) {
      console.error("Error fetching work order:", error);
    }
  };

  const fetchAdjustments = async (invoiceId: string) => {
    try {
      const { data, error } = await supabase
        .from("invoice_adjustments")
        .select("*")
        .eq("invoice_id", invoiceId)
        .eq("status", "draft");

      if (data) {
        setAdjustments(data);
      }
    } catch (error) {
      console.error("Error fetching adjustments:", error);
    }
  };

  const checkSchedule = async (invoiceId: string) => {
    try {
      const schedule = await getInvoiceSchedule(invoiceId);
      setHasSchedule(!!schedule);
    } catch (error) {
      console.error("Error checking schedule:", error);
    }
  };

  const handleGenerateWorkOrder = async () => {
    if (!id) return;
    
    if (!hasSchedule) {
      toast.error("Please set a Start/End time in Scheduling before creating a Work Order.");
      return;
    }

    try {
      const woId = await createWorkOrderFromInvoice(id);
      toast.success("Work order created successfully");
      navigate(R.workOrderDetail(woId));
    } catch (error: any) {
      toast.error(error.message || "Failed to create work order");
    }
  };

  const handlePrintWorkOrder = () => {
    if (workOrder && workOrderItems) {
      setShowPrintSheet(true);
      setTimeout(() => {
        window.print();
        setShowPrintSheet(false);
      }, 100);
    }
  };

  const handleApproveAdjustments = async (adjustmentId: string) => {
    try {
      const { error } = await supabase.rpc('approve_invoice_adjustments', {
        p_adjustment_id: adjustmentId
      });
      
      if (error) throw error;
      
      toast.success("Adjustments approved successfully");
      fetchAdjustments(id!);
      fetchInvoice(id!);
    } catch (error: any) {
      toast.error(error.message || "Failed to approve adjustments");
    }
  };

  const handleRejectAdjustments = async (adjustmentId: string) => {
    try {
      const { error } = await supabase.rpc('reject_invoice_adjustments', {
        p_adjustment_id: adjustmentId
      });
      
      if (error) throw error;
      
      toast.success("Adjustments rejected");
      fetchAdjustments(id!);
    } catch (error: any) {
      toast.error(error.message || "Failed to reject adjustments");
    }
  };
  
  const getWorkOrderStatus = () => {
    if (!workOrder) return null;
    
    const statusColors = {
      issued: "secondary",
      in_progress: "default",
      completed: "success",
      cancelled: "destructive"
    };
    
    const statusLabels = {
      issued: "WO: Open",
      in_progress: "WO: In Progress",
      completed: "WO: Complete",
      cancelled: "WO: Cancelled"
    };
    
    return (
      <Badge variant={statusColors[workOrder.status as keyof typeof statusColors] as any}>
        {statusLabels[workOrder.status as keyof typeof statusLabels]}
      </Badge>
    );
  };

  const fetchInvoice = async (invoiceId: string) => {
    try {
      const { data, error } = await supabase
        .from("invoices_enhanced")
        .select(`
          *,
          invoice_items_enhanced(*)
        `)
        .eq("id", invoiceId)
        .single();

      if (error) throw error;

      if (data) {
        const formattedInvoice: EnhancedInvoice = {
          id: data.id,
          invoiceNumber: data.invoice_number,
          poNumber: data.po_number,
          status: data.status as any,
          issueDate: new Date(data.issue_date),
          dueDate: data.due_date ? new Date(data.due_date) : undefined,
          daysToPayment: data.days_to_payment,
          customerId: data.customer_id,
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          customerPhone: data.customer_phone,
          customerAddress: data.customer_address,
          customerCity: data.customer_city,
          customerProvince: data.customer_province,
          customerPostalCode: data.customer_postal_code,
          subtotal: Number(data.subtotal),
          markupTotal: Number(data.markup_total || 0),
          discount: Number(data.discount || 0),
          discountType: data.discount_type as 'fixed' | 'percentage' | undefined,
          discountAmount: Number(data.discount_amount || 0),
          depositRequest: Number(data.deposit_request || 0),
          depositType: data.deposit_type as 'fixed' | 'percentage' | undefined,
          depositAmount: Number(data.deposit_amount || 0),
          taxRate: Number(data.tax_rate),
          taxAmount: Number(data.tax_amount),
          total: Number(data.total),
          paidAmount: Number(data.paid_amount || 0),
          balance: Number(data.balance || 0),
          serviceAddress: data.service_address,
          serviceCity: data.service_city,
          serviceProvince: data.service_province,
          servicePostalCode: data.service_postal_code,
          acceptOnlinePayments: data.accept_online_payments,
          coverProcessingFee: data.cover_processing_fee,
          contractRequired: data.contract_required,
          contractUrl: data.contract_url,
          contractText: data.contract_text,
          notes: data.notes,
          privateNotes: data.private_notes,
          photos: Array.isArray(data.photos) ? data.photos as any : [],
          attachments: Array.isArray(data.attachments) ? data.attachments as any : [],
          signatures: Array.isArray(data.signatures) ? data.signatures as any : [],
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          items: data.invoice_items_enhanced?.map((item: any) => ({
            id: item.id,
            itemName: item.item_name,
            description: item.description,
            quantity: Number(item.quantity),
            rate: Number(item.rate),
            markup: Number(item.markup || 0),
            markupType: item.markup_type,
            markupAmount: Number(item.markup_amount || 0),
            tax: item.tax,
            amount: Number(item.amount),
            sortOrder: item.sort_order
          })) || []
        };
        setInvoice(formattedInvoice);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to load invoice");
      navigate("/app/invoices");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "sent":
      case "viewed":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEmailSent = () => {
    toast.success("Invoice sent successfully");
    setShowEmailDialog(false);
    
    // Update invoice status to sent
    if (invoice?.status === "draft" && id) {
      supabase
        .from("invoices_enhanced")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", id)
        .then(() => {
          fetchInvoice(id);
        });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Invoice not found</p>
        <Button variant="outline" onClick={() => navigate("/app/invoices")} className="mt-4">
          Back to Invoices
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invoice Adjustments Banner */}
      {adjustments.length > 0 && (
        <InvoiceAdjustmentsBanner
          adjustments={adjustments}
          onApprove={handleApproveAdjustments}
          onReject={handleRejectAdjustments}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/app/invoices")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              Invoice {invoice.invoiceNumber}
              <Badge className={getStatusColor(invoice.status)}>
                {invoice.status}
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              {invoice.customerName} • ${invoice.total.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={() => setShowEmailDialog(true)}>
            <Send className="h-4 w-4 mr-2" />
            Send Invoice
          </Button>
          
          {/* Work Order Actions */}
          <InvoiceWorkOrderActions
            invoice={invoice}
            workOrder={workOrder}
            hasSchedule={hasSchedule}
            onGenerateWorkOrder={handleGenerateWorkOrder}
            onRefresh={() => {
              fetchWorkOrder(id!);
              fetchAdjustments(id!);
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <FileText className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="scheduling">
            <Calendar className="h-4 w-4 mr-2" />
            Scheduling
          </TabsTrigger>
          <TabsTrigger value="payments">
            <DollarSign className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card className="p-6">
            <div className="grid gap-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="grid gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span> {invoice.customerName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span> {invoice.customerEmail}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span> {invoice.customerPhone}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Address:</span> {invoice.customerAddress}, {invoice.customerCity}, {invoice.customerProvince} {invoice.customerPostalCode}
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div>
                <h3 className="font-semibold mb-3">Invoice Details</h3>
                <div className="grid gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Issue Date:</span> {invoice.issueDate.toLocaleDateString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due Date:</span> {invoice.dueDate?.toLocaleDateString() || "N/A"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">PO Number:</span> {invoice.poNumber || "N/A"}
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <h3 className="font-semibold mb-3">Line Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 text-sm">Item</th>
                        <th className="text-right p-3 text-sm">Qty</th>
                        <th className="text-right p-3 text-sm">Rate</th>
                        <th className="text-right p-3 text-sm">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-3">
                            <div className="font-medium">{item.itemName}</div>
                            {item.description && (
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                            )}
                          </td>
                          <td className="text-right p-3">{item.quantity}</td>
                          <td className="text-right p-3">${item.rate.toFixed(2)}</td>
                          <td className="text-right p-3">${item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax ({invoice.taxRate}%):</span>
                    <span>${invoice.taxAmount.toFixed(2)}</span>
                  </div>
                  {invoice.discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount:</span>
                      <span>-${invoice.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-base border-t pt-2">
                    <span>Total:</span>
                    <span>${invoice.total.toFixed(2)}</span>
                  </div>
                  {invoice.paidAmount > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid:</span>
                        <span>${invoice.paidAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Balance Due:</span>
                        <span>${invoice.balance.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Work Order Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Work Orders</h3>
                  {!workOrder && (
                    <Button 
                      size="sm"
                      variant="default"
                      onClick={handleGenerateWorkOrder}
                      disabled={!hasSchedule}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Wrench className="h-4 w-4 mr-2" />
                      Create Work Order
                    </Button>
                  )}
                </div>
                
                {!workOrder ? (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {hasSchedule ? 
                        "Create a work order to dispatch this job to your field crew. All invoice items will be included in the work order." : 
                        "Please set a schedule (Start/End time) in the Scheduling tab before creating a work order."}
                    </p>
                    {hasSchedule && (
                      <div className="mt-3 text-xs text-muted-foreground">
                        <span className="font-medium">What will be included:</span>
                        <ul className="mt-1 ml-4 list-disc">
                          <li>Customer information and service address</li>
                          <li>All line items from this invoice (without prices)</li>
                          <li>Schedule dates and assigned team</li>
                          <li>Any special notes or instructions</li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={
                            workOrder.status === 'completed' ? 'success' : 
                            workOrder.status === 'in_progress' ? 'default' : 
                            workOrder.status === 'cancelled' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {workOrder.status.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                        </Badge>
                        <span className="text-sm">Work Order Created</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(R.workOrderDetail(workOrder.id))}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Work Order
                      </Button>
                    </div>
                    
                    {adjustments.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          There are pending adjustments from the field crew that need review.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}
            </div>
          </Card>
          
        </TabsContent>

        <TabsContent value="scheduling" className="mt-6">
          <InvoiceSchedulingTab invoice={invoice} />
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Payment History</h3>
            <p className="text-muted-foreground text-sm">Payment tracking coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      {showPreview && (
        <EnhancedInvoicePreview
          invoice={invoice}
          open={showPreview}
          onOpenChange={setShowPreview}
        />
      )}

      {/* Send Email Dialog */}
      {invoice && (
        <SendEmailDialog
          open={showEmailDialog}
          onOpenChange={setShowEmailDialog}
          template="invoice"
          documentData={{
            id: invoice.id || '',
            number: invoice.invoiceNumber,
            token: '',
            customerName: invoice.customerName,
            customerEmail: invoice.customerEmail,
            subtotal: invoice.subtotal,
            tax: invoice.taxAmount,
            total: invoice.total,
            balance: invoice.balance,
            issueDate: invoice.issueDate.toISOString(),
            dueDate: invoice.dueDate?.toISOString(),
            serviceAddress: invoice.serviceAddress
          }}
          companyData={{
            name: 'FireBuild.ai',
            email: 'billing@firebuildai.com'
          }}
          onSent={handleEmailSent}
        />
      )}
      
      {/* Work Order Modals */}
      {showCrewLinkModal && workOrder && (
        <CreateCrewLinkButton 
          workOrderId={workOrder.id}
          trigger={false}
          onClose={() => setShowCrewLinkModal(false)}
        />
      )}
      
      {showPrintSheet && workOrder && workOrderItems && (
        <WorkOrderPrintSheet
          workOrder={workOrder}
          items={workOrderItems}
          crewUrl=""
        />
      )}

      {/* Scheduling Modal (shows after deposit payment) */}
      {invoice && (
        <InvoiceSchedulingModal
          open={showSchedulingModal}
          onOpenChange={setShowSchedulingModal}
          invoice={invoice}
          onScheduleComplete={() => {
            setHasSchedule(true);
            fetchInvoice(id!);
          }}
        />
      )}
    </div>
  );
}