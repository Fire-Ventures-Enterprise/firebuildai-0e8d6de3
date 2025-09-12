import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  Phone,
  Mail,
  Globe,
  Briefcase,
  Users,
  Calendar,
  FileText,
  Shield,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';


const INDUSTRIES = [
  { value: 'general_contractor', label: 'General Contractor' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'painting', label: 'Painting' },
  { value: 'flooring', label: 'Flooring' },
  { value: 'kitchen_bathroom', label: 'Kitchen & Bathroom Remodeling' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'masonry', label: 'Masonry' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'concrete', label: 'Concrete' },
  { value: 'drywall', label: 'Drywall' },
  { value: 'insulation', label: 'Insulation' },
  { value: 'siding', label: 'Siding' },
  { value: 'windows_doors', label: 'Windows & Doors' },
  { value: 'solar', label: 'Solar Installation' },
  { value: 'pool', label: 'Pool Installation' },
  { value: 'fencing', label: 'Fencing' },
  { value: 'demolition', label: 'Demolition' },
  { value: 'excavation', label: 'Excavation' },
  { value: 'home_inspection', label: 'Home Inspection' },
  { value: 'waterproofing', label: 'Waterproofing' },
  { value: 'deck_patio', label: 'Deck & Patio' },
  { value: 'gutters', label: 'Gutters' },
  { value: 'tile_stone', label: 'Tile & Stone' },
  { value: 'renovation', label: 'Home Renovation' }
];

const BUSINESS_TYPES = [
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llc', label: 'LLC' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'nonprofit', label: 'Non-Profit' }
];

export const CompanyOnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    company_name: profile?.company_name || '',
    business_type: '',
    industry: '',
    description: '',
    founded_year: new Date().getFullYear(),
    employee_count: 1,
    
    // Step 2: Contact Information
    phone: '',
    email: user?.email || '',
    website: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Canada',
    
    // Step 3: Business Details
    tax_id: '',
    business_license_number: '',
    insurance_provider: '',
    insurance_policy_number: '',
    workers_comp_coverage: false,
    
    // Step 4: Certifications & Service Areas
    certifications: [] as string[],
    service_areas: [] as string[]
  });

  useEffect(() => {
    // Check if company details already exist
    const checkExistingDetails = async () => {
      if (user) {
        const { data } = await supabase
          .from('company_details')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (data && data.company_name && data.industry) {
          // Company already set up, redirect to dashboard
          navigate('/app/dashboard');
        }
      }
    };
    
    checkExistingDetails();
  }, [user, navigate]);

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.company_name || !formData.industry || !formData.business_type) {
        toast({
          title: "Required Fields",
          description: "Please fill in company name, industry, and business type.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.phone || !formData.address || !formData.city) {
        toast({
          title: "Required Fields",
          description: "Please fill in phone, address, and city.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Save company details
      const { error: detailsError } = await supabase
        .from('company_details')
        .upsert({
          user_id: user.id,
          ...formData,
          founded_year: formData.founded_year ? parseInt(formData.founded_year.toString()) : null,
          employee_count: formData.employee_count ? parseInt(formData.employee_count.toString()) : null
        })
        .eq('user_id', user.id);

      if (detailsError) throw detailsError;

      // Update profile to mark onboarding complete
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company_name: formData.company_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "Company Setup Complete!",
        description: "Your company profile has been created successfully."
      });

      navigate('/app/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save company details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const progressValue = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to FireBuild!</h1>
          <p className="text-muted-foreground">Let's set up your company profile to get started</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary">Step {step} of {totalSteps}</Badge>
              <Progress value={progressValue} className="w-32" />
            </div>
            
            <CardTitle>
              {step === 1 && "Basic Company Information"}
              {step === 2 && "Contact & Location"}
              {step === 3 && "Business Details"}
              {step === 4 && "Certifications & Service Areas"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your company"}
              {step === 2 && "How can customers reach you?"}
              {step === 3 && "Legal and insurance information"}
              {step === 4 && "Your qualifications and coverage areas"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company_name">
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company_name"
                      placeholder="ABC Construction Inc."
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">
                    Industry <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_type">
                    Business Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.business_type}
                    onValueChange={(value) => setFormData({ ...formData, business_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business structure" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your company and services..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="founded_year">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Founded Year
                    </Label>
                    <Input
                      id="founded_year"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.founded_year}
                      onChange={(e) => setFormData({ ...formData, founded_year: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee_count">
                      <Users className="inline h-4 w-4 mr-1" />
                      Number of Employees
                    </Label>
                    <Input
                      id="employee_count"
                      type="number"
                      min="1"
                      value={formData.employee_count}
                      onChange={(e) => setFormData({ ...formData, employee_count: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Contact Information */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Business Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">
                    <Globe className="inline h-4 w-4 mr-1" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://www.example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="Toronto"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Province/State</Label>
                    <Input
                      id="state"
                      placeholder="Ontario"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      placeholder="M5V 3A8"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Business Details */}
            {step === 3 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax_id">
                      <CreditCard className="inline h-4 w-4 mr-1" />
                      Tax ID / Business Number
                    </Label>
                    <Input
                      id="tax_id"
                      placeholder="123456789"
                      value={formData.tax_id}
                      onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_license_number">
                      <FileText className="inline h-4 w-4 mr-1" />
                      Business License #
                    </Label>
                    <Input
                      id="business_license_number"
                      placeholder="BL-123456"
                      value={formData.business_license_number}
                      onChange={(e) => setFormData({ ...formData, business_license_number: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insurance_provider">
                      <Shield className="inline h-4 w-4 mr-1" />
                      Insurance Provider
                    </Label>
                    <Input
                      id="insurance_provider"
                      placeholder="ABC Insurance Co."
                      value={formData.insurance_provider}
                      onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insurance_policy_number">Policy Number</Label>
                    <Input
                      id="insurance_policy_number"
                      placeholder="POL-123456"
                      value={formData.insurance_policy_number}
                      onChange={(e) => setFormData({ ...formData, insurance_policy_number: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="workers_comp"
                    checked={formData.workers_comp_coverage}
                    onChange={(e) => setFormData({ ...formData, workers_comp_coverage: e.target.checked })}
                    className="h-4 w-4 rounded border-input"
                  />
                  <Label htmlFor="workers_comp" className="cursor-pointer">
                    Workers' Compensation Coverage
                  </Label>
                </div>
              </>
            )}

            {/* Step 4: Certifications & Service Areas */}
            {step === 4 && (
              <>
                <div className="space-y-2">
                  <Label>Certifications (Optional)</Label>
                  <Textarea
                    placeholder="List your certifications, separated by commas&#10;e.g., Licensed Electrician, HVAC Certified, BBB Accredited"
                    rows={3}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      certifications: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Service Areas (Optional)</Label>
                  <Textarea
                    placeholder="List areas you service, separated by commas&#10;e.g., Toronto, Mississauga, Vaughan, Richmond Hill"
                    rows={3}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      service_areas: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                  />
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    Setup Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company:</span>
                      <span className="font-medium">{formData.company_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry:</span>
                      <span className="font-medium">
                        {INDUSTRIES.find(i => i.value === formData.industry)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{formData.city}, {formData.state}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>

              {step < totalSteps ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="min-w-32"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      Complete Setup
                      <Check className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};