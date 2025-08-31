import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, FileText, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { PurchaseOrderForm } from "@/components/purchasing/PurchaseOrderForm";
import { PurchaseOrderList } from "@/components/purchasing/PurchaseOrderList";
import { RecordPaymentDialog } from "@/components/po/RecordPaymentDialog";
import { useConfirm } from "@/hooks/useConfirm";
import { notify } from "@/lib/notify";

interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_name: string;
  vendor_email?: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  expected_delivery?: string;
  notes?: string;
  invoice_id?: string;
  category?: string;
  payment_status?: string;
  paid_amount?: number;
  created_at: string;
  updated_at: string;
}

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPoForPayment, setSelectedPoForPayment] = useState<PurchaseOrder | null>(null);
  const { confirm, Confirm } = useConfirm();

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchaseOrders(data || []);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      toast({
        title: "Error",
        description: "Failed to load purchase orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePO = () => {
    setMode('create');
    setSelectedPO(null);
    setShowForm(true);
  };

  const handleEditPO = (po: PurchaseOrder) => {
    setMode('edit');
    setSelectedPO(po);
    setShowForm(true);
  };

  const handleDeletePO = async (id: string) => {
    const shouldDelete = await confirm({
      title: 'Delete Purchase Order?',
      description: 'This action cannot be undone.',
      actionText: 'Delete',
    });
    
    if (!shouldDelete) return;
    
    try {
      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Purchase order deleted successfully",
      });
      fetchPurchaseOrders();
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      toast({
        title: "Error",
        description: "Failed to delete purchase order",
        variant: "destructive",
      });
    }
  };

  const handleSavePO = async () => {
    await fetchPurchaseOrders();
    setShowForm(false);
  };

  const handleRecordPayment = (po: PurchaseOrder) => {
    setSelectedPoForPayment(po);
    setPaymentDialogOpen(true);
  };

  // Calculate summary statistics
  const totalPOs = purchaseOrders.length;
  const totalAmount = purchaseOrders.reduce((sum, po) => sum + Number(po.total), 0);
  const pendingPOs = purchaseOrders.filter(po => po.status === 'pending').length;
  const totalPaid = purchaseOrders.reduce((sum, po) => sum + Number(po.paid_amount || 0), 0);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading purchase orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {Confirm}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <Button onClick={handleCreatePO}>
          <Plus className="mr-2 h-4 w-4" /> Create Purchase Order
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total POs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPOs}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPOs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Orders List */}
      <PurchaseOrderList
        purchaseOrders={purchaseOrders}
        onEdit={handleEditPO}
        onDelete={handleDeletePO}
        onRecordPayment={handleRecordPayment}
      />

      {selectedPoForPayment && (
        <RecordPaymentDialog
          poId={selectedPoForPayment.id}
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          outstanding={(selectedPoForPayment.total || 0) - (selectedPoForPayment.paid_amount || 0)}
          onDone={fetchPurchaseOrders}
        />
      )}

      {/* Form Modal */}
      {showForm && (
        <PurchaseOrderForm
          open={showForm}
          onOpenChange={setShowForm}
          purchaseOrder={selectedPO}
          mode={mode}
          onSave={handleSavePO}
        />
      )}
    </div>
  );
}