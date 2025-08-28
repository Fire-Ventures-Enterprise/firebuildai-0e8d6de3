// Invoices Page - Manage invoices and billing
import { useState, useEffect } from "react";
import { EnhancedInvoiceForm } from "@/components/invoicing/EnhancedInvoiceForm";
import { EnhancedInvoiceList } from "@/components/invoicing/EnhancedInvoiceList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, Clock, DollarSign, CheckCircle, Send, Mail } from "lucide-react";
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');
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
        const formattedInvoices = data.map(inv => ({
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
          acceptOnlinePayments: inv.accept_online_payments,
          coverProcessingFee: inv.cover_processing_fee,
          contractRequired: inv.contract_required,
          contractUrl: inv.contract_url,
          contractText: inv.contract_text,
          notes: inv.notes,
          privateNotes: inv.private_notes,
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
        }) as EnhancedInvoice);
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
    total: invoices.length,
    pending: invoices.filter(i => i.status === 'sent' || i.status === 'viewed').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    totalValue: invoices.reduce((sum, i) => sum + i.total, 0),
  };

  // Filter invoices based on status
  const filteredInvoices = statusFilter === 'all' 
    ? invoices 
    : statusFilter === 'pending' 
    ? invoices.filter(i => i.status === 'sent' || i.status === 'viewed' || i.status === 'draft')
    : invoices.filter(i => i.status === 'paid');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage billing and payments</p>
        </div>
        <Button onClick={handleCreateInvoice}>
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className={`p-4 cursor-pointer transition-all hover:shadow-lg ${statusFilter === 'all' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-semibold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card 
          className={`p-4 cursor-pointer transition-all hover:shadow-lg ${statusFilter === 'pending' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setStatusFilter('pending')}
        >
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card 
          className={`p-4 cursor-pointer transition-all hover:shadow-lg ${statusFilter === 'paid' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setStatusFilter('paid')}
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-semibold">{stats.paid}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-semibold">${stats.totalValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Indicator */}
      {statusFilter !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Showing {statusFilter === 'pending' ? 'pending' : 'paid'} invoices
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Clear filter
          </Button>
        </div>
      )}

      {/* Invoices List */}
      {filteredInvoices.length > 0 ? (
        <EnhancedInvoiceList 
          invoices={filteredInvoices} 
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
          onRefresh={fetchInvoices}
        />
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
            <p className="text-muted-foreground mb-4">Create your first invoice to get started</p>
            <Button onClick={handleCreateInvoice}>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </Card>
      )}

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