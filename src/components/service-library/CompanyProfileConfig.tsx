import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  CompanyProfile, 
  IndustryType, 
  DefaultCompanyProfiles,
  ServiceCategories
} from '@/types/industry';

interface CompanyProfileConfigProps {
  currentProfile?: CompanyProfile;
  onProfileUpdate?: (profile: CompanyProfile) => void;
}

export function CompanyProfileConfig({ currentProfile, onProfileUpdate }: CompanyProfileConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<CompanyProfile>(
    currentProfile || DefaultCompanyProfiles.general_contractor
  );
  const [formData, setFormData] = useState<CompanyProfile>(
    currentProfile || DefaultCompanyProfiles.general_contractor
  );
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProfiles: CompanyProfile[] = data?.map(p => ({
        id: p.id,
        name: p.name,
        primaryIndustry: p.primary_industry as IndustryType,
        secondaryIndustries: (p.secondary_industries as IndustryType[]) || [],
        servicesEnabled: (p.services_enabled as any) || { useIndustryDefaults: true },
        workingHours: p.working_hours as any,
        holidays: p.holidays || [],
        bufferDaysPerTask: p.buffer_days_per_task || 0.1
      })) || [];

      // Add default profiles if no custom ones exist
      if (formattedProfiles.length === 0) {
        formattedProfiles.push(...Object.values(DefaultCompanyProfiles));
      }

      setProfiles(formattedProfiles);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const profileData = {
        name: formData.name,
        primary_industry: formData.primaryIndustry,
        secondary_industries: formData.secondaryIndustries || [],
        services_enabled: formData.servicesEnabled,
        working_hours: formData.workingHours,
        holidays: formData.holidays || [],
        buffer_days_per_task: formData.bufferDaysPerTask,
        user_id: user.id
      };

      // Check if profile exists
      const { data: existing } = await supabase
        .from('company_profiles')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', formData.name)
        .single();

      if (existing) {
        // Update existing
        await supabase
          .from('company_profiles')
          .update(profileData)
          .eq('id', existing.id);
      } else {
        // Create new
        await supabase
          .from('company_profiles')
          .insert([profileData]);
      }

      toast({
        title: 'Success',
        description: 'Company profile saved successfully'
      });

      onProfileUpdate?.(formData);
      setSelectedProfile(formData);
      setIsOpen(false);
      await loadProfiles();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save company profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const availableIndustries = Object.values(IndustryType);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Label>Company Profile</Label>
          <p className="text-sm text-muted-foreground">
            Current: {selectedProfile.name}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFormData(selectedProfile);
            setIsOpen(true);
          }}
        >
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Company Profile Configuration</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="industries">Industries</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Profile Name</Label>
                <Input
                  id="profile-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., My Flooring Company"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-industry">Primary Industry</Label>
                <Select
                  value={formData.primaryIndustry}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    primaryIndustry: value as IndustryType 
                  }))}
                >
                  <SelectTrigger id="primary-industry">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIndustries.map(industry => (
                      <SelectItem key={industry} value={industry}>
                        {industry.replace(/_/g, ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Buffer Days Per Task</Label>
                <Input
                  type="number"
                  step="0.05"
                  value={formData.bufferDaysPerTask}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    bufferDaysPerTask: parseFloat(e.target.value) 
                  }))}
                  placeholder="0.1"
                />
                <p className="text-xs text-muted-foreground">
                  Additional buffer time added to each task (e.g., 0.1 = 10% buffer)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="industries" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Secondary Industries</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Select additional industries to access their service templates
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {availableIndustries
                    .filter(ind => ind !== formData.primaryIndustry)
                    .map(industry => (
                      <label
                        key={industry}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.secondaryIndustries?.includes(industry) || false}
                          onChange={(e) => {
                            const current = formData.secondaryIndustries || [];
                            const updated = e.target.checked
                              ? [...current, industry]
                              : current.filter(i => i !== industry);
                            setFormData(prev => ({ 
                              ...prev, 
                              secondaryIndustries: updated 
                            }));
                          }}
                          className="rounded border-input"
                        />
                        <span className="text-sm">
                          {industry.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </label>
                    ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Available Service Categories</Label>
                <ScrollArea className="h-[200px] border rounded-md p-3">
                  <div className="space-y-2">
                    {Object.entries(ServiceCategories).map(([category, services]) => {
                      const relevantServices = services.filter(service => {
                        const industries = [
                          formData.primaryIndustry,
                          ...(formData.secondaryIndustries || [])
                        ];
                        return service.industryTypes.some(type => 
                          industries.includes(type)
                        );
                      });

                      if (relevantServices.length === 0) return null;

                      return (
                        <div key={category}>
                          <p className="font-medium text-sm mb-1">
                            {category.replace(/_/g, ' ').toUpperCase()}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {relevantServices.map(service => (
                              <Badge 
                                key={service.id} 
                                variant="secondary" 
                                className="text-xs"
                              >
                                {service.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Service Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Use Industry Defaults</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically include standard services for your industries
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.servicesEnabled.useIndustryDefaults}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        servicesEnabled: {
                          ...prev.servicesEnabled,
                          useIndustryDefaults: e.target.checked
                        }
                      }))}
                      className="rounded border-input"
                    />
                  </div>

                  {formData.servicesEnabled.customCategories && (
                    <div className="space-y-2">
                      <Label>Custom Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.servicesEnabled.customCategories.map(cat => (
                          <Badge key={cat} variant="outline">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Working Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configure default working hours for scheduling
                  </p>
                  {/* Working hours configuration would go here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={loading}>
              Save Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}