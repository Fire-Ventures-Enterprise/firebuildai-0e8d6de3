import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
    status: 'PENDING',
    description: '',
    workScope: '',
    materials: '',
    labor: '',
    notes: '',
    poNumber: ''
  });

  // Update form data when estimate changes (for edit mode)
  useEffect(() => {
    if (estimate && mode === 'edit') {
      // Helper function to safely parse date
      const parseDate = (dateString: string) => {
        if (!dateString) return new Date();
        
        // Try parsing the date string - handle various formats
        const parsed = new Date(dateString);
        
        // If invalid, return current date
        if (isNaN(parsed.getTime())) {
          return new Date();
        }
        
        return parsed;
      };

      setFormData({
        clientName: estimate.clientName || '',
        clientEmail: estimate.clientEmail || '',
        address: estimate.address || '',
        city: estimate.city || '',
        phone: estimate.phone || '',
        amount: estimate.amount?.toString() || '',
        date: parseDate(estimate.date),
        expirationDate: parseDate(estimate.expirationDate) || new Date(),
        estimateNumber: estimate.estimateNumber || estimate.number || '',
        status: estimate.status || 'PENDING',
        description: estimate.description || '',
        workScope: estimate.workScope || '',
        materials: estimate.materials || '',
        labor: estimate.labor || '',
        notes: estimate.notes || '',
        poNumber: estimate.poNumber || ''
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        clientName: '',
        clientEmail: '',
        address: '',
        city: '',
        phone: '',
        amount: '',
        date: new Date(),
        expirationDate: new Date(),
        estimateNumber: '',
        status: 'PENDING',
        description: '',
        workScope: '',
        materials: '',
        labor: '',
        notes: '',
        poNumber: ''
      });
    }
  }, [estimate, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <DialogTitle className="text-2xl font-semibold">
            Estimate #{formData.estimateNumber || 'New'}
          </DialogTitle>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              CANCEL
            </Button>
            <Button type="submit" form="estimate-form" className="bg-green-600 hover:bg-green-700">
              SAVE
            </Button>
          </div>
        </div>

        <form id="estimate-form" onSubmit={handleSubmit}>
          {/* Top Section - Company and Client Info */}
          <div className="flex justify-between mb-8">
            {/* Company Info - Left Side */}
            <div className="w-1/3">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  FB
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">FIREBUILD.AI</h2>
                  <p className="text-gray-600 font-medium">CONSTRUCTION</p>
                </div>
              </div>
              <div className="text-gray-600 space-y-1 text-sm">
                <p>29 Birchbank Crescent</p>
                <p>Kanata, ontario</p>
                <p>K2M 2J9</p>
                <p>Canada</p>
                <p>firebuildai@gmail.com</p>
              </div>
            </div>

            {/* Client Info and Estimate Details - Right Side */}
            <div className="w-1/2">
              {/* Client Info Card */}
              <div className="bg-green-50 border border-green-300 rounded p-4 mb-6">
                <div className="space-y-2">
                  <Input
                    placeholder="Client Name"
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    className="font-medium border-0 p-0 bg-transparent text-base"
                    required
                  />
                  <Input
                    placeholder="Client Email"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="border-0 p-0 bg-transparent text-sm text-blue-600"
                  />
                  <Input
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="border-0 p-0 bg-transparent text-sm"
                  />
                  <Input
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="border-0 p-0 bg-transparent text-sm"
                    required
                  />
                  <Input
                    placeholder="City, Province"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="border-0 p-0 bg-transparent text-sm"
                    required
                  />
                </div>
              </div>

              {/* Estimate Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Estimate #</Label>
                  <Input
                    value={formData.estimateNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimateNumber: e.target.value }))}
                    className="h-8 text-sm"
                  />
                </div>
                <div></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-8 justify-start text-left font-normal text-sm"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {formData.date && !isNaN(formData.date.getTime()) 
                          ? format(formData.date, "dd-MM-yyyy") 
                          : "Select date"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date && !isNaN(formData.date.getTime()) ? formData.date : undefined}
                        onSelect={(date) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Expiration Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-8 justify-start text-left font-normal text-sm"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {formData.expirationDate && !isNaN(formData.expirationDate.getTime()) 
                          ? format(formData.expirationDate, "dd-MM-yyyy") 
                          : "Select date"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.expirationDate && !isNaN(formData.expirationDate.getTime()) ? formData.expirationDate : undefined}
                        onSelect={(date) => setFormData(prev => ({ ...prev, expirationDate: date || new Date() }))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div></div>
              </div>

              <div className="text-xs text-orange-600 mb-4">
                Clients will have 5 day(s) to approve this estimate if sent today
              </div>

              <div className="mb-4">
                <Label className="text-xs text-gray-500 mb-1 block">PO Number</Label>
                <Input
                  placeholder="Enter PO number"
                  value={formData.poNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, poNumber: e.target.value }))}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Full Width Table */}
          <div className="border-t border-gray-300">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left p-3 font-medium text-gray-700 w-auto">Description</th>
                  <th className="text-center p-3 font-medium text-gray-700 w-24">Rate</th>
                  <th className="text-center p-3 font-medium text-gray-700 w-20">Markup</th>
                  <th className="text-center p-3 font-medium text-gray-700 w-20">Quantity</th>
                  <th className="text-center p-3 font-medium text-gray-700 w-16">Tax</th>
                  <th className="text-right p-3 font-medium text-gray-700 w-24">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 align-top">
                    <div className="space-y-3">
                      <Input
                        placeholder="Item description (e.g., Bathroom)"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="border-0 p-0 font-medium text-base bg-transparent"
                      />
                      <div className="text-sm text-gray-600">
                        <div className="font-medium mb-2 text-green-600">
                          <span className="inline-block w-2 h-2 bg-green-600 rounded mr-2"></span>
                          Item List
                        </div>
                        <div className="mb-3">
                          <div className="font-medium mb-1">{formData.description} Renovation Scope of Work</div>
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium">Demolition:</div>
                          <Textarea
                            placeholder="Remove and dispose of the following items from the property..."
                            value={formData.workScope}
                            onChange={(e) => setFormData(prev => ({ ...prev, workScope: e.target.value }))}
                            rows={8}
                            className="border-0 p-0 resize-none text-sm bg-transparent"
                          />
                          <div className="font-medium mt-4">Supply and Installation:</div>
                          <Textarea
                            placeholder="List all materials and installation work..."
                            value={formData.materials}
                            onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
                            rows={6}
                            className="border-0 p-0 resize-none text-sm bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center align-top">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="text-center border-0 p-0 w-20 bg-transparent"
                    />
                  </td>
                  <td className="p-3 text-center align-top">
                    <span className="text-sm text-gray-400">Markup</span>
                  </td>
                  <td className="p-3 text-center align-top">
                    <Input
                      type="number"
                      defaultValue="1"
                      className="text-center border-0 p-0 w-12 bg-transparent"
                    />
                  </td>
                  <td className="p-3 text-center align-top">
                    <span className="text-sm text-gray-400">Tax</span>
                  </td>
                  <td className="p-3 text-right font-medium align-top">
                    ${Number(formData.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};