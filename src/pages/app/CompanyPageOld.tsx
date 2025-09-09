import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Upload, 
  FileText, 
  Shield, 
  Users, 
  MessageSquare,
  Plus,
  Download,
  Trash2,
  Send,
  Camera,
  File,
  UserPlus,
  Settings,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Clock,
  Palette,
  Key,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Edit,
  Save,
  X,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleCalendarSettings } from '@/components/integrations/GoogleCalendarSettings';

interface CompanyDetails {
  // Basic Information
  companyName: string;
  businessType: string;
  industry: string;
  description: string;
  foundedYear: number;
  employeeCount: number;
  annualRevenue: string;
  
  // Contact Information
  phone: string;
  email: string;
  website: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Legal Information
  taxId: string;
  registrationNumber: string;
  
  // Branding
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  
  // Business Operations
  businessHours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  serviceAreas: string[];
  certifications: string[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  permissions: string[];
}

export default function CompanyPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [setupProgress, setSetupProgress] = useState(75);
  
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    companyName: 'FireBuild Construction',
    businessType: 'LLC',
    industry: 'Construction',
    description: 'Full-service construction company specializing in residential and commercial projects.',
    foundedYear: 2020,
    employeeCount: 25,
    annualRevenue: '$1M-5M',
    phone: '+1 (555) 123-4567',
    email: 'info@firebuild.com',
    website: 'www.firebuild.com',
    address: '123 Construction Ave',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    taxId: '12-3456789',
    registrationNumber: 'LLC-2020-001',
    logoUrl: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#64748B',
    businessHours: {
      monday: { open: '08:00', close: '17:00', isOpen: true },
      tuesday: { open: '08:00', close: '17:00', isOpen: true },
      wednesday: { open: '08:00', close: '17:00', isOpen: true },
      thursday: { open: '08:00', close: '17:00', isOpen: true },
      friday: { open: '08:00', close: '17:00', isOpen: true },
      saturday: { open: '09:00', close: '15:00', isOpen: true },
      sunday: { open: '00:00', close: '00:00', isOpen: false },
    },
    serviceAreas: ['New York City', 'Brooklyn', 'Queens', 'Manhattan'],
    certifications: ['Licensed General Contractor', 'OSHA Certified', 'EPA Lead-Safe Certified'],
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@firebuild.com',
      role: 'Owner',
      status: 'active',
      lastLogin: '2 minutes ago',
      permissions: ['all'],
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@firebuild.com',
      role: 'Project Manager',
      status: 'active',
      lastLogin: '1 hour ago',
      permissions: ['manage_jobs', 'view_reports'],
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@firebuild.com',
      role: 'Foreman',
      status: 'active',
      lastLogin: '3 hours ago',
      permissions: ['view_jobs', 'update_status'],
    },
  ]);

  const [integrations, setIntegrations] = useState([
    { name: 'Google Calendar', status: 'connected', icon: Calendar },
    { name: 'QuickBooks', status: 'disconnected', icon: FileText },
    { name: 'Stripe', status: 'connected', icon: CreditCard },
    { name: 'Mailchimp', status: 'disconnected', icon: Mail },
  ]);

  const handleSaveCompanyDetails = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save company details
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Company details saved",
        description: "Your company information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save company details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyDetails(prev => ({ ...prev, logoUrl: reader.result as string }));
        toast({
          title: "Logo uploaded",
          description: "Your company logo has been updated successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getSetupTasks = () => [
    { task: 'Basic company information', completed: !!companyDetails.companyName },
    { task: 'Contact information', completed: !!companyDetails.email && !!companyDetails.phone },
    { task: 'Business address', completed: !!companyDetails.address && !!companyDetails.city },
    { task: 'Logo upload', completed: !!companyDetails.logoUrl },
    { task: 'Business hours', completed: true },
    { task: 'Team members', completed: teamMembers.length > 1 },
    { task: 'Payment integration', completed: integrations.some(i => i.name === 'Stripe' && i.status === 'connected') },
  ];

  const completedTasks = getSetupTasks().filter(task => task.completed).length;
  const totalTasks = getSetupTasks().length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              Company Management
            </h1>
            <p className="text-muted-foreground mt-2">Manage your company information, team, and integrations</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Setup Progress</div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={progressPercentage} className="w-32" />
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-4xl grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Setup Progress</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
                <p className="text-xs text-muted-foreground">Tasks completed</p>
                <Progress value={progressPercentage} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamMembers.length}</div>
                <p className="text-xs text-muted-foreground">Active members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Integrations</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {integrations.filter(i => i.status === 'connected').length}/{integrations.length}
                </div>
                <p className="text-xs text-muted-foreground">Connected services</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Setup Checklist</CardTitle>
              <CardDescription>Complete these tasks to finish setting up your company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getSetupTasks().map((task, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                      {task.task}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <UserPlus className="h-6 w-6" />
                  Add Team Member
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Upload className="h-6 w-6" />
                  Upload Documents
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Zap className="h-6 w-6" />
                  Connect Service
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Settings className="h-6 w-6" />
                  Configure Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic information about your company</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="company-name">Company Name *</Label>
                  <Input
                    id="company-name"
                    value={companyDetails.companyName}
                    onChange={(e) => setCompanyDetails(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="business-type">Business Type</Label>
                  <Select 
                    value={companyDetails.businessType} 
                    onValueChange={(value) => setCompanyDetails(prev => ({ ...prev, businessType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LLC">LLC</SelectItem>
                      <SelectItem value="Corporation">Corporation</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                      <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select 
                    value={companyDetails.industry} 
                    onValueChange={(value) => setCompanyDetails(prev => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Renovation">Renovation</SelectItem>
                      <SelectItem value="Landscaping">Landscaping</SelectItem>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="HVAC">HVAC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="founded-year">Founded Year</Label>
                  <Input
                    id="founded-year"
                    type="number"
                    value={companyDetails.foundedYear}
                    onChange={(e) => setCompanyDetails(prev => ({ ...prev, foundedYear: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="employee-count">Employee Count</Label>
                  <Input
                    id="employee-count"
                    type="number"
                    value={companyDetails.employeeCount}
                    onChange={(e) => setCompanyDetails(prev => ({ ...prev, employeeCount: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="annual-revenue">Annual Revenue</Label>
                  <Select 
                    value={companyDetails.annualRevenue} 
                    onValueChange={(value) => setCompanyDetails(prev => ({ ...prev, annualRevenue: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Under $100K">Under $100K</SelectItem>
                      <SelectItem value="$100K-500K">$100K-500K</SelectItem>
                      <SelectItem value="$500K-1M">$500K-1M</SelectItem>
                      <SelectItem value="$1M-5M">$1M-5M</SelectItem>
                      <SelectItem value="$5M-10M">$5M-10M</SelectItem>
                      <SelectItem value="Over $10M">Over $10M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={companyDetails.description}
                  onChange={(e) => setCompanyDetails(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={companyDetails.phone}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={companyDetails.email}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={companyDetails.website}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Address</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={companyDetails.address}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={companyDetails.city}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      value={companyDetails.state}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal-code">ZIP/Postal Code</Label>
                    <Input
                      id="postal-code"
                      value={companyDetails.postalCode}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, postalCode: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={companyDetails.country}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, country: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Legal Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="tax-id">Tax ID / EIN</Label>
                    <Input
                      id="tax-id"
                      value={companyDetails.taxId}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, taxId: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="registration-number">Registration Number</Label>
                    <Input
                      id="registration-number"
                      value={companyDetails.registrationNumber}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveCompanyDetails} disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? "Saving..." : "Save Company Details"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Logo</CardTitle>
              <CardDescription>Upload your company logo and branding assets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={companyDetails.logoUrl} />
                  <AvatarFallback>
                    <Building2 className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <Button variant="outline" className="gap-2" asChild>
                      <span>
                        <Camera className="h-4 w-4" />
                        Upload Logo
                      </span>
                    </Button>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-2">
                    PNG, JPG up to 5MB. Recommended: 200x200px
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>Define your brand colors for templates and documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={companyDetails.primaryColor}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={companyDetails.primaryColor}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={companyDetails.secondaryColor}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={companyDetails.secondaryColor}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your operating hours for each day of the week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(companyDetails.businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-24 capitalize font-medium">{day}</div>
                  <Switch
                    checked={hours.isOpen}
                    onCheckedChange={(checked) => 
                      setCompanyDetails(prev => ({
                        ...prev,
                        businessHours: {
                          ...prev.businessHours,
                          [day]: { ...hours, isOpen: checked }
                        }
                      }))
                    }
                  />
                  {hours.isOpen ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => 
                          setCompanyDetails(prev => ({
                            ...prev,
                            businessHours: {
                              ...prev.businessHours,
                              [day]: { ...hours, open: e.target.value }
                            }
                          }))
                        }
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => 
                          setCompanyDetails(prev => ({
                            ...prev,
                            businessHours: {
                              ...prev.businessHours,
                              [day]: { ...hours, close: e.target.value }
                            }
                          }))
                        }
                        className="w-32"
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Closed</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Areas</CardTitle>
              <CardDescription>Define the areas where you provide services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {companyDetails.serviceAreas.map((area, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {area}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        const newAreas = companyDetails.serviceAreas.filter((_, i) => i !== index);
                        setCompanyDetails(prev => ({ ...prev, serviceAreas: newAreas }));
                      }}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add service area" id="new-service-area" />
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const input = document.getElementById('new-service-area') as HTMLInputElement;
                    if (input.value.trim()) {
                      setCompanyDetails(prev => ({
                        ...prev,
                        serviceAreas: [...prev.serviceAreas, input.value.trim()]
                      }));
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certifications & Licenses</CardTitle>
              <CardDescription>List your business certifications and licenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {companyDetails.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span>{cert}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newCerts = companyDetails.certifications.filter((_, i) => i !== index);
                        setCompanyDetails(prev => ({ ...prev, certifications: newCerts }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add certification" id="new-certification" />
                <Button 
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById('new-certification') as HTMLInputElement;
                    if (input.value.trim()) {
                      setCompanyDetails(prev => ({
                        ...prev,
                        certifications: [...prev.certifications, input.value.trim()]
                      }));
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your team members and their permissions</CardDescription>
                </div>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <p className="text-xs text-muted-foreground">Last login: {member.lastLogin}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {member.role !== 'Owner' && (
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Documents</CardTitle>
              <CardDescription>Upload and manage your business licenses, insurance, and other important documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Business License
                    </h3>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Business_License_2024.pdf</p>
                          <p className="text-sm text-muted-foreground">Uploaded on Jan 15, 2024</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Insurance
                    </h3>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">General_Liability_Insurance.pdf</p>
                          <p className="text-sm text-muted-foreground">Uploaded on Jan 10, 2024</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>Connect your favorite tools and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <integration.icon className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {integration.status === 'connected' ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={integration.status === 'connected' ? 'outline' : 'default'}
                      size="sm"
                    >
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google Calendar Integration</CardTitle>
              <CardDescription>Sync your jobs and appointments with Google Calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <GoogleCalendarSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}