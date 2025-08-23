import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EstimateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate?: any;
  mode: 'create' | 'edit';
  onSave: (data: any) => void;
}

export const EstimateDialog = ({ open, onOpenChange, estimate, mode, onSave }: EstimateDialogProps) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    address: '',
    city: '',
    phone: '',
    amount: '',
    date: new Date(),
    expirationDate: new Date(),
    estimateNumber: '',
    description: '',
    workScope: '',
    poNumber: ''
  });

  useEffect(() => {
    if (estimate && mode === 'edit') {
      const parseDate = (dateString: string) => {
        if (!dateString) return new Date();
        const parsed = new Date(dateString);
        return isNaN(parsed.getTime()) ? new Date() : parsed;
      };

      setFormData({
        clientName: estimate.clientName || '',
        clientEmail: estimate.clientEmail || '',
        address: estimate.address || '',
        city: estimate.city || '',
        phone: estimate.phone || '',
        amount: estimate.amount?.toString() || '',
        date: parseDate(estimate.date),
        expirationDate: parseDate(estimate.expirationDate),
        estimateNumber: estimate.estimateNumber || estimate.number || '',
        description: estimate.description || '',
        workScope: estimate.workScope || '',
        poNumber: estimate.poNumber || ''
      });
    } else if (mode === 'create') {
      setFormData({
        clientName: '',
        clientEmail: '',
        address: '',
        city: '',
        phone: '',
        amount: '',
        date: new Date(),
        expirationDate: new Date(),
        estimateNumber: `EST-${Date.now()}`,
        description: '',
        workScope: '',
        poNumber: ''
      });
    }
  }, [estimate, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const updateField = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h1 className="text-xl font-semibold">
            Estimate #{formData.estimateNumber || 'New'}
          </h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              CANCEL
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              SAVE
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Header Section with Company & Client */}
          <div className="flex justify-between items-start mb-6">
            {/* Company Info */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                FB
              </div>
              <div>
                <h3 className="font-bold text-xl">FIREBUILD.AI</h3>
                <p className="text-sm text-muted-foreground mb-2">CONSTRUCTION</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>29 Birchbank Crescent</p>
                  <p>Kanata, Ontario K2M 2J9</p>
                  <p>Canada</p>
                  <p>firebuildai@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Business Tax Number */}
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Business / Tax #</p>
              <p className="text-sm font-medium">789571296RT0001</p>
            </div>
          </div>

          {/* Client Info Fields - Compact like estimate details */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Prepared For</h4>
            <div className="flex flex-wrap gap-4">
              <div className="w-48">
                <label className="text-sm font-medium text-primary">Client Name</label>
                <Input
                  placeholder="Enter client name"
                  value={formData.clientName}
                  onChange={(e) => updateField('clientName', e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
              
              <div className="w-48">
                <label className="text-sm font-medium text-primary">Email</label>
                <Input
                  placeholder="Enter email"
                  value={formData.clientEmail}
                  onChange={(e) => updateField('clientEmail', e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
              
              <div className="w-36">
                <label className="text-sm font-medium text-primary">Phone</label>
                <Input
                  placeholder="Enter phone"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
              
              <div className="w-48">
                <label className="text-sm font-medium text-primary">Address</label>
                <Input
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
              
              <div className="w-48">
                <label className="text-sm font-medium text-primary">City, Province</label>
                <Input
                  placeholder="Enter city, province"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
            </div>
          </div>

          {/* Estimate Details Row - Compact fields below customer card */}
          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-4">
              <div className="w-36">
                <label className="text-sm font-medium text-primary">Estimate #</label>
                <Input
                  value={formData.estimateNumber}
                  onChange={(e) => updateField('estimateNumber', e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
              
              <div className="w-36">
                <label className="text-sm font-medium text-primary">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full mt-1 h-9 justify-start text-left font-normal px-3">
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {format(formData.date, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => updateField('date', date || new Date())}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="w-36">
                <label className="text-sm font-medium text-primary">Expiration Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full mt-1 h-9 justify-start text-left font-normal px-3">
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {format(formData.expirationDate, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.expirationDate}
                      onSelect={(date) => updateField('expirationDate', date || new Date())}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="w-36">
                <label className="text-sm font-medium text-primary">PO Number</label>
                <Input
                  placeholder="Enter PO number"
                  value={formData.poNumber}
                  onChange={(e) => updateField('poNumber', e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
            </div>
            
            <div className="mt-3 text-sm text-primary">
              Clients will have 5 day(s) to approve this estimate if sent today
            </div>
          </div>

          {/* Line Items Section */}
          <div className="border-t pt-6">
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-medium">Description</th>
                    <th className="text-center p-3 font-medium w-24">Rate</th>
                    <th className="text-center p-3 font-medium w-20">Quantity</th>
                    <th className="text-right p-3 font-medium w-24">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3 align-top">
                      <div className="space-y-3">
                        <Input
                          placeholder="Project title (e.g., Kitchen Renovation)"
                          value={formData.description}
                          onChange={(e) => updateField('description', e.target.value)}
                          className="border-0 p-0 bg-transparent font-medium text-base"
                        />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <span className="font-medium text-green-600 text-sm">Item List</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Textarea
                          placeholder="Enter detailed work scope, materials, and labor description..."
                          value={formData.workScope}
                          onChange={(e) => updateField('workScope', e.target.value)}
                          rows={4}
                          className="resize-none text-sm"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-center align-top">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => updateField('amount', e.target.value)}
                        className="text-center w-20"
                      />
                    </td>
                    <td className="p-3 text-center align-top">
                      <Input
                        type="number"
                        defaultValue="1"
                        className="text-center w-16"
                      />
                    </td>
                    <td className="p-3 text-right font-semibold align-top">
                      ${Number(formData.amount || 0).toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Financial Summary */}
            <div className="mt-6 space-y-4">
              {/* Additional Notes */}
              <div className="border-t pt-4">
                <Textarea
                  placeholder="Additional notes (e.g., terms, conditions, project timeline, permits, etc.)"
                  rows={4}
                  className="resize-none text-sm"
                />
              </div>
              
              {/* Financial Breakdown */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-80 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${Number(formData.amount || 0).toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Discount</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-24 h-6 text-right text-sm"
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-24 h-6 text-right text-sm"
                      />
                    </div>
                    
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${Number(formData.amount || 0).toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Deposit Due</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-24 h-6 text-right text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer Message */}
              <div className="border-t pt-4">
                <p className="text-center font-medium text-primary">THANK YOU FOR YOUR BUSINESS!</p>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  By signing this document, the customer agrees to the services and conditions outlined in this document.
                </p>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};