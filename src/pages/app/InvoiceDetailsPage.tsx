import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceSchedulingTab } from "@/components/sales/InvoiceSchedulingTab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedInvoice } from "@/types/enhanced-invoice";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ArrowLeft, FileText, DollarSign, Clock, Mail, Download, Calendar, Send } from "lucide-react";
import { R } from "@/routes/routeMap";
import { EnhancedInvoicePreview } from "@/components/invoicing/EnhancedInvoicePreview";
import InvoiceLockControl from "@/components/invoicing/InvoiceLockControl";
import { SendEmailDialog } from "@/components/shared/SendEmailDialog";

export function InvoiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<EnhancedInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id]);

  const fetchInvoice = async (invoiceId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      const { data, error } = await supabase
        .from('invoices_enhanced')
        .select(`
          *,
          invoice_items_enhanced(*),
          invoice_payments(*)
        `)
        .eq('id', invoiceId)
        .eq('user_id', session.session.user.id)
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
          discountType: data.discount_type as 'fixed' | 'percentage',
          discountAmount: Number(data.discount_amount || 0),
          depositRequest: Number(data.deposit_request || 0),
          depositType: data.deposit_type as 'fixed' | 'percentage',
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
      console.error('Error fetching invoice:', error);
      toast({
        title: "Error",
        description: "Failed to load invoice details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      draft: { variant: "secondary", icon: <FileText className="w-3 h-3" /> },
      sent: { variant: "default", icon: <Send className="w-3 h-3" /> },
      viewed: { variant: "default", icon: <Mail className="w-3 h-3" /> },
      paid: { variant: "success", icon: <DollarSign className="w-3 h-3" /> },
      overdue: { variant: "destructive", icon: <Clock className="w-3 h-3" /> },
      cancelled: { variant: "secondary", icon: <FileText className="w-3 h-3" /> }
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <Badge variant={config.variant as any}>
        <span className="flex items-center gap-1">
          {config.icon}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading invoice...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-muted-foreground">Invoice not found</div>
        <Button onClick={() => navigate(R.invoices)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(R.invoices)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Invoice {invoice.invoiceNumber}</h1>
              {getStatusBadge(invoice.status)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Created {format(invoice.createdAt, "PPP")}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={() => setShowSendDialog(true)}
            disabled={!invoice.customerEmail}
          >
            <Mail className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div>

      {/* Key Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{invoice.customerName}</p>
            {invoice.customerEmail && (
              <p className="text-sm text-muted-foreground">{invoice.customerEmail}</p>
            )}
            {invoice.customerPhone && (
              <p className="text-sm text-muted-foreground">{invoice.customerPhone}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${invoice.total.toFixed(2)}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-muted-foreground">
                Paid: ${invoice.paidAmount.toFixed(2)}
              </span>
              <span className="text-muted-foreground">
                Balance: ${invoice.balance.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Due Date</CardTitle>
          </CardHeader>
          <CardContent>
            {invoice.dueDate ? (
              <>
                <p className="font-semibold">{format(invoice.dueDate, "PPP")}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {invoice.dueDate < new Date() ? 
                    "Overdue" : 
                    `Due in ${Math.ceil((invoice.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                  }
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">No due date set</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="scheduling">
            <Calendar className="w-4 h-4 mr-2" />
            Scheduling
          </TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                  <p className="font-medium">{invoice.invoiceNumber}</p>
                </div>
                {invoice.poNumber && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">PO Number</p>
                    <p className="font-medium">{invoice.poNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{format(invoice.issueDate, "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Service Address</p>
                  <p className="font-medium">
                    {invoice.serviceAddress}<br />
                    {invoice.serviceCity}, {invoice.serviceProvince} {invoice.servicePostalCode}
                  </p>
                </div>
              </div>
              
              {invoice.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{invoice.notes}</p>
                </div>
              )}
              
              {/* Lock Control */}
              <div className="pt-4 border-t">
                <InvoiceLockControl invoice={invoice as any} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              {invoice.items && invoice.items.length > 0 ? (
                <div className="space-y-2">
                  {invoice.items.map((item, index) => (
                    <div key={item.id || index} className="flex justify-between py-2 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{item.itemName}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × ${item.rate.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.amount.toFixed(2)}</p>
                        {item.markup > 0 && (
                          <p className="text-xs text-muted-foreground">
                            +{item.markup}% markup
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    {invoice.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Discount</span>
                        <span>-${invoice.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Tax ({invoice.taxRate}%)</span>
                      <span>${invoice.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total</span>
                      <span>${invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No items added</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduling">
          <InvoiceSchedulingTab invoice={invoice} />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Payment tracking coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Activity tracking coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      {showPreview && invoice && (
        <EnhancedInvoicePreview
          invoice={invoice}
          open={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Send Email Dialog */}
      {showSendDialog && invoice && (
        <SendEmailDialog
          open={showSendDialog}
          onClose={() => setShowSendDialog(false)}
          template="invoice"
          refId={invoice.id!}
          defaultTo={invoice.customerEmail || ""}
          defaultSubject={`Invoice ${invoice.invoiceNumber} from FireBuild.ai`}
        />
      )}
    </div>
  );
}