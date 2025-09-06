import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ServiceDefinition, IndustryType, ServicePhase } from '@/types/industry';

interface CustomServiceManagerProps {
  companyProfileId?: string;
  onServiceAdded?: (service: ServiceDefinition) => void;
  onServiceUpdated?: (service: ServiceDefinition) => void;
  onServiceDeleted?: (serviceId: string) => void;
}

export function CustomServiceManager({
  companyProfileId,
  onServiceAdded,
  onServiceUpdated,
  onServiceDeleted
}: CustomServiceManagerProps) {
  const [customServices, setCustomServices] = useState<ServiceDefinition[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<Partial<ServiceDefinition>>({
    name: '',
    description: '',
    category: '',
    estimatedDuration: '',
    duration_days: 1,
    industryTypes: [IndustryType.CUSTOM],
    phases: []
  });

  const [currentPhase, setCurrentPhase] = useState<Partial<ServicePhase>>({
    name: '',
    duration: '',
    duration_days: 0.5,
    type: 'work',
    description: ''
  });

  useEffect(() => {
    loadCustomServices();
  }, []);

  const loadCustomServices = async () => {
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      // Use RPC or direct query with type assertion
      const { data: services, error } = await supabase
        .rpc('get_custom_services', { p_user_id: user.id })
        .returns<any[]>();

      if (error) {
        // Fallback to direct query if RPC doesn't exist
        const { data: directServices } = await supabase
          .from('custom_services' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (directServices) {
          const formattedServices: ServiceDefinition[] = directServices.map((s: any) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            category: s.category,
            estimatedDuration: s.estimated_duration,
            duration_days: s.duration_days,
            industryTypes: s.industry_types || [IndustryType.CUSTOM],
            phases: s.phases || [],
            materials: s.materials || [],
            dependencies: s.dependencies || {},
            productSelection: s.product_selection,
            isCustom: true,
            userId: s.user_id
          }));
          setCustomServices(formattedServices);
        }
      } else if (services) {
        const formattedServices: ServiceDefinition[] = services.map((s: any) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          category: s.category,
          estimatedDuration: s.estimated_duration,
          duration_days: s.duration_days,
          industryTypes: s.industry_types || [IndustryType.CUSTOM],
          phases: s.phases || [],
          materials: s.materials || [],
          dependencies: s.dependencies || {},
          productSelection: s.product_selection,
          isCustom: true,
          userId: s.user_id
        }));
        setCustomServices(formattedServices);
      }
    } catch (error) {
      console.error('Error loading custom services:', error);
      toast({
        title: 'Error',
        description: 'Failed to load custom services',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async () => {
    if (!formData.name || !formData.description || !formData.category) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const serviceData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        estimated_duration: formData.estimatedDuration,
        duration_days: formData.duration_days,
        industry_types: formData.industryTypes,
        phases: formData.phases,
        materials: formData.materials,
        dependencies: formData.dependencies,
        product_selection: formData.productSelection,
        user_id: user.id
      };

      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('custom_services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;

        const updatedService: ServiceDefinition = {
          ...formData as ServiceDefinition,
          id: editingService.id,
          isCustom: true,
          userId: user.id
        };

        setCustomServices(prev => 
          prev.map(s => s.id === editingService.id ? updatedService : s)
        );

        onServiceUpdated?.(updatedService);

        toast({
          title: 'Success',
          description: 'Service updated successfully'
        });
      } else {
        // Create new service
        const { data, error } = await supabase
          .from('custom_services')
          .insert([serviceData])
          .select()
          .single();

        if (error) throw error;

        const newService: ServiceDefinition = {
          ...formData as ServiceDefinition,
          id: data.id,
          isCustom: true,
          userId: user.id
        };

        setCustomServices(prev => [newService, ...prev]);
        onServiceAdded?.(newService);

        toast({
          title: 'Success',
          description: 'Service created successfully'
        });
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: 'Failed to save service',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('custom_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      setCustomServices(prev => prev.filter(s => s.id !== serviceId));
      onServiceDeleted?.(serviceId);

      toast({
        title: 'Success',
        description: 'Service deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service: ServiceDefinition) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      estimatedDuration: service.estimatedDuration,
      duration_days: service.duration_days,
      industryTypes: service.industryTypes,
      phases: service.phases || [],
      materials: service.materials,
      dependencies: service.dependencies,
      productSelection: service.productSelection
    });
    setIsDialogOpen(true);
  };

  const handleAddPhase = () => {
    if (!currentPhase.name || !currentPhase.duration) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in phase name and duration',
        variant: 'destructive'
      });
      return;
    }

    const newPhase: ServicePhase = {
      id: `phase_${Date.now()}`,
      name: currentPhase.name!,
      duration: currentPhase.duration!,
      duration_days: currentPhase.duration_days || 0.5,
      type: currentPhase.type as 'work' | 'waiting_period' | 'vendor_process',
      description: currentPhase.description
    };

    setFormData(prev => ({
      ...prev,
      phases: [...(prev.phases || []), newPhase]
    }));

    setCurrentPhase({
      name: '',
      duration: '',
      duration_days: 0.5,
      type: 'work',
      description: ''
    });
  };

  const handleRemovePhase = (phaseId: string) => {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases?.filter(p => p.id !== phaseId)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      estimatedDuration: '',
      duration_days: 1,
      industryTypes: [IndustryType.CUSTOM],
      phases: []
    });
    setCurrentPhase({
      name: '',
      duration: '',
      duration_days: 0.5,
      type: 'work',
      description: ''
    });
    setEditingService(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Custom Services</h3>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Service
        </Button>
      </div>

      {loading && customServices.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading services...
        </div>
      ) : customServices.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No custom services yet. Create your first custom service to get started.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customServices.map(service => (
            <Card key={service.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditService(service)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-secondary px-2 py-1 rounded">
                    {service.category}
                  </span>
                  <span className="bg-secondary px-2 py-1 rounded">
                    {service.estimatedDuration || `${service.duration_days} days`}
                  </span>
                  {service.phases && service.phases.length > 0 && (
                    <span className="bg-primary/10 px-2 py-1 rounded">
                      {service.phases.length} phases
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Create Custom Service'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Subfloor Preparation"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the service"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Preparation"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    step="0.5"
                    value={formData.duration_days}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      duration_days: parseFloat(e.target.value),
                      estimatedDuration: `${e.target.value} days`
                    }))}
                    placeholder="1.5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Service Phases (Optional)</Label>
                {formData.phases && formData.phases.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {formData.phases.map(phase => (
                      <div key={phase.id} className="flex items-center justify-between bg-secondary/50 p-2 rounded">
                        <div className="flex-1">
                          <span className="font-medium">{phase.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({phase.duration})
                          </span>
                          {phase.type !== 'work' && (
                            <span className="text-xs bg-primary/10 px-2 py-0.5 rounded ml-2">
                              {phase.type}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleRemovePhase(phase.id!)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border rounded-lg p-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Phase name"
                      value={currentPhase.name}
                      onChange={(e) => setCurrentPhase(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Duration (e.g., 2-3 hours)"
                      value={currentPhase.duration}
                      onChange={(e) => setCurrentPhase(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      value={currentPhase.type}
                      onValueChange={(value) => setCurrentPhase(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="waiting_period">Waiting Period</SelectItem>
                        <SelectItem value="vendor_process">Vendor Process</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddPhase}
                    >
                      Add Phase
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveService} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}