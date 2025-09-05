import { useState, useEffect } from 'react';
import { 
  Package, 
  ChefHat, 
  Bath, 
  Home, 
  Wind, 
  Zap, 
  Square,
  ChevronRight,
  Loader2,
  Calendar,
  DollarSign,
  CheckCircle2,
  Info
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  getTemplates,
  getTemplateWithTasks,
  createProjectTasksFromTemplate,
  scheduleProjectTasks,
  type Template,
  type ProjectTask
} from '@/services/templates';
import { supabase } from '@/integrations/supabase/client';

interface ServiceLibraryDrawerProps {
  open: boolean;
  onClose: () => void;
  onTasksCreated: (tasks: ProjectTask[]) => void;
  targetId: string;
  targetType: 'invoice' | 'estimate';
}

const industryLabels: Record<string, string> = {
  kitchen_bath: 'Kitchen & Bath',
  exterior: 'Exterior',
  mechanical: 'HVAC & Mechanical',
  electrical: 'Electrical',
  construction: 'General Construction'
};

const iconMap: Record<string, any> = {
  ChefHat,
  Bath,
  Home,
  Wind,
  Zap,
  Square,
  Package
};

export function ServiceLibraryDrawer({
  open,
  onClose,
  onTasksCreated,
  targetId,
  targetType
}: ServiceLibraryDrawerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateDetails, setTemplateDetails] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>([]);
  const [options, setOptions] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [metricsValues, setMetricsValues] = useState<Record<string, any>>({});
  const [optionsValues, setOptionsValues] = useState<Record<string, any>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  async function loadTemplates() {
    setLoading(true);
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load service library',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleTemplateSelect(template: Template) {
    setSelectedTemplate(template);
    setLoading(true);
    
    try {
      const details = await getTemplateWithTasks(template.id);
      setTemplateDetails(details);
      
      // Load metrics
      const { data: metricsData } = await supabase
        .from('preset_metrics')
        .select('*')
        .eq('template_id', template.id)
        .order('sort_order');
      
      setMetrics(metricsData || []);
      
      // Initialize metrics values
      const defaultMetrics: Record<string, any> = {};
      (metricsData || []).forEach((metric: any) => {
        defaultMetrics[metric.metric_key] = metric.default_value || '';
      });
      setMetricsValues(defaultMetrics);
      
      // Load options
      const { data: optionsData } = await supabase
        .from('preset_options')
        .select('*')
        .eq('template_id', template.id)
        .order('sort_order');
      
      setOptions(optionsData || []);
      
      // Initialize options values
      const defaultOptions: Record<string, any> = {};
      (optionsData || []).forEach((option: any) => {
        defaultOptions[option.option_key] = option.default_value || false;
      });
      setOptionsValues(defaultOptions);
      
    } catch (error) {
      console.error('Error loading template details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load template details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    if (!selectedTemplate || !templateDetails) return;
    
    setGenerating(true);
    try {
      // Create project tasks from template
      const tasks = await createProjectTasksFromTemplate(
        selectedTemplate.id,
        targetId,
        targetType,
        optionsValues,
        metricsValues
      );
      
      // Schedule tasks
      const scheduledTasks = await scheduleProjectTasks(tasks, new Date());
      
      // Create line items from tasks
      if (targetType === 'invoice') {
        const invoiceItems = scheduledTasks.map(task => ({
          invoice_id: targetId,
          item_name: task.label,
          description: `${task.trade} - ${task.duration_days} days`,
          quantity: task.quantity || 1,
          rate: task.rate_per_unit || 0,
          amount: task.total_amount || 0
        }));
        await supabase.from('invoice_items_enhanced').insert(invoiceItems);
      } else {
        const estimateItems = scheduledTasks.map(task => ({
          estimate_id: targetId,
          description: task.label,
          quantity: task.quantity || 1,
          rate: task.rate_per_unit || 0,
          amount: task.total_amount || 0
        }));
        await supabase.from('estimate_items').insert(estimateItems);
      }
      
      // Notify parent component
      onTasksCreated(scheduledTasks);
      
      toast({
        title: 'Success',
        description: `Generated ${tasks.length} tasks from ${selectedTemplate.name}`,
      });
      
      handleClose();
    } catch (error) {
      console.error('Error generating from template:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate from template',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  }

  function handleClose() {
    setSelectedTemplate(null);
    setTemplateDetails(null);
    setMetrics([]);
    setOptions([]);
    setMetricsValues({});
    setOptionsValues({});
    setSelectedIndustry('all');
    onClose();
  }

  const filteredTemplates = selectedIndustry === 'all' 
    ? templates 
    : templates.filter(t => t.industry === selectedIndustry);

  const industries = Array.from(new Set(templates.map(t => t.industry).filter(Boolean)));

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Service Library
          </SheetTitle>
          <SheetDescription>
            {selectedTemplate 
              ? `Configure ${selectedTemplate.name}`
              : 'Choose a service preset to generate tasks, schedule, and work orders'}
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : !selectedTemplate ? (
          <div className="py-4">
            <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry} className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                {industries.map(industry => (
                  <TabsTrigger key={industry} value={industry}>
                    {industryLabels[industry] || industry}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={selectedIndustry} className="mt-4">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {filteredTemplates.map((template) => {
                      const Icon = iconMap[template.icon || 'Package'] || Package;
                      return (
                        <Card
                          key={template.id}
                          className="cursor-pointer hover:border-primary transition-colors"
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{template.name}</CardTitle>
                                  <CardDescription className="text-sm mt-1">
                                    {template.description}
                                  </CardDescription>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {template.category}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {template.version}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="py-4">
            <Tabs defaultValue="metrics" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              </TabsList>
              
              <TabsContent value="metrics" className="mt-4">
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Enter project measurements to calculate accurate pricing
                    </AlertDescription>
                  </Alert>
                  
                  {metrics.map((metric: any) => (
                    <div key={metric.id} className="space-y-2">
                      <Label htmlFor={metric.metric_key}>
                        {metric.label}
                        {metric.required && <span className="text-destructive ml-1">*</span>}
                        {metric.unit && <span className="text-muted-foreground ml-1">({metric.unit})</span>}
                      </Label>
                      <Input
                        id={metric.metric_key}
                        type="number"
                        value={metricsValues[metric.metric_key]}
                        onChange={(e) => setMetricsValues({
                          ...metricsValues,
                          [metric.metric_key]: e.target.value
                        })}
                        placeholder={metric.label}
                        required={metric.required}
                        min={metric.min_value}
                        max={metric.max_value}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="options" className="mt-4">
                <div className="space-y-4">
                  {options.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No options available for this preset</p>
                  ) : (
                    options.map((option: any) => (
                      <div key={option.id} className="flex items-center justify-between">
                        <Label htmlFor={option.option_key} className="flex-1">
                          {option.label}
                        </Label>
                        <Switch
                          id={option.option_key}
                          checked={optionsValues[option.option_key]}
                          onCheckedChange={(checked) => setOptionsValues({
                            ...optionsValues,
                            [option.option_key]: checked
                          })}
                        />
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {templateDetails?.tasks?.map((task: any, index: number) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">{index + 1}</span>
                          <div>
                            <p className="text-sm font-medium">{task.label}</p>
                            <p className="text-xs text-muted-foreground">{task.trade} • {task.duration_days} days</p>
                          </div>
                        </div>
                        {task.is_lead_time && (
                          <Badge variant="secondary" className="text-xs">Lead Time</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="milestones" className="mt-4">
                <div className="space-y-3">
                  {templateDetails?.milestones?.map((milestone: any) => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{milestone.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {milestone.trigger_type === 'on_accept' ? 'On acceptance' : 'After tasks complete'}
                          </p>
                        </div>
                      </div>
                      <Badge>{milestone.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {selectedTemplate && (
          <SheetFooter>
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Back
            </Button>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Generate Tasks & Schedule
                </>
              )}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}