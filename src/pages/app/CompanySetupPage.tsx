import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Building2, Upload, FileText, Shield, Users, Save, AlertCircle,
  DollarSign, Phone, Mail, Globe, MapPin, Calendar, CreditCard,
  ShieldCheck, Briefcase, ChevronRight, Check, Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CompanySetupData {
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
}

const BUSINESS_TYPES = ['Sole Proprietorship', 'Partnership', 'Corporation', 'LLC', 'Non-Profit'];
const INDUSTRIES = ['Construction', 'Renovation', 'Electrical', 'Plumbing', 'HVAC', 'Landscaping', 'Roofing', 'Other'];
const PAYMENT_TERMS = ['Net 30', 'Net 15', 'Net 60', 'Due on Receipt', 'Custom'];

export default function CompanySetupPage() {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewCompany, setIsNewCompany] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  
  const [companyData, setCompanyData] = useState<CompanySetupData>({
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
    banking_institution: '',
    account_manager: '',
    payment_terms: 'Net 30',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    logo_url: '',
    primary_color: '',
    secondary_color: ''
  });

  // Load existing company details
  useEffect(() => {
    loadCompanyDetails();
  }, [user]);

  // Calculate setup progress
  useEffect(() => {
    const requiredFields = [
      'company_name', 'business_type', 'industry', 'phone', 'email', 
      'address', 'city', 'state', 'postal_code'
    ];
    
    const optionalFields = [
      'tax_id', 'wsib_number', 'insurance_provider', 'banking_institution'
    ];
    
    const filledRequired = requiredFields.filter(field => 
      companyData[field as keyof CompanySetupData]
    );
    
    const filledOptional = optionalFields.filter(field => 
      companyData[field as keyof CompanySetupData]
    );
    
    const requiredProgress = (filledRequired.length / requiredFields.length) * 60;
    const optionalProgress = (filledOptional.length / optionalFields.length) * 40;
    
    setSetupProgress(requiredProgress + optionalProgress);
  }, [companyData]);

  const loadCompanyDetails = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_details')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCompanyData({
          company_name: data.company_name || '',
          business_type: data.business_type || 'Corporation',
          industry: data.industry || 'Construction',
          description: data.description || '',
          founded_year: data.founded_year,
          employee_count: data.employee_count,
          annual_revenue: data.annual_revenue || '',
          phone: data.phone || '',
          email: data.email || user.email || '',
          website: data.website || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          postal_code: data.postal_code || '',
          country: data.country || 'Canada',
          tax_id: data.tax_id || '',
          registration_number: data.registration_number || '',
          business_license_number: data.business_license_number || '',
          business_license_expiry: data.business_license_expiry || '',
          hst_number: data.hst_number || '',
          gst_number: data.gst_number || '',
          pst_number: data.pst_number || '',
          wsib_number: data.wsib_number || '',
          insurance_provider: data.insurance_provider || '',
          insurance_policy_number: data.insurance_policy_number || '',
          insurance_expiry_date: data.insurance_expiry_date || '',
          workers_comp_coverage: data.workers_comp_coverage || false,
          liability_coverage_limit: data.liability_coverage_limit,
          banking_institution: data.banking_institution || '',
          account_manager: data.account_manager || '',
          payment_terms: data.payment_terms || 'Net 30',
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_phone: data.emergency_contact_phone || '',
          logo_url: data.logo_url || '',
          primary_color: data.primary_color || '',
          secondary_color: data.secondary_color || ''
        });
        setIsNewCompany(false);
      } else {
        setIsNewCompany(true);
        // Set email from user profile
        setCompanyData(prev => ({
          ...prev,
          email: user.email || ''
        }));
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

  const handleSave = async () => {
    if (!user) return;
    
    // Validate required fields
    if (!companyData.company_name || !companyData.phone || !companyData.address || !companyData.city) {
      toast({
        title: "Required Fields",
        description: "Please fill in company name, phone, address, and city.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const dataToSave = {
        user_id: user.id,
        ...companyData,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('company_details')
        .upsert(dataToSave, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // Update profile with company name
      await supabase
        .from('profiles')
        .update({
          company_name: companyData.company_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      toast({
        title: "Success",
        description: isNewCompany ? "Company profile created successfully!" : "Company details saved successfully",
      });
      
      if (isNewCompany) {
        navigate('/app/dashboard');
      }
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

  const handleInputChange = (field: keyof CompanySetupData, value: any) => {
    setCompanyData(prev => ({
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
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNewCompany ? 'Company Setup' : 'Company Settings'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNewCompany 
                ? 'Complete your company profile to get started' 
                : 'Manage your company information and business settings'}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : (isNewCompany ? 'Complete Setup' : 'Save Changes')}
        </Button>
      </div>

      {/* Progress Card (for new companies) */}
      {isNewCompany && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Setup Progress
            </CardTitle>
            <CardDescription>Complete your company profile to unlock all features</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={setupProgress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(setupProgress)}% complete
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="basic">
            <Building2 className="mr-2 h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="mr-2 h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="legal">
            <FileText className="mr-2 h-4 w-4" />
            Legal & Tax
          </TabsTrigger>
          <TabsTrigger value="insurance">
            <Shield className="mr-2 h-4 w-4" />
            Insurance
          </TabsTrigger>
          <TabsTrigger value="banking">
            <CreditCard className="mr-2 h-4 w-4" />
            Banking
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic details about your business</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company_name"
                    value={companyData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type</Label>
                  <Select 
                    value={companyData.business_type}
                    onValueChange={(value) => handleInputChange('business_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select 
                    value={companyData.industry}
                    onValueChange={(value) => handleInputChange('industry', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded_year">Founded Year</Label>
                  <Input
                    id="founded_year"
                    type="number"
                    value={companyData.founded_year || ''}
                    onChange={(e) => handleInputChange('founded_year', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="2020"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={companyData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of your company and services..."
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_count">Number of Employees</Label>
                  <Input
                    id="employee_count"
                    type="number"
                    value={companyData.employee_count || ''}
                    onChange={(e) => handleInputChange('employee_count', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="10"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annual_revenue">Annual Revenue</Label>
                  <Input
                    id="annual_revenue"
                    value={companyData.annual_revenue}
                    onChange={(e) => handleInputChange('annual_revenue', e.target.value)}
                    placeholder="$1,000,000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information Tab */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How customers can reach your business</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={companyData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={companyData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="info@company.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={companyData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://www.company.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Address</h3>
                <div className="space-y-2">
                  <Label htmlFor="address">
                    Street Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={companyData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={companyData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Toronto"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Province/State</Label>
                    <Input
                      id="state"
                      value={companyData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Ontario"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      value={companyData.postal_code}
                      onChange={(e) => handleInputChange('postal_code', e.target.value)}
                      placeholder="M5V 3A8"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      value={companyData.emergency_contact_name}
                      onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                    <Input
                      id="emergency_contact_phone"
                      value={companyData.emergency_contact_phone}
                      onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                      placeholder="(555) 987-6543"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal & Tax Tab */}
        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Legal & Tax Information</CardTitle>
              <CardDescription>Business registration and tax details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax_id">Tax ID / Business Number</Label>
                  <Input
                    id="tax_id"
                    value={companyData.tax_id}
                    onChange={(e) => handleInputChange('tax_id', e.target.value)}
                    placeholder="123456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration_number">Registration Number</Label>
                  <Input
                    id="registration_number"
                    value={companyData.registration_number}
                    onChange={(e) => handleInputChange('registration_number', e.target.value)}
                    placeholder="REG-123456"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_license_number">Business License Number</Label>
                  <Input
                    id="business_license_number"
                    value={companyData.business_license_number}
                    onChange={(e) => handleInputChange('business_license_number', e.target.value)}
                    placeholder="BL-123456"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_license_expiry">License Expiry Date</Label>
                  <Input
                    id="business_license_expiry"
                    type="date"
                    value={companyData.business_license_expiry}
                    onChange={(e) => handleInputChange('business_license_expiry', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tax Numbers</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hst_number">HST Number</Label>
                    <Input
                      id="hst_number"
                      value={companyData.hst_number}
                      onChange={(e) => handleInputChange('hst_number', e.target.value)}
                      placeholder="123456789RT0001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gst_number">GST Number</Label>
                    <Input
                      id="gst_number"
                      value={companyData.gst_number}
                      onChange={(e) => handleInputChange('gst_number', e.target.value)}
                      placeholder="123456789RT0001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pst_number">PST Number</Label>
                    <Input
                      id="pst_number"
                      value={companyData.pst_number}
                      onChange={(e) => handleInputChange('pst_number', e.target.value)}
                      placeholder="PST-123456"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Tab */}
        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insurance & WSIB</CardTitle>
              <CardDescription>Coverage and protection details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="wsib_number">WSIB Number</Label>
                <Input
                  id="wsib_number"
                  value={companyData.wsib_number}
                  onChange={(e) => handleInputChange('wsib_number', e.target.value)}
                  placeholder="1234567"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance_provider">Insurance Provider</Label>
                  <Input
                    id="insurance_provider"
                    value={companyData.insurance_provider}
                    onChange={(e) => handleInputChange('insurance_provider', e.target.value)}
                    placeholder="ABC Insurance Co."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance_policy_number">Policy Number</Label>
                  <Input
                    id="insurance_policy_number"
                    value={companyData.insurance_policy_number}
                    onChange={(e) => handleInputChange('insurance_policy_number', e.target.value)}
                    placeholder="POL-123456"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance_expiry_date">Insurance Expiry Date</Label>
                  <Input
                    id="insurance_expiry_date"
                    type="date"
                    value={companyData.insurance_expiry_date}
                    onChange={(e) => handleInputChange('insurance_expiry_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liability_coverage_limit">Liability Coverage Limit</Label>
                  <Input
                    id="liability_coverage_limit"
                    type="number"
                    value={companyData.liability_coverage_limit || ''}
                    onChange={(e) => handleInputChange('liability_coverage_limit', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="2000000"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="workers_comp_coverage"
                  checked={companyData.workers_comp_coverage}
                  onCheckedChange={(checked) => handleInputChange('workers_comp_coverage', checked)}
                />
                <Label htmlFor="workers_comp_coverage">Workers' Compensation Coverage</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Tab */}
        <TabsContent value="banking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Banking Information</CardTitle>
              <CardDescription>Financial institution and payment details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="banking_institution">Banking Institution</Label>
                  <Input
                    id="banking_institution"
                    value={companyData.banking_institution}
                    onChange={(e) => handleInputChange('banking_institution', e.target.value)}
                    placeholder="ABC Bank"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_manager">Account Manager</Label>
                  <Input
                    id="account_manager"
                    value={companyData.account_manager}
                    onChange={(e) => handleInputChange('account_manager', e.target.value)}
                    placeholder="Jane Smith"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_terms">Default Payment Terms</Label>
                <Select 
                  value={companyData.payment_terms}
                  onValueChange={(value) => handleInputChange('payment_terms', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TERMS.map(term => (
                      <SelectItem key={term} value={term}>{term}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}