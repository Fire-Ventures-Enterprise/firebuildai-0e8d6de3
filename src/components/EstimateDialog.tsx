import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EstimateHeader } from "@/components/estimate/EstimateHeader";
import { CompanyInfo } from "@/components/estimate/CompanyInfo";
import { ClientInfo } from "@/components/estimate/ClientInfo";
import { EstimateDetails } from "@/components/estimate/EstimateDetails";
import { EstimateLineItems } from "@/components/estimate/EstimateLineItems";

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

  const handleFieldUpdate = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
        <EstimateHeader
          estimateNumber={formData.estimateNumber}
          onCancel={() => onOpenChange(false)}
          onSave={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
        />

        <form id="estimate-form" onSubmit={handleSubmit} className="p-6">
          {/* Top Section - Company and Client Info */}
          <div className="flex gap-8 mb-8">
            <CompanyInfo />
            
            {/* Client Info and Estimate Details - Right Side */}
            <div className="w-2/3 space-y-6">
              <ClientInfo
                clientName={formData.clientName}
                clientEmail={formData.clientEmail}
                phone={formData.phone}
                address={formData.address}
                city={formData.city}
                onUpdate={handleFieldUpdate}
              />
              
              <EstimateDetails
                estimateNumber={formData.estimateNumber}
                date={formData.date}
                expirationDate={formData.expirationDate}
                poNumber={formData.poNumber}
                onUpdate={handleFieldUpdate}
              />
            </div>
          </div>

          <EstimateLineItems
            description={formData.description}
            workScope={formData.workScope}
            materials={formData.materials}
            amount={formData.amount}
            onUpdate={handleFieldUpdate}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};