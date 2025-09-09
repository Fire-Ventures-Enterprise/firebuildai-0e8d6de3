import { useState, useEffect } from 'react';
import { 
  Package, 
  Wind, 
  Zap, 
  Droplets, 
  Bath, 
  ChefHat, 
  Square, 
  Trees, 
  Home, 
  Lightbulb, 
  Paintbrush2,
  X,
  Settings,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { CompanyProfileConfig } from './CompanyProfileConfig';
import { 
  getTemplates,
  getTemplateWithTasks,
  createProjectTasksFromTemplate,
  scheduleProjectTasks,
  ensureKitchenRemodelTemplate
} from '@/services/templates';
import { ProjectTask } from '@/types/projectTasks';
import { DefaultCompanyProfiles } from '@/types/industry';
import { supabase } from '@/integrations/supabase/client';

const iconMap = {
  Package,
  Wind,
  Zap,
  Droplets,
  Bath,
  ChefHat,
  Square,
  Trees,
  Home,
  Lightbulb,
  Paintbrush2,
  Building2
};

const industryLabels = {
  general_contractor: 'General Contractor',
  flooring: 'Flooring',
  hvac: 'HVAC',
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  bathroom: 'Bathroom Renovation',
  kitchen: 'Kitchen Renovation',
  landscaping: 'Landscaping',
  roofing: 'Roofing',
  lighting: 'Lighting',
  painting: 'Painting'
};

interface ServiceLibraryDrawerProps {
  open: boolean;
  onClose: () => void;
  onTasksCreated?: (tasks: ProjectTask[]) => void;
  targetId?: string;
  targetType?: 'invoice' | 'estimate';
  companyProfile?: any;
  onProfileUpdate?: (profile: any) => void;
}

export function ServiceLibraryDrawer({ 
  open, 
  onClose, 
  onTasksCreated,
  targetId,
  targetType = 'invoice',
  companyProfile = DefaultCompanyProfiles.general_contractor,
  onProfileUpdate
}: ServiceLibraryDrawerProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [templateDetails, setTemplateDetails] = useState<any>(null);
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [options, setOptions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [showConfig, setShowConfig] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await getTemplates();
      setTemplates(data);
      
      // Ensure at least one template exists
      if (data.length === 0) {
        const defaultTemplate = await ensureKitchenRemodelTemplate();
        if (defaultTemplate) {
          setTemplates([defaultTemplate]);
        }
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load service templates',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = async (template: any) => {
    setSelectedTemplate(template);
    setLoading(true);
    
    try {
      const details = await getTemplateWithTasks(template.id);
      setTemplateDetails(details);
      
      // Set default metrics and options for now
      setMetrics({
        square_footage: 150,
        num_workers: 2
      });
      
      setOptions({
        include_permits: true,
        include_materials: true
      });
    } catch (error) {
      console.error('Failed to load template details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load template details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !templateDetails || !targetId) return;
    
    setGenerating(true);
    try {
      // Create project tasks from template
      const tasks = await createProjectTasksFromTemplate(
        selectedTemplate.id,
        targetId,
        targetType,
        options,
        metrics
      );
      
      // Schedule the tasks
      const scheduledTasks = await scheduleProjectTasks(
        tasks,
        new Date()
      );
      
      // Insert scheduled tasks as line items based on target type
      if (targetType === 'invoice') {
        const lineItems = scheduledTasks.map((task, index) => ({
          invoice_id: targetId,
          description: `${task.label} - ${task.trade || 'General'} (${task.duration_days} days)`,
          quantity: 1,
          rate: 0, // Will be set by user
          amount: 0,
          sort_order: index
        }));
        
        const { error } = await supabase
          .from('invoice_items')
          .insert(lineItems);
        
        if (error) throw error;
      } else {
        const lineItems = scheduledTasks.map((task, index) => ({
          estimate_id: targetId,
          description: `${task.label} - ${task.trade || 'General'} (${task.duration_days} days)`,
          quantity: 1,
          rate: 0, // Will be set by user
          amount: 0,
          sort_order: index
        }));
        
        const { error } = await supabase
          .from('estimate_items')
          .insert(lineItems);
        
        if (error) throw error;
      }
      
      toast({
        title: 'Success',
        description: `Generated ${scheduledTasks.length} tasks and schedule`,
      });
      
      // Map scheduled tasks to the correct format for project_tasks
      const mappedTasks = scheduledTasks.map(task => ({
        ...task,
        status: task.status === 'pending' ? 'planned' as const : task.status
      }));
      
      onTasksCreated?.(mappedTasks);
      handleClose();
    } catch (error) {
      console.error('Failed to generate tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate tasks and schedule',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    setTemplateDetails(null);
    setMetrics({});
    setOptions({});
    setSelectedIndustry('all');
    onClose();
  };

  const filteredTemplates = selectedIndustry === 'all' 
    ? templates 
    : templates.filter(t => t.industry === selectedIndustry);

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Service Library</span>
            </SheetTitle>
            {companyProfile && onProfileUpdate && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowConfig(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            )}
          </div>
          <SheetDescription>
            {companyProfile?.name} - Choose a service template to generate tasks and schedules
          </SheetDescription>
        </SheetHeader>

        {loading && !selectedTemplate ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          </div>
        ) : !selectedTemplate ? (
          <>
            <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry} className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({templates.length})</TabsTrigger>
                <TabsTrigger value="general_contractor">General</TabsTrigger>
                <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
                <TabsTrigger value="bathroom">Bathroom</TabsTrigger>
              </TabsList>
              
              <TabsContent value={selectedIndustry} className="mt-4">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {filteredTemplates.map((template) => {
                      const Icon = iconMap[template.icon as keyof typeof iconMap] || Package;
                      return (
                        <Card 
                          key={template.id}
                          className="cursor-pointer hover:shadow-md transition-all"
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Icon className="h-5 w-5 text-primary" />
                                <div>
                                  <CardTitle className="text-base">{template.name}</CardTitle>
                                  <Badge variant="outline" className="mt-1">
                                    {industryLabels[template.industry as keyof typeof industryLabels] || template.industry}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription>{template.description}</CardDescription>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                ← Back
              </Button>
              <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
              </div>
            ) : templateDetails && (
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="options">Options</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                </TabsList>
                
                <TabsContent value="metrics" className="space-y-4">
                  <h4 className="text-sm font-medium">Project Metrics</h4>
                  {templateDetails.metrics?.map((metric: any) => (
                    <div key={metric.id} className="space-y-2">
                      <Label htmlFor={metric.metric_name}>
                        {metric.display_name} ({metric.unit})
                      </Label>
                      <Input
                        id={metric.metric_name}
                        type="number"
                        value={metrics[metric.metric_name] || metric.default_value || 0}
                        onChange={(e) => setMetrics({
                          ...metrics,
                          [metric.metric_name]: parseFloat(e.target.value)
                        })}
                      />
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="options" className="space-y-4">
                  <h4 className="text-sm font-medium">Service Options</h4>
                  {templateDetails.options?.map((option: any) => (
                    <div key={option.id} className="flex items-center justify-between">
                      <Label htmlFor={option.option_name} className="flex-1">
                        {option.display_name}
                        {option.description && (
                          <span className="block text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </Label>
                      <Switch
                        id={option.option_name}
                        checked={options[option.option_name] || option.default_selected || false}
                        onCheckedChange={(checked) => setOptions({
                          ...options,
                          [option.option_name]: checked
                        })}
                      />
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="tasks" className="space-y-2">
                  <h4 className="text-sm font-medium">Tasks ({templateDetails.tasks?.length || 0})</h4>
                  <ScrollArea className="h-[300px]">
                    {templateDetails.tasks?.map((task: any, index: number) => (
                      <div key={task.id} className="flex items-center space-x-2 py-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="text-sm">{task.task_name}</span>
                        <Badge variant="secondary">{task.duration_days}d</Badge>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="milestones" className="space-y-2">
                  <h4 className="text-sm font-medium">Milestones</h4>
                  <div className="space-y-3">
                    {templateDetails.milestones?.map((milestone: any) => (
                      <div key={milestone.id} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{milestone.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {milestone.percentage}% complete
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
        
        <SheetFooter className="mt-6">
          {selectedTemplate && (
            <Button 
              onClick={handleGenerate} 
              disabled={generating || !templateDetails}
              className="w-full"
            >
              {generating ? 'Generating...' : 'Generate Tasks & Schedule'}
            </Button>
          )}
        </SheetFooter>

        {/* Configuration Modal */}
        {showConfig && companyProfile && onProfileUpdate && (
          <CompanyProfileConfig
            companyProfile={companyProfile}
            onProfileUpdate={(updatedProfile: any) => {
              onProfileUpdate(updatedProfile);
              setShowConfig(false);
            }}
            onClose={() => setShowConfig(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}