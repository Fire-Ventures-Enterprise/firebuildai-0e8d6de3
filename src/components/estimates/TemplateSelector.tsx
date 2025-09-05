import { useState, useEffect } from 'react';
import { Loader2, Package, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  getTemplates,
  getTemplateWithTasks,
  createProjectTasksFromTemplate,
  scheduleProjectTasks,
  ensureKitchenRemodelTemplate,
  type Template,
  type ProjectTask
} from '@/services/templates';

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onTasksCreated: (tasks: ProjectTask[]) => void;
  targetId: string;
  targetType: 'invoice' | 'estimate';
}

export function TemplateSelector({
  open,
  onClose,
  onTasksCreated,
  targetId,
  targetType
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateDetails, setTemplateDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'configure' | 'preview'>('select');
  const [options, setOptions] = useState<Record<string, any>>({});
  const [params, setParams] = useState<Record<string, any>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  async function loadTemplates() {
    setLoading(true);
    try {
      // Ensure Kitchen Remodel template exists
      await ensureKitchenRemodelTemplate();
      
      // Load all templates
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load templates',
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
      
      // Initialize options with defaults
      const defaultOptions: Record<string, any> = {};
      if (template.options_schema) {
        Object.entries(template.options_schema).forEach(([key, schema]: [string, any]) => {
          defaultOptions[key] = schema.default;
        });
      }
      setOptions(defaultOptions);
      
      // Initialize params
      const defaultParams: Record<string, any> = {};
      if (template.params_schema) {
        Object.entries(template.params_schema).forEach(([key, schema]: [string, any]) => {
          defaultParams[key] = schema.default || '';
        });
      }
      setParams(defaultParams);
      
      setStep('configure');
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
    
    setLoading(true);
    try {
      // Create project tasks from template
      const tasks = await createProjectTasksFromTemplate(
        selectedTemplate.id,
        targetId,
        targetType,
        options,
        params
      );
      
      // Schedule tasks
      const scheduledTasks = await scheduleProjectTasks(tasks, new Date());
      
      // Notify parent component
      onTasksCreated(scheduledTasks);
      
      toast({
        title: 'Success',
        description: `Created ${tasks.length} tasks from template`
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
      setLoading(false);
    }
  }

  function handleClose() {
    setSelectedTemplate(null);
    setTemplateDetails(null);
    setStep('select');
    setOptions({});
    setParams({});
    onClose();
  }

  const renderTemplateList = () => (
    <div className="space-y-3">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => handleTemplateSelect(template)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );

  const renderConfiguration = () => {
    if (!selectedTemplate || !templateDetails) return null;

    return (
      <div className="space-y-6">
        {/* Options */}
        {selectedTemplate.options_schema && (
          <div className="space-y-4">
            <h3 className="font-medium">Template Options</h3>
            {Object.entries(selectedTemplate.options_schema).map(([key, schema]: [string, any]) => (
              <div key={key}>
                {schema.type === 'boolean' ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={options[key]}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, [key]: checked })
                      }
                    />
                    <Label htmlFor={key}>{schema.label}</Label>
                  </div>
                ) : schema.type === 'select' ? (
                  <div className="space-y-2">
                    <Label htmlFor={key}>{schema.label}</Label>
                    <Select
                      value={options[key]}
                      onValueChange={(value) => 
                        setOptions({ ...options, [key]: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {schema.options.map((option: string) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {/* Parameters */}
        {selectedTemplate.params_schema && (
          <div className="space-y-4">
            <h3 className="font-medium">Project Measurements</h3>
            {Object.entries(selectedTemplate.params_schema).map(([key, schema]: [string, any]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>
                  {schema.label}
                  {schema.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <Input
                  id={key}
                  type="number"
                  value={params[key]}
                  onChange={(e) => 
                    setParams({ ...params, [key]: e.target.value })
                  }
                  placeholder={schema.label}
                  required={schema.required}
                />
              </div>
            ))}
          </div>
        )}

        {/* Preview of tasks */}
        <div className="space-y-2">
          <h3 className="font-medium">Tasks to be created</h3>
          <ScrollArea className="h-[200px] border rounded-md p-3">
            <div className="space-y-2">
              {templateDetails.tasks
                .filter((task: any) => {
                  if (!task.enabled_condition) return true;
                  if (task.enabled_condition.startsWith('options.')) {
                    const field = task.enabled_condition.replace('options.', '');
                    return !!options[field];
                  }
                  return true;
                })
                .map((task: any) => (
                  <div key={task.id} className="text-sm flex items-center justify-between">
                    <span>{task.label}</span>
                    <span className="text-muted-foreground">{task.trade}</span>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {step === 'select' ? 'Select Template' : 'Configure Template'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' 
              ? 'Choose a project template to automatically generate tasks and schedule'
              : `Configuring: ${selectedTemplate?.name}`}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="py-4">
              {step === 'select' && renderTemplateList()}
              {step === 'configure' && renderConfiguration()}
            </div>

            <div className="flex justify-between">
              {step === 'configure' && (
                <>
                  <Button variant="outline" onClick={() => setStep('select')}>
                    Back
                  </Button>
                  <Button onClick={handleGenerate} disabled={loading}>
                    Generate Tasks
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}