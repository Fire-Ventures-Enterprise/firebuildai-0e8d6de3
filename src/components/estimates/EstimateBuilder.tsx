import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus, Trash2, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Estimate, EstimateItem, EstimateStatus, CreateEstimateRequest } from "@/types/estimate";

interface EstimateBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate?: Estimate;
  mode: 'create' | 'edit';
  onSave: (data: CreateEstimateRequest) => void;
  onSaveTemplate?: (name: string, data: CreateEstimateRequest) => void;
}

export const EstimateBuilder = ({ 
  open, 
  onOpenChange, 
  estimate, 
  mode, 
  onSave,
  onSaveTemplate 
}: EstimateBuilderProps) => {
  const [formData, setFormData] = useState<CreateEstimateRequest>({
    estimateNumber: '',
    customerId: '',
    issueDate: new Date(),
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    taxRate: 13, // Default HST in Ontario
    notes: '',
    termsConditions: 'This estimate is valid for 30 days.\nAll prices are subject to change after expiration.'
  });

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  const [templateName, setTemplateName] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);

  useEffect(() => {
    if (estimate && mode === 'edit') {
      setFormData({
        estimateNumber: estimate.estimateNumber,
        customerId: estimate.customerId,
        issueDate: new Date(estimate.issueDate),
        expirationDate: new Date(estimate.expirationDate),
        items: estimate.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        })),
        taxRate: estimate.taxRate,
        notes: estimate.notes || '',
        termsConditions: estimate.termsConditions || ''
      });
    } else if (mode === 'create') {
      setFormData({
        estimateNumber: `EST-${Date.now()}`,
        customerId: '',
        issueDate: new Date(),
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
        taxRate: 13,
        notes: '',
        termsConditions: 'This estimate is valid for 30 days.\nAll prices are subject to change after expiration.'
      });
    }
  }, [estimate, mode, open]);

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

  const updateLineItem = (index: number, field: keyof EstimateItem, value: any) => {
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

  const handleSaveAsTemplate = () => {
    if (templateName && onSaveTemplate) {
      onSaveTemplate(templateName, formData);
      setShowSaveTemplate(false);
      setTemplateName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {mode === 'create' ? 'Create New Estimate' : `Edit Estimate #${formData.estimateNumber}`}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
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
                <p>License #: 123456789</p>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h4 className="font-semibold mb-3">Prepared For</h4>
              <div className="space-y-2">
                <Input
                  placeholder="Customer Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-60"
                  required
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-60"
                />
                <Input
                  placeholder="Phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-60"
                />
                <Input
                  placeholder="Address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  className="w-60"
                />
                <Input
                  placeholder="City, Province"
                  value={customerInfo.city}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
                  className="w-60"
                />
              </div>
            </div>
          </div>

          {/* Estimate Details */}
          <div className="grid grid-cols-3 gap-4 border-t pt-4">
            <div>
              <label className="text-sm font-medium">Estimate Number</label>
              <Input
                value={formData.estimateNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, estimateNumber: e.target.value }))}
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
              <label className="text-sm font-medium">Expiration Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full mt-1 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.expirationDate, "MMM dd, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expirationDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, expirationDate: date || new Date() }))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Scope of Work */}
          <div>
            <label className="text-sm font-medium">Scope of Work</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Describe the scope of work, project details, timeline, etc."
              className="mt-1"
              rows={4}
            />
          </div>

          {/* Line Items */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-center p-3 font-medium w-24">Quantity</th>
                  <th className="text-center p-3 font-medium w-32">Rate</th>
                  <th className="text-right p-3 font-medium w-32">Amount</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">
                      <Input
                        placeholder="Item description (e.g., Kitchen Renovation, Bathroom Remodel)"
                        value={item.description}
                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                        className="border-0 p-0 h-auto"
                        required
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="text-center"
                        required
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                        className="text-center"
                        required
                      />
                    </td>
                    <td className="p-3 text-right font-medium">
                      ${item.amount.toFixed(2)}
                    </td>
                    <td className="p-3">
                      {formData.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 border-t">
              <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Line Item
              </Button>
            </div>
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

          {/* Save as Template Option */}
          {mode === 'create' && onSaveTemplate && (
            <div className="border-t pt-4">
              {!showSaveTemplate ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSaveTemplate(true)}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Template
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Template name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button type="button" onClick={handleSaveAsTemplate}>
                    Save Template
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowSaveTemplate(false);
                      setTemplateName('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {mode === 'create' ? 'Create Estimate' : 'Save Changes'}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};