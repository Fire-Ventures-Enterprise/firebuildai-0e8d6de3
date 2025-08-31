import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

interface PurchaseOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseOrder?: any;
  mode: 'create' | 'edit';
  onSave: () => void;
}

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export function PurchaseOrderForm({
  open,
  onOpenChange,
  purchaseOrder,
  mode,
  onSave,
}: PurchaseOrderFormProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVendors();
    fetchJobs();
    fetchInvoices();
    if (purchaseOrder && mode === 'edit') {
      loadPurchaseOrder();
    }
  }, [mode, purchaseOrder]);

  const fetchVendors = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.user.id)
        .order('company_name', { ascending: true });

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('jobs')
        .select('id, name, customer_name, status')
        .eq('user_id', user.user.id)
        .in('status', ['Not Started', 'In Progress', 'On Hold'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('invoices_enhanced')
        .select('id, invoice_number, customer_name')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const generatePONumber = async () => {
    const timestamp = Date.now();
    const poNumber = `PO-${timestamp}`;
    setValue('po_number', poNumber);
  };

  const loadPurchaseOrder = async () => {
    if (!purchaseOrder) return;

    setValue('po_number', purchaseOrder.po_number);
    setValue('vendor_name', purchaseOrder.vendor_name);
    setValue('vendor_email', purchaseOrder.vendor_email);
    setValue('invoice_id', purchaseOrder.invoice_id);
    setValue('category', purchaseOrder.category);
    setValue('expected_delivery', purchaseOrder.expected_delivery?.split('T')[0]);
    setValue('notes', purchaseOrder.notes);
    setValue('status', purchaseOrder.status);

    // Load line items
    try {
      const { data, error } = await supabase
        .from('purchase_order_items')
        .select('*')
        .eq('purchase_order_id', purchaseOrder.id);

      if (error) throw error;
      if (data && data.length > 0) {
        setLineItems(data.map(item => ({
          description: item.description,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
          amount: Number(item.amount)
        })));
      }
    } catch (error) {
      console.error('Error loading PO items:', error);
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const updatedItems = [...lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }
    
    setLineItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.13; // 13% HST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const poData = {
        po_number: data.po_number,
        vendor_name: data.vendor_name,
        vendor_email: data.vendor_email,
        invoice_id: data.invoice_id || null,
        category: data.category || 'materials',
        status: data.status || 'pending',
        expected_delivery: data.expected_delivery ? `${data.expected_delivery}T00:00:00Z` : null,
        notes: data.notes,
        subtotal: calculateSubtotal(),
        tax_amount: calculateTax(),
        total: calculateTotal(),
        user_id: user.user.id,
      };

      if (mode === 'edit' && purchaseOrder) {
        // Update existing PO
        const { error } = await supabase
          .from('purchase_orders')
          .update(poData)
          .eq('id', purchaseOrder.id);

        if (error) throw error;

        // Delete old items
        await supabase
          .from('purchase_order_items')
          .delete()
          .eq('purchase_order_id', purchaseOrder.id);

        // Insert new items
        const items = lineItems.filter(item => item.description).map(item => ({
          purchase_order_id: purchaseOrder.id,
          ...item
        }));

        if (items.length > 0) {
          const { error: itemsError } = await supabase
            .from('purchase_order_items')
            .insert(items);

          if (itemsError) throw itemsError;
        }
      } else {
        // Create new PO
        const { data: newPO, error } = await supabase
          .from('purchase_orders')
          .insert(poData)
          .select()
          .single();

        if (error) throw error;

        // Insert items
        const items = lineItems.filter(item => item.description).map(item => ({
          purchase_order_id: newPO.id,
          ...item
        }));

        if (items.length > 0) {
          const { error: itemsError } = await supabase
            .from('purchase_order_items')
            .insert(items);

          if (itemsError) throw itemsError;
        }
      }

      toast({
        title: "Success",
        description: `Purchase order ${mode === 'create' ? 'created' : 'updated'} successfully`,
      });

      reset();
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving purchase order:', error);
      toast({
        title: "Error",
        description: `Failed to ${mode === 'create' ? 'create' : 'update'} purchase order`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create' : 'Edit'} Purchase Order
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="po_number">PO Number</Label>
              <Input
                id="po_number"
                {...register('po_number', { required: true })}
                readOnly={mode === 'edit'}
              />
            </div>
            <div>
              <Label htmlFor="invoice_id">Link to Invoice (Optional)</Label>
              <Select
                value={watch('invoice_id') || 'none'}
                onValueChange={(value) => setValue('invoice_id', value === 'none' ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an invoice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {invoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.invoice_number} - {invoice.customer_name || 'No customer'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendor_name">Vendor Name</Label>
              <Input
                id="vendor_name"
                {...register('vendor_name', { required: true })}
                placeholder="Enter vendor name"
              />
            </div>
            <div>
              <Label htmlFor="vendor_email">Vendor Email</Label>
              <Input
                id="vendor_email"
                type="email"
                {...register('vendor_email')}
                placeholder="vendor@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={watch('category') || 'materials'}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="materials">Materials</SelectItem>
                  <SelectItem value="labor">Labor</SelectItem>
                  <SelectItem value="subcontractor">Subcontractor</SelectItem>
                  <SelectItem value="permits">Permits</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status') || 'pending'}
                onValueChange={(value) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expected_delivery">Expected Delivery</Label>
              <Input
                id="expected_delivery"
                type="date"
                {...register('expected_delivery')}
              />
            </div>
          </div>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-sm font-semibold">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Rate</div>
                  <div className="col-span-2">Amount</div>
                </div>
                {lineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2">
                    <Input
                      className="col-span-6"
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                    />
                    <Input
                      className="col-span-2"
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                    />
                    <Input
                      className="col-span-2"
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateLineItem(index, 'rate', Number(e.target.value))}
                    />
                    <div className="col-span-2 flex items-center gap-2">
                      <span className="flex-1">${item.amount.toFixed(2)}</span>
                      {lineItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addLineItem}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Line Item
              </Button>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (13%):</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'} Purchase Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}