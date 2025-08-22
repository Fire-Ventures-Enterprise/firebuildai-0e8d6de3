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
    address: '',
    city: '',
    phone: '',
    amount: '',
    date: new Date(),
    status: 'PENDING',
    description: '',
    workScope: '',
    materials: '',
    labor: '',
    notes: ''
  });

  // Update form data when estimate changes (for edit mode)
  useEffect(() => {
    if (estimate && mode === 'edit') {
      setFormData({
        clientName: estimate.clientName || '',
        address: estimate.address || '',
        city: estimate.city || '',
        phone: estimate.phone || '',
        amount: estimate.amount?.toString() || '',
        date: estimate.date ? new Date(estimate.date) : new Date(),
        status: estimate.status || 'PENDING',
        description: estimate.description || '',
        workScope: estimate.workScope || '',
        materials: estimate.materials || '',
        labor: estimate.labor || '',
        notes: estimate.notes || ''
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        clientName: '',
        address: '',
        city: '',
        phone: '',
        amount: '',
        date: new Date(),
        status: 'PENDING',
        description: '',
        workScope: '',
        materials: '',
        labor: '',
        notes: ''
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
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">
            {mode === 'create' ? 'Create New Estimate' : 'Edit Estimate'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === 'create' 
              ? 'Fill in the details to create a new estimate for your client.'
              : 'Update the estimate details below.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Name and Phone */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-sm font-medium">
                Client Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="h-12 border-2 rounded-md"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="h-12 border-2 rounded-md"
              />
            </div>
          </div>

          {/* Address and City */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="h-12 border-2 rounded-md"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="h-12 border-2 rounded-md"
                required
              />
            </div>
          </div>

          {/* Amount, Date, and Status */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="h-12 border-2 rounded-md"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal border-2 rounded-md",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "MMMM do, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="h-12 border-2 rounded-md">
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

          {/* Work Scope */}
          <div className="space-y-2">
            <Label htmlFor="workScope" className="text-sm font-medium">Work Scope</Label>
            <Textarea
              id="workScope"
              placeholder="Describe the scope of work..."
              value={formData.workScope}
              onChange={(e) => setFormData(prev => ({ ...prev, workScope: e.target.value }))}
              rows={4}
              className="border-2 rounded-md resize-none"
            />
          </div>

          {/* Materials and Labor Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="materials" className="text-sm font-medium">Materials</Label>
              <Textarea
                id="materials"
                placeholder="List materials needed..."
                value={formData.materials}
                onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
                rows={4}
                className="border-2 rounded-md resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labor" className="text-sm font-medium">Labor Details</Label>
              <Textarea
                id="labor"
                placeholder="Describe labor requirements..."
                value={formData.labor}
                onChange={(e) => setFormData(prev => ({ ...prev, labor: e.target.value }))}
                rows={4}
                className="border-2 rounded-md resize-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="border-2 rounded-md resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6">
              Cancel
            </Button>
            <Button type="submit" className="px-6 bg-blue-600 hover:bg-blue-700">
              {mode === 'create' ? 'Create Estimate' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};