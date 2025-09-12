import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EnhancedIndustryTemplateSelector } from "./EnhancedIndustryTemplateSelector";
import { FileText, Plus } from "lucide-react";
import { toast } from "sonner";

interface TemplateQuickApplyProps {
  onApplyTemplate: (items: any[]) => void;
  targetType: 'estimate' | 'invoice';
}

interface EditableLineItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  unit: 'hour' | 'sqft' | 'linear_foot' | 'unit' | 'day' | 'project';
  type: 'task' | 'material';
  total: number;
}

export function TemplateQuickApply({ onApplyTemplate, targetType }: TemplateQuickApplyProps) {
  const [open, setOpen] = useState(false);

  const handleSelectTemplate = (template: any, lineItems: EditableLineItem[]) => {
    try {
      // Convert editable line items to the format expected by the form
      const formattedItems = lineItems.map((item, index) => ({
        id: crypto.randomUUID(),
        description: `${item.name} (${item.quantity} ${
          item.unit === 'hour' ? 'hrs' : 
          item.unit === 'sqft' ? 'sq ft' : 
          item.unit === 'linear_foot' ? 'linear ft' : 
          item.unit === 'day' ? 'days' : 
          item.unit === 'project' ? 'project' : 
          'units'
        })`,
        item_name: item.name,
        quantity: item.quantity,
        rate: item.rate,
        unit_price: item.rate,
        amount: item.total,
        tax: false,
        sort_order: index,
        unit: item.unit,
        type: item.type
      }));
      
      onApplyTemplate(formattedItems);
      setOpen(false);
      toast.success(`Applied ${template.name} template with ${formattedItems.length} customized items`);
    } catch (error) {
      console.error("Error applying template:", error);
      toast.error("Failed to apply template");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Use Industry Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Industry Template</DialogTitle>
          <DialogDescription>
            Choose a pre-configured template for your industry to quickly add common items
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <EnhancedIndustryTemplateSelector onSelectTemplate={handleSelectTemplate} />
        </div>
      </DialogContent>
    </Dialog>
  );
}