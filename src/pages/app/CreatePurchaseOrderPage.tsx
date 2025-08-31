import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PurchaseOrderItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function CreatePurchaseOrderPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vendor_name: '',
    vendor_email: '',
    category: 'materials',
    expected_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  });

  const [items, setItems] = useState<PurchaseOrderItem[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    
    // Calculate amount
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.13; // 13% tax
    return {
      subtotal,
      tax,
      total: subtotal + tax,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { subtotal, tax, total } = calculateTotal();
      
      // Generate PO number
      const poNumber = `PO-${Date.now()}`;

      // Create purchase order
      const { data: poData, error: poError } = await supabase
        .from('purchase_orders')
        .insert({
          po_number: poNumber,
          vendor_name: formData.vendor_name,
          vendor_email: formData.vendor_email,
          category: formData.category,
          expected_delivery: formData.expected_delivery,
          notes: formData.notes,
          subtotal,
          tax_amount: tax,
          total,
          status: 'pending',
          user_id: user.id,
        })
        .select()
        .single();

      if (poError) throw poError;

      // Create purchase order items
      const itemsToInsert = items
        .filter(item => item.description && item.amount > 0)
        .map(item => ({
          purchase_order_id: poData.id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        }));

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from('purchase_order_items')
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      toast({
        title: 'Success',
        description: 'Purchase order created successfully',
      });

      navigate('/app/purchase-orders');
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast({
        title: 'Error',
        description: 'Failed to create purchase order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, tax, total } = calculateTotal();

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/app/purchase-orders')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Purchase Orders
          </Button>
          
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            Create Purchase Order
          </h1>
          <p className="text-muted-foreground mt-2">
            Create a new purchase order for materials or services
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* Vendor Information */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Information</CardTitle>
                <CardDescription>
                  Enter the vendor details for this purchase order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor_name">Vendor Name *</Label>
                    <Input
                      id="vendor_name"
                      value={formData.vendor_name}
                      onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                      placeholder="e.g., ABC Supplies Inc."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor_email">Vendor Email</Label>
                    <Input
                      id="vendor_email"
                      type="email"
                      value={formData.vendor_email}
                      onChange={(e) => setFormData({ ...formData, vendor_email: e.target.value })}
                      placeholder="vendor@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="materials">Materials</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="tools">Tools</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expected_delivery">Expected Delivery</Label>
                    <Input
                      id="expected_delivery"
                      type="date"
                      value={formData.expected_delivery}
                      onChange={(e) => setFormData({ ...formData, expected_delivery: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Line Items</CardTitle>
                    <CardDescription>
                      Add the items for this purchase order
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={addItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-5">
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="1"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.amount.toFixed(2)}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 pt-6 border-t space-y-2">
                  <div className="flex justify-end items-center gap-4">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-end items-center gap-4">
                    <span className="text-muted-foreground">Tax (13%):</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-end items-center gap-4 text-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes or instructions..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/app/purchase-orders')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Purchase Order'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}