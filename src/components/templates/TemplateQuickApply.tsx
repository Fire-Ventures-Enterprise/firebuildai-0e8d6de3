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
import { IndustryTemplateSelector } from "./IndustryTemplateSelector";
import { FileText, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TemplateQuickApplyProps {
  onApplyTemplate: (items: any[]) => void;
  targetType: 'estimate' | 'invoice';
}

export function TemplateQuickApply({ onApplyTemplate, targetType }: TemplateQuickApplyProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelectTemplate = async (template: any) => {
    try {
      setLoading(true);
      
      // Load template tasks
      const { data: tasks, error: tasksError } = await supabase
        .from("template_tasks")
        .select("*")
        .eq("template_id", template.id)
        .order("sort_order");
      
      if (tasksError) throw tasksError;
      
      // Load industry preset for additional context
      const { data: preset, error: presetError } = await supabase
        .from("industry_presets")
        .select("*")
        .eq("industry_type", template.industry_type)
        .single();
      
      if (presetError && presetError.code !== 'PGRST116') throw presetError;
      
      // Convert template tasks to line items
      const items = tasks?.map((task, index) => ({
        id: crypto.randomUUID(),
        description: task.label,
        quantity: 1,
        rate: task.rate_per_unit || 0,
        amount: task.rate_per_unit || 0,
        unit_price: task.rate_per_unit || 0,
        item_name: task.label,
        tax: false,
        sort_order: index,
      })) || [];
      
      // Add common materials if available
      if (preset?.common_materials && Array.isArray(preset.common_materials)) {
        const materialItems = preset.common_materials.map((material: any, index: number) => ({
          id: crypto.randomUUID(),
          description: `${material.name} - ${material.unit}`,
          item_name: material.name,
          quantity: 1,
          rate: material.avg_cost || 0,
          unit_price: material.avg_cost || 0,
          amount: material.avg_cost || 0,
          tax: false,
          sort_order: items.length + index,
        }));
        items.push(...materialItems);
      }
      
      // Apply markup if available
      if (preset?.base_markup && preset.base_markup > 1) {
        items.forEach(item => {
          const markup = preset.base_markup;
          item.rate = item.rate * markup;
          item.unit_price = item.unit_price * markup;
          item.amount = item.amount * markup;
        });
      }
      
      onApplyTemplate(items);
      setOpen(false);
      toast.success(`Applied ${template.name} template with ${items.length} items`);
    } catch (error) {
      console.error("Error applying template:", error);
      toast.error("Failed to apply template");
    } finally {
      setLoading(false);
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
          <IndustryTemplateSelector onSelectTemplate={handleSelectTemplate} />
        </div>
      </DialogContent>
    </Dialog>
  );
}