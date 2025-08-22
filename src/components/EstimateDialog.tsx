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
          <div className="grid grid-cols-12 gap-8">
            {/* Left Side - Company Info */}
            <div className="col-span-5">
              {/* Company Logo & Info */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    FB
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">FIREBUILD.AI</h2>
                    <p className="text-gray-600 font-medium">CONSTRUCTION</p>
                  </div>
                </div>
                <div className="text-gray-600 space-y-1">
                  <p>29 Birchbank Crescent</p>
                  <p>Kanata, ontario</p>
                  <p>K2M 2J9</p>
                  <p>Canada</p>
                  <p>firebuildai@gmail.com</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-700">Description</th>
                        <th className="text-right p-4 font-medium text-gray-700">Rate</th>
                        <th className="text-center p-4 font-medium text-gray-700">Markup</th>
                        <th className="text-center p-4 font-medium text-gray-700">Quantity</th>
                        <th className="text-center p-4 font-medium text-gray-700">Tax</th>
                        <th className="text-right p-4 font-medium text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-4">
                          <div className="space-y-2">
                            <Input
                              placeholder="Item description"
                              value={formData.description}
                              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                              className="border-0 p-0 font-medium"
                            />
                            <div className="text-sm text-gray-600">
                              <div className="mb-2">
                                <strong>Scope of Work</strong>
                              </div>
                              <Textarea
                                placeholder="Describe the work to be done..."
                                value={formData.workScope}
                                onChange={(e) => setFormData(prev => ({ ...prev, workScope: e.target.value }))}
                                rows={6}
                                className="border-0 p-0 resize-none text-sm"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                            className="text-right border-0 p-0 w-24"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-sm text-gray-500">Markup</span>
                        </td>
                        <td className="p-4 text-center">
                          <Input
                            type="number"
                            defaultValue="1"
                            className="text-center border-0 p-0 w-16"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-sm text-gray-500">Tax</span>
                        </td>
                        <td className="p-4 text-right font-medium">
                          ${formData.amount || '0.00'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Side - Client Info & Estimate Details */}
            <div className="col-span-7">
              {/* Client Info Card */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Prepared For</h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Client Name"
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    className="font-medium border-0 p-0 bg-transparent"
                    required
                  />
                  <Input
                    placeholder="Client Email"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="border-0 p-0 bg-transparent"
                  />
                  <Input
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="border-0 p-0 bg-transparent"
                  />
                  <Input
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="border-0 p-0 bg-transparent"
                    required
                  />
                  <Input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="border-0 p-0 bg-transparent"
                    required
                  />
                </div>
              </div>

              {/* Estimate Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-blue-600 mb-2 block">Estimate #</Label>
                    <Input
                      value={formData.estimateNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimateNumber: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-600 mb-2 block">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="DECLINED">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-blue-600 mb-2 block">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-10 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
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
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-600 mb-2 block">Expiration Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-10 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
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
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="text-sm text-blue-600 mb-4">
                  Clients will have 5 day(s) to approve this estimate if sent today
                </div>

                <div>
                  <Label className="text-sm font-medium text-blue-600 mb-2 block">PO Number</Label>
                  <Input
                    placeholder="Enter PO number"
                    value={formData.poNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, poNumber: e.target.value }))}
                    className="h-10"
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <Label className="text-sm font-medium text-blue-600 mb-2 block">Notes</Label>
                  <Textarea
                    placeholder="Additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};