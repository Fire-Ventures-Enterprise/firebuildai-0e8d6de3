import { useState } from 'react';
import { X, Save, Plus, Trash2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { IndustryType } from '@/types/industry';

interface CompanyProfileConfigProps {
  companyProfile: any;
  onProfileUpdate: (profile: any) => void;
  onClose: () => void;
}

export function CompanyProfileConfig({ companyProfile, onProfileUpdate, onClose }: CompanyProfileConfigProps) {
  const [editedProfile, setEditedProfile] = useState(companyProfile);
  const { toast } = useToast();

  const handleSave = () => {
    onProfileUpdate(editedProfile);
    toast({
      title: 'Profile Updated',
      description: 'Company profile has been successfully updated',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Company Profile Configuration</h2>
              <p className="text-sm text-muted-foreground">Customize your service library settings</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(90vh-200px)]">
          <div className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={editedProfile.name || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between p-6 border-t bg-muted/30">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}