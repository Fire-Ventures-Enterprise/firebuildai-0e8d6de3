import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Wrench, Home, ChefHat, Hammer, Paintbrush, Zap,
  Package, DollarSign, Clock, Shield, AlertCircle, ChevronRight
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

const iconMap: Record<string, any> = {
  Wrench,
  Home,
  ChefHat,
  Hammer,
  Paintbrush,
  Zap,
};

export function IndustryTemplateSelector({ onSelectTemplate }: { onSelectTemplate: (template: Template) => void }) {
  const [industryPresets, setIndustryPresets] = useState<IndustryPreset[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("plumbing");
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentPreset = industryPresets.find(p => p.industry_type === selectedIndustry);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Industry Templates</h2>
        <p className="text-muted-foreground">
          Select pre-configured templates for your industry with common tasks, materials, and pricing
        </p>
      </div>

      <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry}>
        <TabsList className="grid w-full grid-cols-3">
          {industryPresets.map((preset) => {
            const Icon = iconMap[preset.icon] || Hammer;
            return (
              <TabsTrigger key={preset.industry_type} value={preset.industry_type}>
                <Icon className="w-4 h-4 mr-2" />
                {preset.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {industryPresets.map((preset) => (
          <TabsContent key={preset.industry_type} value={preset.industry_type} className="space-y-6">
            {/* Industry Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {iconMap[preset.icon] && React.createElement(iconMap[preset.icon], { className: "w-5 h-5" })}
                  {preset.name} Overview
                </CardTitle>
                <CardDescription>{preset.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Base Markup</p>
                    <p className="text-lg font-semibold">{((preset.base_markup - 1) * 100).toFixed(0)}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Typical Overhead</p>
                    <p className="text-lg font-semibold">{(preset.typical_overhead * 100).toFixed(0)}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Common Tasks</p>
                    <p className="text-lg font-semibold">{preset.common_tasks.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Materials</p>
                    <p className="text-lg font-semibold">{preset.common_materials.length}</p>
                  </div>
                </div>

                {preset.required_certifications.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Required Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {preset.required_certifications.map((cert, idx) => (
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
                {getTemplatesForIndustry(preset.industry_type).map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {template.description}
                          </CardDescription>
                        </div>
                        <Badge className={getDifficultyColor(template.difficulty_level)}>
                          {template.difficulty_level}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{template.typical_duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {formatPrice(template.price_range.min)} - {formatPrice(template.price_range.max)}
                          </span>
                        </div>
                      </div>

                      {template.required_tools.length > 0 && (
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
                        onClick={() => onSelectTemplate(template)}
                      >
                        Use This Template
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Common Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Common Tasks & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {preset.common_tasks.map((task: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-sm">{task.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.duration_hours} hours
                          </p>
                        </div>
                        <Badge variant="secondary">
                          ${task.rate}/hr
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Common Materials */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Common Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {preset.common_materials.map((material: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-sm">{material.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Per {material.unit}
                          </p>
                        </div>
                        <Badge variant="outline">
                          ${material.avg_cost}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}