// Invoices Page - Manage invoices and billing
import { useState, useEffect } from "react";
import { EnhancedInvoiceForm } from "@/components/invoicing/EnhancedInvoiceForm";
import { SimpleInvoiceTable } from "@/components/invoicing/SimpleInvoiceTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, FileText, Clock, DollarSign, CheckCircle, Send, Mail, FileCheck } from "lucide-react";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { EnhancedInvoice } from "@/types/enhanced-invoice";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";

export const InvoicesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [invoices, setInvoices] = useState<EnhancedInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<EnhancedInvoice | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'accepted' | 'paid'>('all');
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch invoices from database
  useEffect(() => {
    fetchInvoices();
    
    // Check for payment verification
    const payment = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    const invoiceId = searchParams.get('invoice');
    
    if (payment === 'success' && sessionId) {
      verifyPayment(sessionId);
    } else if (payment === 'success' && invoiceId) {
      toast({
        title: "Payment Processing",
        description: "Your payment is being processed. The invoice will be updated shortly.",
      });
      // Clear the params
      setSearchParams({});
    } else if (payment === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "The payment was cancelled.",
        variant: "destructive"
      });
      setSearchParams({});
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-invoice-payment', {
        body: { sessionId }
      });
      
      if (error) throw error;
      
      if (data?.status === 'completed') {
        toast({
          title: "Payment Successful",
          description: "The invoice has been paid successfully.",
        });
      } else if (data?.status === 'failed') {
        toast({
          title: "Payment Failed",
          description: "The payment could not be processed.",
          variant: "destructive"
        });
      }
      
      // Refresh invoices to show updated status
      fetchInvoices();
      setSearchParams({});
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast({
        title: "Verification Error",
        description: "Could not verify payment status",
        variant: "destructive"
      });
      setSearchParams({});
    }
  };

  const fetchInvoices = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      const { data, error } = await supabase
        .from('invoices_enhanced')
        .select(`
          *,
          invoice_items_enhanced(*)
        `)
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        const formattedInvoices = data.map(inv => {
          const invoice: any = {
            id: inv.id,
            invoiceNumber: inv.invoice_number,
            poNumber: inv.po_number,
            status: inv.status as 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled',
            issueDate: new Date(inv.issue_date),
            dueDate: inv.due_date ? new Date(inv.due_date) : undefined,
            daysToPayment: inv.days_to_payment,
            customerId: inv.customer_id,
            customerName: inv.customer_name,
            customerEmail: inv.customer_email,
            customerPhone: inv.customer_phone,
            customerAddress: inv.customer_address,
            customerCity: inv.customer_city,
            customerProvince: inv.customer_province,
            customerPostalCode: inv.customer_postal_code,
            subtotal: Number(inv.subtotal),
            markupTotal: Number(inv.markup_total || 0),
            discount: Number(inv.discount || 0),
            discountType: inv.discount_type,
            discountAmount: Number(inv.discount_amount || 0),
            depositRequest: Number(inv.deposit_request || 0),
            depositType: inv.deposit_type,
            depositAmount: Number(inv.deposit_amount || 0),
            taxRate: Number(inv.tax_rate),
            taxAmount: Number(inv.tax_amount),
            total: Number(inv.total),
            paidAmount: Number(inv.paid_amount || 0),
            balance: Number(inv.balance || 0),
            serviceAddress: inv.service_address,
            serviceCity: inv.service_city,
            serviceProvince: inv.service_province,
            servicePostalCode: inv.service_postal_code,
            acceptOnlinePayments: inv.accept_online_payments,
            coverProcessingFee: inv.cover_processing_fee,
            contractRequired: inv.contract_required,
            contractUrl: inv.contract_url,
            contractText: inv.contract_text,
            notes: inv.notes,
            privateNotes: inv.private_notes,
            photos: Array.isArray(inv.photos) ? inv.photos : [],
            attachments: Array.isArray(inv.attachments) ? inv.attachments : [],
            signatures: Array.isArray(inv.signatures) ? inv.signatures : [],
            createdAt: new Date(inv.created_at),
            updatedAt: new Date(inv.updated_at),
            items: inv.invoice_items_enhanced?.map((item: any) => ({
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
          return invoice as EnhancedInvoice;
        });
        setInvoices(formattedInvoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInvoice = async (data: EnhancedInvoice) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to save invoices",
          variant: "destructive"
        });
        return;
      }

      const invoiceData = {
        invoice_number: data.invoiceNumber,
        po_number: data.poNumber,
        status: data.status || 'draft',
        issue_date: data.issueDate.toISOString(),
        due_date: data.dueDate ? data.dueDate.toISOString() : null,
        days_to_payment: data.daysToPayment,
        customer_id: data.customerId,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        customer_address: data.customerAddress,
        customer_city: data.customerCity,
            customer_province: data.customerProvince,
            customer_postal_code: data.customerPostalCode,
            service_address: data.serviceAddress,
            service_city: data.serviceCity,
            service_province: data.serviceProvince,
            service_postal_code: data.servicePostalCode,
        subtotal: data.subtotal,
        markup_total: data.markupTotal,
        discount: data.discount,
        discount_type: data.discountType,
        discount_amount: data.discountAmount,
        deposit_request: data.depositRequest,
        deposit_type: data.depositType,
        deposit_amount: data.depositAmount,
        tax_rate: data.taxRate,
        tax_amount: data.taxAmount,
        total: data.total,
        paid_amount: data.paidAmount,
        balance: data.balance,
        accept_online_payments: data.acceptOnlinePayments,
        cover_processing_fee: data.coverProcessingFee,
        contract_required: data.contractRequired,
        contract_url: data.contractUrl,
        contract_text: data.contractText,
        notes: data.notes,
        private_notes: data.privateNotes,
        photos: JSON.stringify(data.photos || []),
        attachments: JSON.stringify(data.attachments || []),
        signatures: JSON.stringify(data.signatures || []),
        user_id: session.session.user.id
      };

      if (mode === 'edit' && selectedInvoice?.id) {
        // Update existing invoice
        const { error } = await supabase
          .from('invoices_enhanced')
          .update(invoiceData)
          .eq('id', selectedInvoice.id);

        if (error) throw error;

        // Delete existing items and re-insert
        await supabase
          .from('invoice_items_enhanced')
          .delete()
          .eq('invoice_id', selectedInvoice.id);

        // Insert new items
        if (data.items && data.items.length > 0) {
          const items = data.items.map((item, index) => ({
            invoice_id: selectedInvoice.id,
            item_name: item.itemName,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            markup: item.markup,
            markup_type: item.markupType,
            markup_amount: item.markupAmount,
            tax: item.tax,
            amount: item.amount,
            sort_order: index
          }));

          await supabase
            .from('invoice_items_enhanced')
            .insert(items);
        }

        toast({
          title: "Success",
          description: "Invoice updated successfully"
        });
      } else {
        // Create new invoice
        const { data: newInvoice, error } = await supabase
          .from('invoices_enhanced')
          .insert(invoiceData)
          .select()
          .single();

        if (error) throw error;

        // Insert items
        if (newInvoice && data.items && data.items.length > 0) {
          const items = data.items.map((item, index) => ({
            invoice_id: newInvoice.id,
            item_name: item.itemName,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            markup: item.markup,
            markup_type: item.markupType,
            markup_amount: item.markupAmount,
            tax: item.tax,
            amount: item.amount,
            sort_order: index
          }));

          await supabase
            .from('invoice_items_enhanced')
            .insert(items);
        }

        toast({
          title: "Success",
          description: "Invoice created successfully"
        });
      }

      await fetchInvoices();
      setShowForm(false);
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast({
        title: "Error",
        description: "Failed to save invoice",
        variant: "destructive"
      });
    }
  };

  const handleCreateInvoice = () => {
    setMode('create');
    setSelectedInvoice(null);
    setShowForm(true);
  };

  const handleEditInvoice = (invoice: EnhancedInvoice) => {
    setSelectedInvoice(invoice);
    setMode('edit');
    setShowForm(true);
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices_enhanced')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invoice deleted successfully"
      });
      
      await fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive"
      });
    }
  };

  const stats = {
    totalInvoiced: invoices.reduce((sum, i) => sum + i.total, 0),
    totalPaid: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
    outstanding: invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((sum, i) => sum + (i.balance || i.total), 0),
    totalInvoices: invoices.length,
    pending: invoices.filter(i => i.status === 'sent' || i.status === 'viewed' || i.status === 'draft').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    draft: invoices.filter(i => i.status === 'draft').length,
    accepted: invoices.filter(i => 
      i.status !== 'draft' && 
      i.status !== 'paid' && 
      i.depositAmount > 0 && 
      i.paidAmount >= i.depositAmount
    ).length,
  };

  // Filter invoices based on active tab
  const getFilteredInvoices = () => {
    switch(activeTab) {
      case 'draft':
        return invoices.filter(i => i.status === 'draft');
      case 'accepted':
        // Accepted means deposit is paid and ready for scheduling
        return invoices.filter(i => 
          i.status !== 'draft' && 
          i.status !== 'paid' && 
          i.depositAmount > 0 && 
          i.paidAmount >= i.depositAmount
        );
      case 'paid':
        return invoices.filter(i => i.status === 'paid');
      default:
        return invoices;
    }
  };

  const filteredInvoices = getFilteredInvoices();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage client invoices and payments</p>
        </div>
        <Button onClick={handleCreateInvoice} size="default" className="bg-foreground text-background hover:bg-foreground/90">
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Stats Cards - Inspired by Replit's clean design */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Invoiced</p>
              <p className="text-2xl font-bold">${stats.totalInvoiced.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">All time</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-4 h-4 text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Paid</p>
              <p className="text-2xl font-bold text-success">${stats.totalPaid.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Collected</p>
            </div>
            <div className="p-2 bg-success/10 rounded-lg">
              <DollarSign className="w-4 h-4 text-success" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Outstanding</p>
              <p className="text-2xl font-bold text-warning">${stats.outstanding.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">To collect</p>
            </div>
            <div className="p-2 bg-warning/10 rounded-lg">
              <Clock className="w-4 h-4 text-warning" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Invoices</p>
              <p className="text-2xl font-bold">{stats.totalInvoices}</p>
              <p className="text-xs text-muted-foreground">Active invoices</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-4 h-4 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs for filtering invoices */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            All ({stats.totalInvoices})
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Draft ({stats.draft})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Accepted ({stats.accepted})
          </TabsTrigger>
          <TabsTrigger value="paid" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Paid ({stats.paid})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredInvoices.length > 0 ? (
            <SimpleInvoiceTable 
              invoices={filteredInvoices} 
              onEdit={handleEditInvoice}
              onDelete={handleDeleteInvoice}
              onRefresh={fetchInvoices}
            />
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {activeTab === 'draft' && 'No draft invoices'}
                  {activeTab === 'accepted' && 'No accepted invoices'}
                  {activeTab === 'paid' && 'No paid invoices'}
                  {activeTab === 'all' && 'No invoices yet'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'draft' && 'Draft invoices will appear here'}
                  {activeTab === 'accepted' && 'Invoices with paid deposits ready for scheduling will appear here'}
                  {activeTab === 'paid' && 'Fully paid invoices will appear here'}
                  {activeTab === 'all' && 'Create your first invoice to get started'}
                </p>
                {activeTab === 'all' && (
                  <Button onClick={handleCreateInvoice}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                )}
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Invoice Form Modal */}
      {showForm && (
        <EnhancedInvoiceForm
          open={showForm}
          onOpenChange={(open) => {
            setShowForm(open);
            if (!open) {
              setSelectedInvoice(null);
              setMode('create');
            }
          }}
          invoice={selectedInvoice || undefined}
          mode={mode}
          onSave={handleSaveInvoice}
        />
      )}
    </div>
  );
};