import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  Upload, 
  FileText, 
  Shield, 
  Users, 
  Save,
  AlertCircle,
  DollarSign,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface CompanyDetails {
  // Basic Information
  company_name: string;
  business_type: string;
  industry: string;
  description: string;
  founded_year: number | null;
  employee_count: number | null;
  annual_revenue: string;
  
  // Contact Information
  phone: string;
  email: string;
  website: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  
  // Legal & Tax Information
  tax_id: string;
  registration_number: string;
  business_license_number: string;
  business_license_expiry: string;
  hst_number: string;
  gst_number: string;
  pst_number: string;
  
  // Insurance Information
  wsib_number: string;
  insurance_provider: string;
  insurance_policy_number: string;
  insurance_expiry_date: string;
  workers_comp_coverage: boolean;
  liability_coverage_limit: number | null;
  
  // Bonding Information
  bonding_company: string;
  bonding_limit: number | null;
  
  // Banking Information
  banking_institution: string;
  account_manager: string;
  payment_terms: string;
  
  // Emergency Contact
  emergency_contact_name: string;
  emergency_contact_phone: string;
  
  // Branding
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  
  // Business Operations
  business_hours: any;
  service_areas: string[];
  certifications: string[];
}

export default function CompanyPageNew() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    company_name: '',
    business_type: 'Corporation',
    industry: 'Construction',
    description: '',
    founded_year: null,
    employee_count: null,
    annual_revenue: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Canada',
    tax_id: '',
    registration_number: '',
    business_license_number: '',
    business_license_expiry: '',
    hst_number: '',
    gst_number: '',
    pst_number: '',
    wsib_number: '',
    insurance_provider: '',
    insurance_policy_number: '',
    insurance_expiry_date: '',
    workers_comp_coverage: false,
    liability_coverage_limit: null,
    bonding_company: '',
    bonding_limit: null,
    banking_institution: '',
    account_manager: '',
    payment_terms: 'Net 30',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    logo_url: '',
    primary_color: '',
    secondary_color: '',
    business_hours: {},
    service_areas: [],
    certifications: []
  });

  // Load company details on mount
  useEffect(() => {
    loadCompanyDetails();
  }, []);

  // Calculate setup progress
  useEffect(() => {
    const requiredFields = [
      'company_name', 'phone', 'email', 'address', 'city', 'state', 
      'postal_code', 'tax_id', 'wsib_number', 'insurance_provider'
    ];
    
    const filledFields = requiredFields.filter(field => 
      companyDetails[field as keyof CompanyDetails]
    );
    
    setSetupProgress((filledFields.length / requiredFields.length) * 100);
  }, [companyDetails]);

  const loadCompanyDetails = async () => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('company_details')
        .select('*')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCompanyDetails({
          company_name: data.company_name || '',
          business_type: data.business_type || 'Corporation',
          industry: data.industry || 'Construction',
          description: data.description || '',
          founded_year: data.founded_year,
          employee_count: data.employee_count,
          annual_revenue: data.annual_revenue || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          postal_code: data.postal_code || '',
          country: data.country || 'Canada',
          tax_id: data.tax_id || '',
          registration_number: data.registration_number || '',
          business_license_number: data.business_license_number || '',
          business_license_expiry: data.business_license_expiry ? format(new Date(data.business_license_expiry), 'yyyy-MM-dd') : '',
          hst_number: data.hst_number || '',
          gst_number: data.gst_number || '',
          pst_number: data.pst_number || '',
          wsib_number: data.wsib_number || '',
          insurance_provider: data.insurance_provider || '',
          insurance_policy_number: data.insurance_policy_number || '',
          insurance_expiry_date: data.insurance_expiry_date ? format(new Date(data.insurance_expiry_date), 'yyyy-MM-dd') : '',
          workers_comp_coverage: data.workers_comp_coverage || false,
          liability_coverage_limit: data.liability_coverage_limit,
          bonding_company: data.bonding_company || '',
          bonding_limit: data.bonding_limit,
          banking_institution: data.banking_institution || '',
          account_manager: data.account_manager || '',
          payment_terms: data.payment_terms || 'Net 30',
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_phone: data.emergency_contact_phone || '',
          logo_url: data.logo_url || '',
          primary_color: data.primary_color || '',
          secondary_color: data.secondary_color || '',
          business_hours: data.business_hours || {},
          service_areas: data.service_areas || [],
          certifications: data.certifications || []
        });
      }
    } catch (error) {
      console.error('Error loading company details:', error);
      toast({
        title: "Error",
        description: "Failed to load company details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCompanyDetails = async () => {
    setIsSaving(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user found');

      // Prepare data for database
      const dataToSave = {
        user_id: user.user.id,
        company_name: companyDetails.company_name,
        business_type: companyDetails.business_type,
        industry: companyDetails.industry,
        description: companyDetails.description,
        founded_year: companyDetails.founded_year,
        employee_count: companyDetails.employee_count,
        annual_revenue: companyDetails.annual_revenue,
        phone: companyDetails.phone,
        email: companyDetails.email,
        website: companyDetails.website,
        address: companyDetails.address,
        city: companyDetails.city,
        state: companyDetails.state,
        postal_code: companyDetails.postal_code,
        country: companyDetails.country,
        tax_id: companyDetails.tax_id,
        registration_number: companyDetails.registration_number,
        business_license_number: companyDetails.business_license_number,
        business_license_expiry: companyDetails.business_license_expiry || null,
        hst_number: companyDetails.hst_number,
        gst_number: companyDetails.gst_number,
        pst_number: companyDetails.pst_number,
        wsib_number: companyDetails.wsib_number,
        insurance_provider: companyDetails.insurance_provider,
        insurance_policy_number: companyDetails.insurance_policy_number,
        insurance_expiry_date: companyDetails.insurance_expiry_date || null,
        workers_comp_coverage: companyDetails.workers_comp_coverage,
        liability_coverage_limit: companyDetails.liability_coverage_limit,
        bonding_company: companyDetails.bonding_company,
        bonding_limit: companyDetails.bonding_limit,
        banking_institution: companyDetails.banking_institution,
        account_manager: companyDetails.account_manager,
        payment_terms: companyDetails.payment_terms,
        emergency_contact_name: companyDetails.emergency_contact_name,
        emergency_contact_phone: companyDetails.emergency_contact_phone,
        logo_url: companyDetails.logo_url,
        primary_color: companyDetails.primary_color,
        secondary_color: companyDetails.secondary_color,
        business_hours: companyDetails.business_hours,
        service_areas: companyDetails.service_areas,
        certifications: companyDetails.certifications
      };

      const { error } = await supabase
        .from('company_details')
        .upsert(dataToSave, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company details saved successfully",
      });
    } catch (error) {
      console.error('Error saving company details:', error);
      toast({
        title: "Error",
        description: "Failed to save company details",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof CompanyDetails, value: any) => {
    setCompanyDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange('logo_url', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const setupTasks = [
    { task: 'Company name and type', completed: !!companyDetails.company_name && !!companyDetails.business_type },
    { task: 'Contact information', completed: !!companyDetails.email && !!companyDetails.phone },
    { task: 'Business address', completed: !!companyDetails.address && !!companyDetails.city },
    { task: 'Tax information', completed: !!companyDetails.tax_id || !!companyDetails.hst_number || !!companyDetails.gst_number },
    { task: 'WSIB registration', completed: !!companyDetails.wsib_number },
    { task: 'Insurance details', completed: !!companyDetails.insurance_provider && !!companyDetails.insurance_policy_number },
    { task: 'Banking information', completed: !!companyDetails.banking_institution },
    { task: 'Emergency contact', completed: !!companyDetails.emergency_contact_name && !!companyDetails.emergency_contact_phone }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading company details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your company information, legal details, and business settings
          </p>
        </div>
        <Button onClick={handleSaveCompanyDetails} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      {/* Setup Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Progress</CardTitle>
          <CardDescription>Complete your company profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={setupProgress} className="h-2" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {setupTasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-2">
                {task.completed ? (
                  <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    ✓
                  </Badge>
                ) : (
                  <Badge variant="outline" className="h-5 w-5 rounded-full p-0" />
                )}
                <span className="text-sm">{task.task}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="legal">Legal & Tax</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic details about your business</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={companyDetails.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type *</Label>
                  <Select 
                    value={companyDetails.business_type}
                    onValueChange={(value) => handleInputChange('business_type', value)}
                  >
                    <SelectTrigger id="business_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                      <SelectItem value="Corporation">Corporation</SelectItem>
                      <SelectItem value="LLC">LLC</SelectItem>
                      <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select 
                    value={companyDetails.industry}
                    onValueChange={(value) => handleInputChange('industry', value)}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Renovation">Renovation</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="HVAC">HVAC</SelectItem>
                      <SelectItem value="Landscaping">Landscaping</SelectItem>
                      <SelectItem value="Roofing">Roofing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded_year">Founded Year</Label>
                  <Input
                    id="founded_year"
                    type="number"
                    value={companyDetails.founded_year || ''}
                    onChange={(e) => handleInputChange('founded_year', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="e.g., 2020"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={companyDetails.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of your business..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_count">Number of Employees</Label>
                  <Input
                    id="employee_count"
                    type="number"
                    value={companyDetails.employee_count || ''}
                    onChange={(e) => handleInputChange('employee_count', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="e.g., 25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annual_revenue">Annual Revenue Range</Label>
                  <Select 
                    value={companyDetails.annual_revenue}
                    onValueChange={(value) => handleInputChange('annual_revenue', value)}
                  >
                    <SelectTrigger id="annual_revenue">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Under $100K">Under $100K</SelectItem>
                      <SelectItem value="$100K-$500K">$100K-$500K</SelectItem>
                      <SelectItem value="$500K-$1M">$500K-$1M</SelectItem>
                      <SelectItem value="$1M-$5M">$1M-$5M</SelectItem>
                      <SelectItem value="$5M-$10M">$5M-$10M</SelectItem>
                      <SelectItem value="Over $10M">Over $10M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How clients can reach your business</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={companyDetails.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companyDetails.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="info@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={companyDetails.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="www.company.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={companyDetails.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={companyDetails.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Toronto"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">Province/State *</Label>
                  <Input
                    id="state"
                    value={companyDetails.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Ontario"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal/ZIP Code *</Label>
                  <Input
                    id="postal_code"
                    value={companyDetails.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    placeholder="M5V 3A8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={companyDetails.country}
                    onValueChange={(value) => handleInputChange('country', value)}
                  >
                    <SelectTrigger id="country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Mexico">Mexico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal & Tax Tab */}
        <TabsContent value="legal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Legal Information</CardTitle>
              <CardDescription>Business registration and licensing details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax_id">Business Number / Tax ID *</Label>
                  <Input
                    id="tax_id"
                    value={companyDetails.tax_id}
                    onChange={(e) => handleInputChange('tax_id', e.target.value)}
                    placeholder="123456789 RC0001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration_number">Corporate Registration Number</Label>
                  <Input
                    id="registration_number"
                    value={companyDetails.registration_number}
                    onChange={(e) => handleInputChange('registration_number', e.target.value)}
                    placeholder="Registration number"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_license_number">Business License Number</Label>
                  <Input
                    id="business_license_number"
                    value={companyDetails.business_license_number}
                    onChange={(e) => handleInputChange('business_license_number', e.target.value)}
                    placeholder="License number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_license_expiry">License Expiry Date</Label>
                  <Input
                    id="business_license_expiry"
                    type="date"
                    value={companyDetails.business_license_expiry}
                    onChange={(e) => handleInputChange('business_license_expiry', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Registration</CardTitle>
              <CardDescription>Sales tax and other tax registration numbers</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hst_number">HST Number</Label>
                  <Input
                    id="hst_number"
                    value={companyDetails.hst_number}
                    onChange={(e) => handleInputChange('hst_number', e.target.value)}
                    placeholder="HST number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst_number">GST Number</Label>
                  <Input
                    id="gst_number"
                    value={companyDetails.gst_number}
                    onChange={(e) => handleInputChange('gst_number', e.target.value)}
                    placeholder="GST number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pst_number">PST Number</Label>
                  <Input
                    id="pst_number"
                    value={companyDetails.pst_number}
                    onChange={(e) => handleInputChange('pst_number', e.target.value)}
                    placeholder="PST number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Tab */}
        <TabsContent value="insurance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workers' Compensation</CardTitle>
              <CardDescription>WSIB and workers' compensation details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wsib_number">WSIB Number *</Label>
                  <Input
                    id="wsib_number"
                    value={companyDetails.wsib_number}
                    onChange={(e) => handleInputChange('wsib_number', e.target.value)}
                    placeholder="WSIB account number"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="workers_comp_coverage"
                    checked={companyDetails.workers_comp_coverage}
                    onCheckedChange={(checked) => handleInputChange('workers_comp_coverage', checked)}
                  />
                  <Label htmlFor="workers_comp_coverage">Active Workers' Compensation Coverage</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>General Liability Insurance</CardTitle>
              <CardDescription>Business insurance information</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance_provider">Insurance Provider *</Label>
                  <Input
                    id="insurance_provider"
                    value={companyDetails.insurance_provider}
                    onChange={(e) => handleInputChange('insurance_provider', e.target.value)}
                    placeholder="Insurance company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance_policy_number">Policy Number *</Label>
                  <Input
                    id="insurance_policy_number"
                    value={companyDetails.insurance_policy_number}
                    onChange={(e) => handleInputChange('insurance_policy_number', e.target.value)}
                    placeholder="Policy number"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance_expiry_date">Policy Expiry Date</Label>
                  <Input
                    id="insurance_expiry_date"
                    type="date"
                    value={companyDetails.insurance_expiry_date}
                    onChange={(e) => handleInputChange('insurance_expiry_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liability_coverage_limit">Liability Coverage Limit</Label>
                  <Input
                    id="liability_coverage_limit"
                    type="number"
                    value={companyDetails.liability_coverage_limit || ''}
                    onChange={(e) => handleInputChange('liability_coverage_limit', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="e.g., 2000000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bonding Information</CardTitle>
              <CardDescription>Surety bond details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bonding_company">Bonding Company</Label>
                  <Input
                    id="bonding_company"
                    value={companyDetails.bonding_company}
                    onChange={(e) => handleInputChange('bonding_company', e.target.value)}
                    placeholder="Surety company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bonding_limit">Bonding Capacity</Label>
                  <Input
                    id="bonding_limit"
                    type="number"
                    value={companyDetails.bonding_limit || ''}
                    onChange={(e) => handleInputChange('bonding_limit', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="Maximum bond amount"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Tab */}
        <TabsContent value="banking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Banking Information</CardTitle>
              <CardDescription>Financial institution details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="banking_institution">Bank Name</Label>
                  <Input
                    id="banking_institution"
                    value={companyDetails.banking_institution}
                    onChange={(e) => handleInputChange('banking_institution', e.target.value)}
                    placeholder="Your bank name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_manager">Account Manager</Label>
                  <Input
                    id="account_manager"
                    value={companyDetails.account_manager}
                    onChange={(e) => handleInputChange('account_manager', e.target.value)}
                    placeholder="Account manager name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_terms">Default Payment Terms</Label>
                <Select 
                  value={companyDetails.payment_terms}
                  onValueChange={(value) => handleInputChange('payment_terms', value)}
                >
                  <SelectTrigger id="payment_terms">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                    <SelectItem value="2/10 Net 30">2/10 Net 30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>24/7 emergency contact information</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    value={companyDetails.emergency_contact_name}
                    onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                    placeholder="Emergency contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Emergency Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    type="tel"
                    value={companyDetails.emergency_contact_phone}
                    onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                    placeholder="+1 (555) 911-1234"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Areas</CardTitle>
              <CardDescription>Geographic areas where you provide services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Service Areas (comma separated)</Label>
                <Textarea
                  value={companyDetails.service_areas.join(', ')}
                  onChange={(e) => handleInputChange('service_areas', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="Toronto, Mississauga, Oakville, Burlington..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certifications & Licenses</CardTitle>
              <CardDescription>Professional certifications and trade licenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Certifications (comma separated)</Label>
                <Textarea
                  value={companyDetails.certifications.join(', ')}
                  onChange={(e) => handleInputChange('certifications', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="ISO 9001, LEED Certified, Master Electrician..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Company logo and brand colors</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo</Label>
                <div className="flex items-center gap-4">
                  {companyDetails.logo_url ? (
                    <img 
                      src={companyDetails.logo_url} 
                      alt="Company logo" 
                      className="h-20 w-20 object-contain border rounded"
                    />
                  ) : (
                    <div className="h-20 w-20 border-2 border-dashed rounded flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="max-w-xs"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Brand Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={companyDetails.primary_color || '#000000'}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      className="w-20"
                    />
                    <Input
                      value={companyDetails.primary_color}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Secondary Brand Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={companyDetails.secondary_color || '#ffffff'}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      className="w-20"
                    />
                    <Input
                      value={companyDetails.secondary_color}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}