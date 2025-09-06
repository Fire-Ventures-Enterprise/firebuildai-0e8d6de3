import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarIcon, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Invoice, InvoiceItem, InvoiceStatus, CreateInvoiceRequest } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AddCustomerDialog } from "@/components/shared/AddCustomerDialog";
import { DraggableInvoiceItems } from "./DraggableInvoiceItems";

interface InvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice;
  mode: 'create' | 'edit';
  onSave: (data: CreateInvoiceRequest) => void;
}

export const InvoiceForm = ({ open, onOpenChange, invoice, mode, onSave }: InvoiceFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateInvoiceRequest>({
    invoiceNumber: '',
    customerId: '',
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    taxRate: 13, // Default HST in Ontario
    notes: '',
    termsConditions: 'Payment is due within 30 days.\nPlease include invoice number with payment.'
  });

  const [customers, setCustomers] = useState<any[]>([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Fetch customers when dialog opens
  useEffect(() => {
    if (open && user) {
      fetchCustomers();
    }
  }, [open, user]);

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user?.id)
      .order('company_name', { ascending: true });
    
    if (!error && data) {
      setCustomers(data);
    }
  };

  useEffect(() => {
    if (invoice && mode === 'edit') {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
        issueDate: new Date(invoice.issueDate),
        dueDate: new Date(invoice.dueDate),
        items: invoice.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        })),
        taxRate: invoice.taxRate,
        notes: invoice.notes || '',
        termsConditions: invoice.termsConditions || ''
      });
    } else if (mode === 'create') {
      // Generate new invoice number
      generateInvoiceNumber();
      setFormData(prev => ({
        ...prev,
        customerId: '',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
        taxRate: 13,
        notes: '',
        termsConditions: 'Payment is due within 30 days.\nPlease include invoice number with payment.'
      }));
    }
  }, [invoice, mode, open]);

  const generateInvoiceNumber = async () => {
    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact' })
      .eq('user_id', user?.id);
    
    const nextNumber = (count || 0) + 1;
    setFormData(prev => ({ ...prev, invoiceNumber: `INV-${String(nextNumber).padStart(5, '0')}` }));
  };

  // Update selected customer details when selection changes
  useEffect(() => {
    if (formData.customerId && customers.length > 0) {
      const customer = customers.find(c => c.id === formData.customerId);
      setSelectedCustomer(customer);
    }
  }, [formData.customerId, customers]);

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeLineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateLineItem = (index: number, field: keyof InvoiceItem, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Calculate amount if quantity or rate changes
      if (field === 'quantity' || field === 'rate') {
        newItems[index].amount = newItems[index].quantity * newItems[index].rate;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (formData.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Invoice' : `Edit Invoice #${formData.invoiceNumber}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Section */}
          <div className="grid grid-cols-2 gap-8">
            {/* Company Info */}
            <div>
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4">
                FB
              </div>
              <h3 className="font-bold text-xl">FIREBUILD.AI</h3>
              <p className="text-sm text-muted-foreground">CONSTRUCTION</p>
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                <p>29 Birchbank Crescent</p>
                <p>Kanata, Ontario K2M 2J9</p>
                <p>Canada</p>
                <p>firebuildai@gmail.com</p>
                <p>Tax #: 789571296RT0001</p>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h4 className="font-semibold mb-3">Bill To</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select 
                    value={formData.customerId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                  >
                    <SelectTrigger className="w-60">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.company_name || `${customer.first_name} ${customer.last_name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowAddCustomer(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Display selected customer info */}
                {selectedCustomer && (
                  <div className="text-sm text-muted-foreground mt-2 space-y-1 p-3 bg-muted/50 rounded">
                    <p className="font-medium text-foreground">
                      {selectedCustomer.company_name || `${selectedCustomer.first_name} ${selectedCustomer.last_name}`}
                    </p>
                    {selectedCustomer.email && <p>{selectedCustomer.email}</p>}
                    {selectedCustomer.phone && <p>{selectedCustomer.phone}</p>}
                    {selectedCustomer.address && <p>{selectedCustomer.address}</p>}
                    {selectedCustomer.city && (
                      <p>{selectedCustomer.city}, {selectedCustomer.province} {selectedCustomer.postal_code}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-3 gap-4 border-t pt-4">
            <div>
              <label className="text-sm font-medium">Invoice Number</label>
              <Input
                value={formData.invoiceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Issue Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full mt-1 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.issueDate, "MMM dd, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.issueDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, issueDate: date || new Date() }))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full mt-1 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.dueDate, "MMM dd, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date || new Date() }))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Line Items */}
          <DraggableInvoiceItems
            items={formData.items}
            onItemsChange={(items) => setFormData(prev => ({ ...prev, items }))}
            onItemUpdate={updateLineItem}
            onAddItem={addLineItem}
            onRemoveItem={removeLineItem}
          />

          {/* Notes */}
          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="text-sm font-medium">Terms & Conditions</label>
            <Textarea
              value={formData.termsConditions}
              onChange={(e) => setFormData(prev => ({ ...prev, termsConditions: e.target.value }))}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Financial Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax ({formData.taxRate}%)</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {mode === 'create' ? 'Create Invoice' : 'Save Changes'}
            </Button>
          </div>
        </form>

        <AddCustomerDialog
          open={showAddCustomer}
          onOpenChange={setShowAddCustomer}
          onCustomerCreated={(customer) => {
            setCustomers([...customers, customer]);
            setFormData(prev => ({ ...prev, customerId: customer.id }));
            fetchCustomers(); // Refresh the list
          }}
        />
      </DialogContent>
    </Dialog>
  );
};