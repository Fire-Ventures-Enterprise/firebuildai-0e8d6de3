import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wrench, Home, ChefHat, Hammer, Paintbrush, Zap,
  Package, DollarSign, Clock, Shield, AlertCircle, ChevronRight,
  Building2, Droplets, TreePine, Lightbulb, Flame, Snowflake,
  Wind, Shovel, Factory, Drill, Shield as ShieldIcon, Truck,
  PaintBucket, Sofa, Mountain, Sparkles, Waves, HardHat
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface IndustryPreset {
  id: string;
  industry_type: string;
  name: string;
  description: string | null;
  icon: string | null;
  base_markup: number | null;
  typical_overhead: number | null;
  common_tasks: any;
  common_materials: any;
  required_certifications: string[] | null;
  created_at: string;
  updated_at: string;
}

interface Template {
  id: string;
  user_id: string;
  name: string;
  category: string;
  description: string | null;
  icon: string | null;
  typical_duration: string | null;
  difficulty_level: string | null;
  price_range: any;
  required_tools: any;
  common_materials: any;
  industry_type: string | null;
  is_preset: boolean | null;
  is_active: boolean;
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

const iconMap: Record<string, any> = {
  Wrench,
  Home,
  ChefHat,
  Hammer,
  Paintbrush,
  Zap,
  Building2,
  Droplets,
  TreePine,
  Lightbulb,
  Flame,
  Snowflake,
  Wind,
  Shovel,
  Factory,
  Drill,
  Shield: ShieldIcon,
  Truck,
  PaintBucket,
  Sofa,
  Mountain,
  Sparkles,
  Waves,
  HardHat
};

// Extended industry types to cover all major industries
const allIndustries = [
  { value: "kitchen_remodeling", label: "Kitchen Remodeling", icon: "ChefHat" },
  { value: "plumbing", label: "Plumbing Services", icon: "Droplets" },
  { value: "roofing", label: "Roofing Services", icon: "Home" },
  { value: "electrical", label: "Electrical", icon: "Zap" },
  { value: "hvac", label: "HVAC", icon: "Wind" },
  { value: "flooring", label: "Flooring", icon: "Building2" },
  { value: "painting", label: "Painting", icon: "PaintBucket" },
  { value: "landscaping", label: "Landscaping", icon: "TreePine" },
  { value: "concrete", label: "Concrete & Masonry", icon: "Mountain" },
  { value: "drywall", label: "Drywall", icon: "Building2" },
  { value: "carpentry", label: "Carpentry", icon: "Hammer" },
  { value: "bathroom_remodeling", label: "Bathroom Remodeling", icon: "Droplets" },
  { value: "windows_doors", label: "Windows & Doors", icon: "Building2" },
  { value: "siding", label: "Siding", icon: "Home" },
  { value: "fencing", label: "Fencing", icon: "Shield" },
  { value: "demolition", label: "Demolition", icon: "Drill" },
  { value: "insulation", label: "Insulation", icon: "Snowflake" },
  { value: "cleaning", label: "Cleaning Services", icon: "Sparkles" },
  { value: "pool_spa", label: "Pool & Spa", icon: "Waves" },
  { value: "solar", label: "Solar Installation", icon: "Lightbulb" },
  { value: "general_contractor", label: "General Contractor", icon: "HardHat" },
  { value: "excavation", label: "Excavation", icon: "Shovel" },
  { value: "waterproofing", label: "Waterproofing", icon: "Shield" },
  { value: "restoration", label: "Restoration", icon: "Factory" },
  { value: "moving", label: "Moving Services", icon: "Truck" },
  { value: "furniture", label: "Furniture Assembly", icon: "Sofa" },
  { value: "gas_fitting", label: "Gas Fitting", icon: "Flame" },
];

export function EnhancedIndustryTemplateSelector({ 
  onSelectTemplate 
}: { 
  onSelectTemplate: (template: Template, lineItems: EditableLineItem[]) => void 
}) {
  const [industryPresets, setIndustryPresets] = useState<IndustryPreset[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("kitchen_remodeling");
  const [loading, setLoading] = useState(true);
  const [editableItems, setEditableItems] = useState<EditableLineItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    loadIndustryData();
  }, []);

  const loadIndustryData = async () => {
    try {
      setLoading(true);
      
      // Load industry presets
      const { data: presets, error: presetsError } = await supabase
        .from("industry_presets")
        .select("*")
        .order("name");
      
      if (presetsError) throw presetsError;
      
      // Load preset templates
      const { data: templatesData, error: templatesError } = await supabase
        .from("templates")
        .select("*")
        .eq("is_preset", true)
        .order("category")
        .order("name");
      
      if (templatesError) throw templatesError;
      
      setIndustryPresets((presets || []) as IndustryPreset[]);
      
      // Process templates data to ensure proper types
      const processedTemplates = (templatesData || []).map(t => ({
        ...t,
        price_range: typeof t.price_range === 'string' 
          ? JSON.parse(t.price_range) 
          : t.price_range || { min: 0, max: 0 },
        required_tools: Array.isArray(t.required_tools) 
          ? t.required_tools 
          : typeof t.required_tools === 'string'
          ? JSON.parse(t.required_tools)
          : [],
        common_materials: Array.isArray(t.common_materials) 
          ? t.common_materials 
          : typeof t.common_materials === 'string'
          ? JSON.parse(t.common_materials)
          : []
      })) as Template[];
      
      setTemplates(processedTemplates);
    } catch (error) {
      console.error("Error loading industry data:", error);
      toast.error("Failed to load industry templates");
    } finally {
      setLoading(false);
    }
  };

  const getTemplatesForIndustry = (industryType: string) => {
    return templates.filter(t => t.industry_type === industryType);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    
    // Get the preset for this template's industry
    const preset = industryPresets.find(p => p.industry_type === template.industry_type);
    if (!preset) return;

    // Convert preset tasks and materials to editable line items
    const taskItems: EditableLineItem[] = (preset.common_tasks || []).map((task: any, idx: number) => ({
      id: `task-${idx}`,
      name: task.name,
      quantity: task.duration_hours || 1,
      rate: task.rate || 100,
      unit: 'hour' as const,
      type: 'task' as const,
      total: (task.duration_hours || 1) * (task.rate || 100)
    }));

    const materialItems: EditableLineItem[] = (preset.common_materials || []).map((material: any, idx: number) => ({
      id: `material-${idx}`,
      name: material.name,
      quantity: 1,
      rate: material.avg_cost || 50,
      unit: material.unit === 'sqft' ? 'sqft' : material.unit === 'linear foot' ? 'linear_foot' : 'unit' as const,
      type: 'material' as const,
      total: material.avg_cost || 50
    }));

    setEditableItems([...taskItems, ...materialItems]);
  };

  const updateLineItem = (itemId: string, field: keyof EditableLineItem, value: any) => {
    setEditableItems(items => items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        // Recalculate total when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updated.total = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleApplyTemplate = () => {
    if (!selectedTemplate) return;
    onSelectTemplate(selectedTemplate, editableItems);
  };

  const getUnitLabel = (unit: string) => {
    switch (unit) {
      case 'hour': return '/hr';
      case 'sqft': return '/sq ft';
      case 'linear_foot': return '/linear ft';
      case 'day': return '/day';
      case 'project': return '/project';
      default: return '/unit';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentPreset = industryPresets.find(p => p.industry_type === selectedIndustry);
  const currentIndustry = allIndustries.find(i => i.value === selectedIndustry);

  return (
    <div className="space-y-6">
      {!selectedTemplate ? (
        <>
          <div>
            <h2 className="text-2xl font-bold mb-2">Industry Templates</h2>
            <p className="text-muted-foreground">
              Select pre-configured templates for your industry with common tasks, materials, and pricing
            </p>
          </div>

          {/* Industry Dropdown Selector */}
          <div className="space-y-2">
            <Label htmlFor="industry-select">Select Your Industry</Label>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger id="industry-select" className="w-full">
                <SelectValue placeholder="Choose an industry">
                  {currentIndustry && (
                    <div className="flex items-center gap-2">
                      {iconMap[currentIndustry.icon] && 
                        React.createElement(iconMap[currentIndustry.icon], { className: "w-4 h-4" })
                      }
                      <span>{currentIndustry.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {allIndustries.map(industry => {
                  const Icon = iconMap[industry.icon] || Hammer;
                  return (
                    <SelectItem key={industry.value} value={industry.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{industry.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {currentPreset && (
            <div className="space-y-6">
              {/* Industry Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {iconMap[currentPreset.icon] && 
                      React.createElement(iconMap[currentPreset.icon], { className: "w-5 h-5" })
                    }
                    {currentPreset.name} Overview
                  </CardTitle>
                  <CardDescription>{currentPreset.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Base Markup</p>
                      <p className="text-lg font-semibold">
                        {currentPreset.base_markup ? ((currentPreset.base_markup - 1) * 100).toFixed(0) : 0}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Typical Overhead</p>
                      <p className="text-lg font-semibold">
                        {currentPreset.typical_overhead ? (currentPreset.typical_overhead * 100).toFixed(0) : 0}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Common Tasks</p>
                      <p className="text-lg font-semibold">{currentPreset.common_tasks?.length || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Materials</p>
                      <p className="text-lg font-semibold">{currentPreset.common_materials?.length || 0}</p>
                    </div>
                  </div>

                  {currentPreset.required_certifications && currentPreset.required_certifications.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Required Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {currentPreset.required_certifications.map((cert, idx) => (
                          <Badge key={idx} variant="secondary">
                            <Shield className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Available Templates */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Available Templates</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {getTemplatesForIndustry(selectedIndustry).map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {template.description}
                            </CardDescription>
                          </div>
                          {template.difficulty_level && (
                            <Badge className={getDifficultyColor(template.difficulty_level)}>
                              {template.difficulty_level}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-4 text-sm">
                          {template.typical_duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{template.typical_duration}</span>
                            </div>
                          )}
                          {template.price_range && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {formatPrice(template.price_range.min)} - {formatPrice(template.price_range.max)}
                              </span>
                            </div>
                          )}
                        </div>

                        {template.required_tools && template.required_tools.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Required Tools</p>
                            <div className="flex flex-wrap gap-1">
                              {template.required_tools.slice(0, 3).map((tool, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tool}
                                </Badge>
                              ))}
                              {template.required_tools.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{template.required_tools.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <Button 
                          className="w-full" 
                          onClick={() => handleTemplateSelect(template)}
                        >
                          Customize & Use Template
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Editable Line Items View */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Customize Line Items</h2>
              <p className="text-muted-foreground">
                Adjust quantities, rates, and units to match your company's actual charges
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTemplate(null);
                setEditableItems([]);
              }}
            >
              Back to Templates
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{selectedTemplate.name}</CardTitle>
              <CardDescription>{selectedTemplate.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {editableItems.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                        <div className="md:col-span-2">
                          <Label htmlFor={`name-${item.id}`}>
                            {item.type === 'task' ? 'Task' : 'Material'} Name
                          </Label>
                          <Input
                            id={`name-${item.id}`}
                            value={item.name}
                            onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                          <Input
                            id={`quantity-${item.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`unit-${item.id}`}>Unit Type</Label>
                          <Select
                            value={item.unit}
                            onValueChange={(value) => updateLineItem(item.id, 'unit', value)}
                          >
                            <SelectTrigger id={`unit-${item.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hour">Per Hour</SelectItem>
                              <SelectItem value="sqft">Per Sq Ft</SelectItem>
                              <SelectItem value="linear_foot">Per Linear Ft</SelectItem>
                              <SelectItem value="unit">Per Unit</SelectItem>
                              <SelectItem value="day">Per Day</SelectItem>
                              <SelectItem value="project">Per Project</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor={`rate-${item.id}`}>
                            Rate {getUnitLabel(item.unit)}
                          </Label>
                          <Input
                            id={`rate-${item.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div>
                          <Label>Total</Label>
                          <div className="h-10 px-3 py-2 border border-input rounded-md bg-muted flex items-center">
                            {formatPrice(item.total)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">
                    Total: {formatPrice(editableItems.reduce((sum, item) => sum + item.total, 0))}
                  </div>
                  <Button onClick={handleApplyTemplate} size="lg">
                    Apply Template with Custom Pricing
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}