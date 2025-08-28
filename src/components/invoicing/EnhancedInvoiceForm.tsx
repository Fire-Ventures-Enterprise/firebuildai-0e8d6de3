import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CalendarIcon, Plus, Trash2, UserPlus, Upload, Camera, 
  FileText, DollarSign, Percent, X, GripVertical 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EnhancedInvoice, EnhancedInvoiceItem, PaymentScheduleItem } from "@/types/enhanced-invoice";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AddCustomerDialog } from "@/components/shared/AddCustomerDialog";
import { useToast } from "@/hooks/use-toast";

interface EnhancedInvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: EnhancedInvoice;
  mode: 'create' | 'edit';
  onSave: (data: EnhancedInvoice) => void;
}

export const EnhancedInvoiceForm = ({ 
  open, 
  onOpenChange, 
  invoice, 
  mode, 
  onSave 
}: EnhancedInvoiceFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState<EnhancedInvoice>({
    invoiceNumber: '',
    poNumber: '',
    status: 'draft',
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    daysToPayment: 30,
    customerId: '',
    items: [{
      itemName: '',
      description: '',
      quantity: 1,
      rate: 0,
      markup: 0,
      markupType: 'percentage',
      tax: true,
      amount: 0
    }],
    subtotal: 0,
    markupTotal: 0,
    discount: 0,
    discountType: 'percentage',
    depositRequest: 0,
    depositType: 'percentage',
    taxRate: 13,
    taxAmount: 0,
    total: 0,
    balance: 0,
    paymentSchedule: [],
    acceptOnlinePayments: true,
    coverProcessingFee: false,
    contractRequired: true,
    notes: '',
    privateNotes: '',
    photos: [],
    attachments: []
  });

  const [customers, setCustomers] = useState<any[]>([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('items');
  const [paymentScheduleMode, setPaymentScheduleMode] = useState<'percentage' | 'fixed'>('percentage');

  // Fetch customers
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

  // Generate invoice number
  const generateInvoiceNumber = async () => {
    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact' })
      .eq('user_id', user?.id);
    
    const nextNumber = (count || 0) + 1;
    setFormData(prev => ({ ...prev, invoiceNumber: `INV-${String(nextNumber).padStart(5, '0')}` }));
  };

  // Initialize form
  useEffect(() => {
    if (mode === 'create' && open) {
      generateInvoiceNumber();
    } else if (mode === 'edit' && invoice) {
      setFormData(invoice);
    }
  }, [mode, invoice, open]);

  // Update selected customer
  useEffect(() => {
    if (formData.customerId && customers.length > 0) {
      const customer = customers.find(c => c.id === formData.customerId);
      if (customer) {
        setSelectedCustomer(customer);
        setFormData(prev => ({
          ...prev,
          customerName: customer.company_name || `${customer.first_name} ${customer.last_name}`,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerAddress: customer.address,
          customerCity: customer.city,
          customerProvince: customer.province,
          customerPostalCode: customer.postal_code
        }));
      }
    }
  }, [formData.customerId, customers]);

  // Line item functions
  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        itemName: '',
        description: '',
        quantity: 1,
        rate: 0,
        markup: 0,
        markupType: 'percentage',
        tax: true,
        amount: 0
      }]
    }));
  };

  const removeLineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateLineItem = (index: number, field: keyof EnhancedInvoiceItem, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Calculate line item amount
      const item = newItems[index];
      const baseAmount = item.quantity * item.rate;
      
      // Calculate markup
      if (item.markup && item.markup > 0) {
        if (item.markupType === 'percentage') {
          item.markupAmount = baseAmount * (item.markup / 100);
        } else {
          item.markupAmount = item.markup;
        }
      } else {
        item.markupAmount = 0;
      }
      
      item.amount = baseAmount + (item.markupAmount || 0);
      
      return { ...prev, items: newItems };
    });
  };

  // Payment schedule functions
  const addPaymentSchedule = () => {
    setFormData(prev => ({
      ...prev,
      paymentSchedule: [...(prev.paymentSchedule || []), {
        description: '',
        amount: 0,
        percentage: 0,
        dueDate: new Date(),
        status: 'pending'
      }]
    }));
  };

  const removePaymentSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      paymentSchedule: prev.paymentSchedule?.filter((_, i) => i !== index)
    }));
  };

  const updatePaymentSchedule = (index: number, field: keyof PaymentScheduleItem, value: any) => {
    setFormData(prev => {
      const schedules = [...(prev.paymentSchedule || [])];
      schedules[index] = { ...schedules[index], [field]: value };
      return { ...prev, paymentSchedule: schedules };
    });
  };

  // Calculate totals
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const markupTotal = formData.items.reduce((sum, item) => sum + (item.markupAmount || 0), 0);
    
    let discountAmount = 0;
    if (formData.discount && formData.discount > 0) {
      if (formData.discountType === 'percentage') {
        discountAmount = (subtotal + markupTotal) * (formData.discount / 100);
      } else {
        discountAmount = formData.discount;
      }
    }

    let depositAmount = 0;
    if (formData.depositRequest && formData.depositRequest > 0) {
      if (formData.depositType === 'percentage') {
        depositAmount = (subtotal + markupTotal - discountAmount) * (formData.depositRequest / 100);
      } else {
        depositAmount = formData.depositRequest;
      }
    }

    const taxableAmount = formData.items
      .filter(item => item.tax)
      .reduce((sum, item) => sum + item.amount, 0) - discountAmount;
    
    const taxAmount = taxableAmount * (formData.taxRate / 100);
    const total = subtotal + markupTotal - discountAmount + taxAmount;
    const balance = total - (formData.paidAmount || 0);

    setFormData(prev => ({
      ...prev,
      subtotal,
      markupTotal,
      discountAmount,
      depositAmount,
      taxAmount,
      total,
      balance
    }));
  }, [formData.items, formData.discount, formData.discountType, formData.depositRequest, formData.depositType, formData.taxRate, formData.paidAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Invoice' : `Edit Invoice ${formData.invoiceNumber}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="contract">Contract</TabsTrigger>
              <TabsTrigger value="media">Photos & Docs</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-6">
                {/* Company Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>From</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>

                {/* Customer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bill To</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Customer</Label>
                        <div className="flex gap-2">
                          <Select 
                            value={formData.customerId}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                          >
                            <SelectTrigger className="flex-1">
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
                      </div>

                      {selectedCustomer && (
                        <div className="text-sm space-y-1 p-3 bg-muted/50 rounded">
                          <p className="font-medium">{selectedCustomer.company_name || `${selectedCustomer.first_name} ${selectedCustomer.last_name}`}</p>
                          {selectedCustomer.email && <p>{selectedCustomer.email}</p>}
                          {selectedCustomer.phone && <p>{selectedCustomer.phone}</p>}
                          {selectedCustomer.address && <p>{selectedCustomer.address}</p>}
                          {selectedCustomer.city && (
                            <p>{selectedCustomer.city}, {selectedCustomer.province} {selectedCustomer.postal_code}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Invoice Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label>Invoice Number</Label>
                      <Input
                        value={formData.invoiceNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label>PO Number</Label>
                      <Input
                        value={formData.poNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, poNumber: e.target.value }))}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <Label>Issue Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(formData.issueDate, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.issueDate}
                            onSelect={(date) => date && setFormData(prev => ({ ...prev, issueDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Days to Pay</Label>
                      <Input
                        type="number"
                        value={formData.daysToPayment}
                        onChange={(e) => {
                          const days = parseInt(e.target.value) || 30;
                          const dueDate = new Date(formData.issueDate);
                          dueDate.setDate(dueDate.getDate() + days);
                          setFormData(prev => ({ ...prev, daysToPayment: days, dueDate }));
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Line Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Line Items</CardTitle>
                </CardHeader>
                <CardContent>
              <div className="space-y-4">
                {/* Header */}
                <div className="grid grid-cols-8 gap-2 font-semibold text-sm pb-2 border-b">
                  <div className="col-span-2">Item</div>
                  <div className="col-span-1">Qty</div>
                  <div className="col-span-1">Rate</div>
                  <div className="col-span-1">Markup</div>
                  <div className="col-span-1">Tax</div>
                  <div className="col-span-1">Total</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Items */}
                {formData.items.map((item, index) => (
                  <div key={index} className="space-y-2 pb-4 border-b">
                    {/* First row - Item details */}
                    <div className="grid grid-cols-8 gap-2 items-center">
                      <div className="col-span-2">
                        <Input
                          placeholder="Item name"
                          value={item.itemName}
                          onChange={(e) => updateLineItem(index, 'itemName', e.target.value)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          placeholder="$0.00"
                        />
                      </div>
                      <div className="col-span-1">
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            value={item.markup}
                            onChange={(e) => updateLineItem(index, 'markup', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            className="w-16"
                          />
                          <Select
                            value={item.markupType}
                            onValueChange={(value: 'percentage' | 'fixed') => updateLineItem(index, 'markupType', value)}
                          >
                            <SelectTrigger className="w-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">%</SelectItem>
                              <SelectItem value="fixed">$</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <Checkbox
                          checked={item.tax}
                          onCheckedChange={(checked) => updateLineItem(index, 'tax', checked)}
                        />
                      </div>
                      <div className="col-span-1 flex items-center">
                        <span className="font-medium">${item.amount.toFixed(2)}</span>
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLineItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Second row - Description (full width) */}
                    <div className="grid grid-cols-8 gap-2">
                      <div className="col-span-7">
                        <Textarea
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addLineItem}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line Item
                </Button>
              </div>
                </CardContent>
              </Card>

              {/* Totals */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2 max-w-sm ml-auto">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">${formData.subtotal.toFixed(2)}</span>
                    </div>
                    {formData.markupTotal > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Markup:</span>
                        <span className="font-medium">+${formData.markupTotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span>Discount:</span>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="number"
                          value={formData.discount}
                          onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                          className="w-20"
                          min="0"
                          step="0.01"
                        />
                        <Select
                          value={formData.discountType}
                          onValueChange={(value: 'percentage' | 'fixed') => setFormData(prev => ({ ...prev, discountType: value }))}
                        >
                          <SelectTrigger className="w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">%</SelectItem>
                            <SelectItem value="fixed">$</SelectItem>
                          </SelectContent>
                        </Select>
                        {formData.discountAmount > 0 && (
                          <span className="text-red-600 font-medium">-${formData.discountAmount.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({formData.taxRate}%):</span>
                      <span className="font-medium">${formData.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span>${formData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              {/* Deposit Request */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Deposit Request</CardTitle>
                    <Switch
                      checked={!!formData.depositRequest}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          setFormData(prev => ({
                            ...prev,
                            depositRequest: 0,
                            depositType: undefined,
                            depositAmount: 0
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            depositRequest: 25,
                            depositType: 'percentage',
                            depositAmount: (prev.total * 0.25)
                          }));
                        }
                      }}
                    />
                  </div>
                </CardHeader>
                {!!formData.depositRequest && (
                  <CardContent>
                    <div className="space-y-4">
                      <ToggleGroup
                        type="single"
                        value={formData.depositType || 'percentage'}
                        onValueChange={(value) => {
                          if (value) {
                            const newType = value as 'percentage' | 'fixed';
                            setFormData(prev => ({
                              ...prev,
                              depositType: newType,
                              depositRequest: newType === 'percentage' ? 25 : prev.depositAmount || 0,
                              depositAmount: newType === 'percentage' 
                                ? (prev.total * 0.25) 
                                : prev.depositAmount || 0
                            }));
                          }
                        }}
                        className="justify-start"
                      >
                        <ToggleGroupItem value="percentage" aria-label="Percentage">
                          <Percent className="h-4 w-4 mr-2" />
                          Percentage
                        </ToggleGroupItem>
                        <ToggleGroupItem value="fixed" aria-label="Fixed Amount">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Fixed Amount
                        </ToggleGroupItem>
                      </ToggleGroup>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>
                            {formData.depositType === 'percentage' ? 'Percentage' : 'Amount'}
                          </Label>
                          <div className="flex items-center gap-2">
                            {formData.depositType === 'percentage' && (
                              <span className="text-muted-foreground">%</span>
                            )}
                            <Input
                              type="number"
                              value={formData.depositRequest || ''}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setFormData(prev => ({
                                  ...prev,
                                  depositRequest: value,
                                  depositAmount: prev.depositType === 'percentage'
                                    ? (prev.total * (value / 100))
                                    : value
                                }));
                              }}
                              placeholder={formData.depositType === 'percentage' ? "25" : "0.00"}
                              min="0"
                              max={formData.depositType === 'percentage' ? "100" : undefined}
                              step="0.01"
                            />
                            {formData.depositType === 'fixed' && (
                              <span className="text-muted-foreground">$</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <Label>Deposit Amount</Label>
                          <div className="p-2 bg-muted rounded-md">
                            <span className="font-semibold">
                              ${(formData.depositAmount || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Payment Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Payment Method Toggle */}
                    {formData.paymentSchedule && formData.paymentSchedule.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Label>Payment Method:</Label>
                        <ToggleGroup 
                          type="single" 
                          value={paymentScheduleMode} 
                          onValueChange={(value) => value && setPaymentScheduleMode(value as 'percentage' | 'fixed')}
                        >
                          <ToggleGroupItem value="percentage" aria-label="Percentage">
                            <Percent className="h-4 w-4 mr-2" />
                            Percentage
                          </ToggleGroupItem>
                          <ToggleGroupItem value="fixed" aria-label="Fixed Amount">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Fixed Amount
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    )}
                    
                    {formData.paymentSchedule?.map((schedule, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 items-end">
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={schedule.description}
                            onChange={(e) => updatePaymentSchedule(index, 'description', e.target.value)}
                            placeholder="Milestone"
                          />
                        </div>
                        {paymentScheduleMode === 'percentage' ? (
                          <div>
                            <Label>Percentage (%)</Label>
                            <Input
                              type="number"
                              value={schedule.percentage}
                              onChange={(e) => {
                                const percentage = parseFloat(e.target.value) || 0;
                                updatePaymentSchedule(index, 'percentage', percentage);
                                updatePaymentSchedule(index, 'amount', formData.total * (percentage / 100));
                              }}
                              min="0"
                              max="100"
                              step="0.01"
                            />
                          </div>
                        ) : (
                          <div>
                            <Label>Amount ($)</Label>
                            <Input
                              type="number"
                              value={schedule.amount}
                              onChange={(e) => {
                                const amount = parseFloat(e.target.value) || 0;
                                updatePaymentSchedule(index, 'amount', amount);
                                updatePaymentSchedule(index, 'percentage', formData.total > 0 ? (amount / formData.total) * 100 : 0);
                              }}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        )}
                        <div>
                          <Label>Due Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {schedule.dueDate ? format(schedule.dueDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={schedule.dueDate}
                                onSelect={(date) => date && updatePaymentSchedule(index, 'dueDate', date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePaymentSchedule(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addPaymentSchedule}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Online Payments */}
              <Card>
                <CardHeader>
                  <CardTitle>Online Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="accept-online">Accept Credit Cards and PayPal</Label>
                      <Switch
                        id="accept-online"
                        checked={formData.acceptOnlinePayments}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptOnlinePayments: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cover-fee">Cover Payment Processing Fee</Label>
                      <Switch
                        id="cover-fee"
                        checked={formData.coverProcessingFee}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, coverProcessingFee: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contract" className="space-y-6">
              {/* Contract Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Contract</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="contract-required">Require Contract Acceptance</Label>
                      <Switch
                        id="contract-required"
                        checked={formData.contractRequired}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, contractRequired: checked }))}
                      />
                    </div>
                    {formData.contractRequired && (
                      <div>
                        <Label>Contract Text</Label>
                        <Textarea
                          value={formData.contractText}
                          onChange={(e) => setFormData(prev => ({ ...prev, contractText: e.target.value }))}
                          placeholder="Enter contract terms and conditions..."
                          rows={10}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Electronic Signatures */}
              <Card>
                <CardHeader>
                  <CardTitle>Electronic Signatures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Require Client Signature</Label>
                      <Switch
                        checked={formData.signatures?.some(s => s.type === 'client')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({
                              ...prev,
                              signatures: [...(prev.signatures || []), { type: 'client', name: '' }]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              signatures: prev.signatures?.filter(s => s.type !== 'client')
                            }));
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Require Company Signature</Label>
                      <Switch
                        checked={formData.signatures?.some(s => s.type === 'company')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({
                              ...prev,
                              signatures: [...(prev.signatures || []), { type: 'company', name: '' }]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              signatures: prev.signatures?.filter(s => s.type !== 'company')
                            }));
                          }
                        }}
                      />
                    </div>

                    {formData.signatures && formData.signatures.length > 0 && (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Signatures will be collected when the invoice is sent to the customer.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              {/* Photos */}
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {formData.photos?.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img src={photo.url} alt={photo.caption} className="w-full h-32 object-cover rounded" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              photos: prev.photos?.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="h-32 flex flex-col items-center justify-center"
                      onClick={() => {
                        // TODO: Implement photo upload
                        toast({
                          title: "Coming Soon",
                          description: "Photo upload functionality will be available soon",
                        });
                      }}
                    >
                      <Camera className="h-8 w-8 mb-2" />
                      <span>Add Photo</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {formData.attachments?.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{attachment.name}</span>
                          <span className="text-sm text-muted-foreground">({(attachment.size / 1024).toFixed(2)} KB)</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              attachments: prev.attachments?.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        // TODO: Implement file upload
                        toast({
                          title: "Coming Soon",
                          description: "File upload functionality will be available soon",
                        });
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Public Notes (visible to customer)</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Notes that will appear on the invoice..."
                        rows={6}
                      />
                    </div>
                    <div>
                      <Label>Private Notes (internal only)</Label>
                      <Textarea
                        value={formData.privateNotes}
                        onChange={(e) => setFormData(prev => ({ ...prev, privateNotes: e.target.value }))}
                        placeholder="Private notes for internal use only..."
                        rows={6}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Invoice' : 'Save Changes'}
            </Button>
          </div>
        </form>

        <AddCustomerDialog
          open={showAddCustomer}
          onOpenChange={setShowAddCustomer}
          onCustomerCreated={(customer) => {
            setCustomers([...customers, customer]);
            // Set all customer fields when a new customer is created
            setFormData(prev => ({ 
              ...prev, 
              customerId: customer.id,
              customerName: customer.company_name || `${customer.first_name} ${customer.last_name}`,
              customerEmail: customer.email || '',
              customerPhone: customer.phone || '',
              customerAddress: customer.address || '',
              customerCity: customer.city || '',
              customerProvince: customer.province || 'Ontario',
              customerPostalCode: customer.postal_code || ''
            }));
            setSelectedCustomer(customer);
            fetchCustomers();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};