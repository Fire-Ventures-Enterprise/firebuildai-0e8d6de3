import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Building,
  Users,
  Settings,
  Globe,
  Shield,
  DollarSign,
  FileText,
  Upload,
  Palette,
  Link2,
  Plus,
  ChevronRight,
  Eye,
  UserCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Package,
  AlertCircle,
  Crown,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { appConfig } from '@/config/app.config';
import { getCurrentProfile } from '@/services/session';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Types for the different portal models
enum PortalModel {
  WHITE_LABEL = 'white_label',
  STANDALONE = 'standalone',
}

interface WhiteLabelSettings {
  companyName: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  domain: string;
  customEmail: string;
  hideFireBuildBranding: boolean;
  clientFeePerMonth: number;
  maxClients: number;
}

interface StandaloneSettings {
  companyName: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  showFireBuildBadge: boolean;
  customInvoiceTemplate: boolean;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastActive: string;
  totalProjects: number;
  totalRevenue: number;
  model: PortalModel;
}

export default function ClientPortalPage() {
  const { toast } = useToast();
  const [portalModel, setPortalModel] = useState<PortalModel>(PortalModel.STANDALONE);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  const [whiteLabelSettings, setWhiteLabelSettings] = useState<WhiteLabelSettings>({
    companyName: '',
    logo: null,
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    domain: '',
    customEmail: '',
    hideFireBuildBranding: true,
    clientFeePerMonth: 29.99,
    maxClients: 100,
  });

  const [standaloneSettings, setStandaloneSettings] = useState<StandaloneSettings>({
    companyName: '',
    logo: null,
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    showFireBuildBadge: true,
    customInvoiceTemplate: false,
  });

  // Check subscription status on mount
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const profile = await getCurrentProfile();
        if (profile) {
          setIsSubscribed(profile.is_subscribed || profile.subscription_status === 'active');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    checkSubscription();
  }, []);

  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      company: 'Smith Construction',
      address: '123 Main St, City, ST 12345',
      status: 'active',
      createdAt: '2024-01-15',
      lastActive: '2024-01-20',
      totalProjects: 5,
      totalRevenue: 45000,
      model: PortalModel.STANDALONE,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@marketingpro.com',
      phone: '(555) 987-6543',
      company: 'Marketing Pro Agency',
      address: '456 Oak Ave, Town, ST 67890',
      status: 'active',
      createdAt: '2024-01-10',
      lastActive: '2024-01-19',
      totalProjects: 12,
      totalRevenue: 120000,
      model: PortalModel.WHITE_LABEL,
    },
  ]);

  const handleLogoUpload = (model: PortalModel) => {
    // Handle logo upload
    toast({
      title: "Logo uploaded",
      description: "Your company logo has been updated successfully.",
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: `Your ${portalModel === PortalModel.WHITE_LABEL ? 'white-label' : 'standalone'} portal settings have been updated.`,
    });
  };

  const handleInviteClient = () => {
    toast({
      title: "Invitation sent",
      description: "Client portal access invitation has been sent via email.",
    });
  };

  const getMonthlyRevenue = () => {
    if (portalModel === PortalModel.WHITE_LABEL) {
      const whiteLabelClients = clients.filter(c => c.model === PortalModel.WHITE_LABEL);
      return whiteLabelClients.length * whiteLabelSettings.clientFeePerMonth;
    }
    return 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Client Portal</h1>
          <p className="text-muted-foreground mt-1">
            Manage your client access and branding settings
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview Portal
          </Button>
          <Button onClick={handleInviteClient} className="gap-2">
            <Plus className="w-4 h-4" />
            Invite Client
          </Button>
        </div>
      </div>

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Portal Model</CardTitle>
          <CardDescription>
            Choose how you want to use the client portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                portalModel === PortalModel.WHITE_LABEL
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setPortalModel(PortalModel.WHITE_LABEL)}
            >
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold">White Label Agency</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Perfect for marketing agencies. Offer FireBuildAI to your clients under your brand.
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>Complete branding control</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span>Per-client pricing model</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-primary" />
                      <span>Custom domain support</span>
                    </div>
                  </div>
                  <Badge className="mt-3" variant="secondary">
                    ${whiteLabelSettings.clientFeePerMonth}/client/month
                  </Badge>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                portalModel === PortalModel.STANDALONE
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setPortalModel(PortalModel.STANDALONE)}
            >
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold">Standalone Company</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    For individual companies managing their own clients directly.
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Palette className="w-4 h-4 text-primary" />
                      <span>Custom branding on documents</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>Branded invoices & estimates</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span>Direct client management</span>
                    </div>
                  </div>
                  <Badge className="mt-3" variant="secondary">
                    Powered by FireBuildAI
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {portalModel === PortalModel.WHITE_LABEL && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Monthly Revenue Potential</p>
                  <p className="text-sm text-muted-foreground">
                    Based on {clients.filter(c => c.model === PortalModel.WHITE_LABEL).length} active clients
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ${getMonthlyRevenue().toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          {portalModel === PortalModel.WHITE_LABEL ? (
            <Card>
              <CardHeader>
                <CardTitle>White Label Settings</CardTitle>
                <CardDescription>
                  Configure your agency branding and client management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Agency Name</Label>
                    <Input
                      placeholder="Your Agency Name"
                      value={whiteLabelSettings.companyName}
                      onChange={(e) =>
                        setWhiteLabelSettings({ ...whiteLabelSettings, companyName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Custom Domain</Label>
                    <Input
                      placeholder="portal.youragency.com"
                      value={whiteLabelSettings.domain}
                      onChange={(e) =>
                        setWhiteLabelSettings({ ...whiteLabelSettings, domain: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload your agency logo
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG or SVG (max 2MB)
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={whiteLabelSettings.primaryColor}
                        onChange={(e) =>
                          setWhiteLabelSettings({ ...whiteLabelSettings, primaryColor: e.target.value })
                        }
                        className="w-16 h-10"
                      />
                      <Input
                        value={whiteLabelSettings.primaryColor}
                        onChange={(e) =>
                          setWhiteLabelSettings({ ...whiteLabelSettings, primaryColor: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Client Fee (per month)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={whiteLabelSettings.clientFeePerMonth}
                      onChange={(e) =>
                        setWhiteLabelSettings({
                          ...whiteLabelSettings,
                          clientFeePerMonth: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className={`flex items-center justify-between p-4 bg-muted/50 rounded-lg ${!isSubscribed ? 'opacity-75' : ''}`}>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label>Hide FireBuildAI Branding</Label>
                        {!isSubscribed && (
                          <Badge variant="secondary" className="gap-1">
                            <Crown className="h-3 w-3" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Remove all FireBuildAI references from client portal
                      </p>
                    </div>
                    <Switch
                      checked={isSubscribed ? whiteLabelSettings.hideFireBuildBranding : false}
                      onCheckedChange={(checked) => {
                        if (!isSubscribed) {
                          toast({
                            title: "Premium Feature",
                            description: "White label branding is only available for subscribed companies. Upgrade to remove FireBuildAI branding.",
                            variant: "default",
                          });
                          return;
                        }
                        setWhiteLabelSettings({ ...whiteLabelSettings, hideFireBuildBranding: checked });
                      }}
                      disabled={!isSubscribed}
                    />
                  </div>
                  
                  {!isSubscribed && (
                    <Alert className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        White label branding is only available for whitelisted companies. 
                        <Button 
                          variant="link" 
                          className="px-1 h-auto font-semibold"
                          onClick={() => window.location.href = '/app/upgrade'}
                        >
                          Upgrade your plan
                        </Button>
                        to remove FireBuildAI branding from your client portal.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Standalone Settings</CardTitle>
                <CardDescription>
                  Configure your company branding for client documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    placeholder="Your Company Name"
                    value={standaloneSettings.companyName}
                    onChange={(e) =>
                      setStandaloneSettings({ ...standaloneSettings, companyName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload your company logo
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Will appear on invoices, estimates, and proposals
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Brand Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={standaloneSettings.primaryColor}
                        onChange={(e) =>
                          setStandaloneSettings({ ...standaloneSettings, primaryColor: e.target.value })
                        }
                        className="w-16 h-10"
                      />
                      <Input
                        value={standaloneSettings.primaryColor}
                        onChange={(e) =>
                          setStandaloneSettings({ ...standaloneSettings, primaryColor: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Brand Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={standaloneSettings.secondaryColor}
                        onChange={(e) =>
                          setStandaloneSettings({ ...standaloneSettings, secondaryColor: e.target.value })
                        }
                        className="w-16 h-10"
                      />
                      <Input
                        value={standaloneSettings.secondaryColor}
                        onChange={(e) =>
                          setStandaloneSettings({ ...standaloneSettings, secondaryColor: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Show "Powered by FireBuildAI" Badge - Restricted for free users */}
                  <div className="relative">
                    <div className={`flex items-center justify-between p-4 bg-muted/50 rounded-lg ${!isSubscribed ? 'opacity-75' : ''}`}>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Label>Show "Powered by FireBuildAI" Badge</Label>
                          {!isSubscribed && (
                            <Badge variant="secondary" className="gap-1">
                              <Crown className="h-3 w-3" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Display FireBuildAI branding on client portal
                        </p>
                      </div>
                      <Switch
                        checked={isSubscribed ? standaloneSettings.showFireBuildBadge : true}
                        onCheckedChange={(checked) => {
                          if (!isSubscribed) {
                            toast({
                              title: "Premium Feature",
                              description: "Removing the FireBuildAI badge is only available for subscribed companies. Upgrade to remove branding.",
                              variant: "default",
                            });
                            return;
                          }
                          setStandaloneSettings({ ...standaloneSettings, showFireBuildBadge: checked });
                        }}
                        disabled={!isSubscribed}
                      />
                    </div>
                    
                    {!isSubscribed && (
                      <Alert className="mt-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This feature is only available for whitelisted companies. 
                          <Button 
                            variant="link" 
                            className="px-1 h-auto font-semibold"
                            onClick={() => window.location.href = '/app/upgrade'}
                          >
                            Upgrade your plan
                          </Button>
                          to remove FireBuildAI branding from your client portal.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Custom Invoice Templates */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Custom Invoice Templates</Label>
                      <p className="text-sm text-muted-foreground">
                        Use custom designed invoice and estimate templates
                      </p>
                    </div>
                    <Switch
                      checked={standaloneSettings.customInvoiceTemplate}
                      onCheckedChange={(checked) =>
                        setStandaloneSettings({ ...standaloneSettings, customInvoiceTemplate: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} size="lg">
              Save Settings
            </Button>
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Clients</CardTitle>
              <CardDescription>
                Manage client access and view their portal activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{client.name}</h3>
                          <Badge
                            variant={client.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {client.status}
                          </Badge>
                          {client.model === PortalModel.WHITE_LABEL && (
                            <Badge variant="outline" className="text-xs">
                              White Label
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{client.company}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {client.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <span>{client.totalProjects} projects</span>
                          <span>${client.totalRevenue.toLocaleString()} revenue</span>
                          <span>Last active: {client.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Clients</p>
                    <p className="text-2xl font-bold">{clients.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Portals</p>
                    <p className="text-2xl font-bold">
                      {clients.filter((c) => c.status === 'active').length}
                    </p>
                  </div>
                  <Building className="w-8 h-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                    <p className="text-2xl font-bold">${getMonthlyRevenue()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Per Client</p>
                    <p className="text-2xl font-bold">
                      ${clients.length > 0 ? (
                        clients.reduce((acc, c) => acc + c.totalRevenue, 0) / clients.length
                      ).toFixed(0) : 0}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Portal Usage Stats</CardTitle>
              <CardDescription>
                Client portal activity over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Portal analytics will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}