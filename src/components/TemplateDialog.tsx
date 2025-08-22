import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Star, Crown } from "lucide-react";

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: any) => void;
}

const templates = [
  {
    id: 1,
    name: "Basic Construction",
    description: "Standard construction estimate template",
    category: "Construction",
    isPro: false,
    amount: 15000,
    items: ["Labor", "Materials", "Equipment", "Permits"]
  },
  {
    id: 2,
    name: "Residential Renovation",
    description: "Complete home renovation estimate",
    category: "Residential",
    isPro: true,
    amount: 45000,
    items: ["Demolition", "Electrical", "Plumbing", "Flooring", "Paint"]
  },
  {
    id: 3,
    name: "Commercial Build-out",
    description: "Office space build-out template",
    category: "Commercial",
    isPro: true,
    amount: 85000,
    items: ["Framing", "Drywall", "HVAC", "Electrical", "Flooring"]
  },
  {
    id: 4,
    name: "Kitchen Remodel",
    description: "Kitchen renovation estimate",
    category: "Residential",
    isPro: false,
    amount: 25000,
    items: ["Cabinets", "Countertops", "Appliances", "Plumbing", "Electrical"]
  },
  {
    id: 5,
    name: "Bathroom Renovation",
    description: "Full bathroom remodel template",
    category: "Residential",
    isPro: false,
    amount: 18000,
    items: ["Tiles", "Fixtures", "Vanity", "Plumbing", "Electrical"]
  },
  {
    id: 6,
    name: "Roofing Project",
    description: "Complete roofing replacement",
    category: "Roofing",
    isPro: true,
    amount: 32000,
    items: ["Tear-off", "Materials", "Labor", "Cleanup", "Warranty"]
  }
];

export const TemplateDialog = ({ open, onOpenChange, onSelectTemplate }: TemplateDialogProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Choose Estimate Template
          </DialogTitle>
          <DialogDescription>
            Select a pre-built template to speed up your estimate creation process.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {template.name}
                      {template.isPro && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          PRO
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <div className="text-xl font-bold text-primary">
                  ${template.amount.toLocaleString()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Includes:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.items.map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUseTemplate} 
            disabled={!selectedTemplate}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Use Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};