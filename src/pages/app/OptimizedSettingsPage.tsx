import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Bell, 
  Smartphone, 
  Palette, 
  Shield, 
  CreditCard,
  Save,
  Check,
  Upload,
  Lock,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { BreadcrumbNavigation } from '@/components/navigation/BreadcrumbNavigation';
import { useAsyncToast } from '@/hooks/useAsyncToast';
import { getCurrentProfile } from '@/services/session';
import { supabase } from '@/integrations/supabase/client';

interface UserSettings {
  // Profile
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  profilePhoto: string;
  
  // Notifications
  emailNotifications: {
    estimates: boolean;
    invoices: boolean;
    payments: boolean;
    jobs: boolean;
    teamUpdates: boolean;
    systemUpdates: boolean;
  };
  pushNotifications: {
    estimates: boolean;
    invoices: boolean;
    payments: boolean;
    jobs: boolean;
    teamUpdates: boolean;
    systemUpdates: boolean;
  };
  smsNotifications: {
    estimates: boolean;
    invoices: boolean;
    payments: boolean;
    jobs: boolean;
    teamUpdates: boolean;
    systemUpdates: boolean;
  };
  
  // Preferences
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  
  // Privacy
  dataSharingAnalytics: boolean;
  dataSharingMarketing: boolean;
  profileVisibility: 'public' | 'team' | 'private';
  
  // Security
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
  requirePasswordChange: boolean;
  
  // UI Preferences
  sidebarCollapsed: boolean;
  itemsPerPage: number;
}

export const OptimizedSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const { run: runAsync } = useAsyncToast();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [settings, setSettings] = useState<UserSettings>({
    // Profile defaults
    fullName: 'John Doe',
    email: 'test@firebuildai.com',
    phoneNumber: '+1 (555) 000-0000',
    position: 'Project Manager',
    profilePhoto: '',
    
    // Notification defaults
    emailNotifications: {
      estimates: true,
      invoices: true,
      payments: true,
      jobs: true,
      teamUpdates: true,
      systemUpdates: false,
    },
    pushNotifications: {
      estimates: true,
      invoices: true,
      payments: true,
      jobs: true,
      teamUpdates: true,
      systemUpdates: false,
    },
    smsNotifications: {
      estimates: false,
      invoices: false,
      payments: true,
      jobs: false,
      teamUpdates: false,
      systemUpdates: false,
    },
    
    // Preference defaults
    theme: 'auto',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    
    // Privacy defaults
    dataSharingAnalytics: true,
    dataSharingMarketing: false,
    profileVisibility: 'team',
    
    // Security defaults
    twoFactorEnabled: false,
    sessionTimeoutMinutes: 480,
    requirePasswordChange: false,
    
    // UI defaults
    sidebarCollapsed: false,
    itemsPerPage: 25,
  });

  React.useEffect(() => {
    // Load user profile data
    const loadProfile = async () => {
      const profile = await getCurrentProfile();
      if (profile) {
        setSettings(prev => ({
          ...prev,
          fullName: profile.full_name || '',
          email: profile.email,
        }));
      }
    };
    loadProfile();
  }, []);

  const handleSaveSettings = useCallback(async () => {
    const result = await runAsync(
      async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Update profile
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: settings.fullName,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) throw error;

        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        return true;
      },
      [],
      {
        pending: 'Saving settings...',
        success: 'Settings saved successfully',
        error: 'Failed to save settings'
      }
    );

    return result;
  }, [settings, runAsync]);

  const updateSetting = useCallback((path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
    setHasUnsavedChanges(true);
  }, []);

  const breadcrumbItems = [
    { label: 'Settings', current: true }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <BreadcrumbNavigation items={breadcrumbItems} />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your application settings and preferences</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {lastSaved && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-success" />
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
            
            <Button 
              onClick={handleSaveSettings}
              disabled={!hasUnsavedChanges || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
        
        {hasUnsavedChanges && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning-foreground">
              You have unsaved changes. Don't forget to save your settings.
            </p>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={settings.profilePhoto} />
                  <AvatarFallback className="text-lg bg-muted">
                    {settings.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={settings.fullName}
                    onChange={(e) => updateSetting('fullName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={settings.phoneNumber}
                    onChange={(e) => updateSetting('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={settings.position}
                    onChange={(e) => updateSetting('position', e.target.value)}
                    placeholder="Project Manager"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>
                Configure your language, timezone, and currency preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => updateSetting('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs placeholder content */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  {Object.entries(settings.emailNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={`email-${key}`} className="font-normal capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Switch
                        id={`email-${key}`}
                        checked={value}
                        onCheckedChange={(checked) => updateSetting(`emailNotifications.${key}`, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize your interface appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.theme} onValueChange={(value: any) => updateSetting('theme', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="analytics" className="font-normal">
                  Share usage data for analytics
                </Label>
                <Switch
                  id="analytics"
                  checked={settings.dataSharingAnalytics}
                  onCheckedChange={(checked) => updateSetting('dataSharingAnalytics', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure your security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="2fa" className="font-normal">
                  Two-factor authentication
                </Label>
                <Switch
                  id="2fa"
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(checked) => updateSetting('twoFactorEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Device Management</CardTitle>
              <CardDescription>Manage your connected devices</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No devices connected</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Billing information will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizedSettingsPage;
