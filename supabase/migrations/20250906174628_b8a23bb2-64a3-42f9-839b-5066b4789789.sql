-- Create custom_services table for storing user-defined services
CREATE TABLE public.custom_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  estimated_duration TEXT,
  duration_days NUMERIC,
  industry_types TEXT[] DEFAULT ARRAY['custom']::text[],
  phases JSONB,
  materials TEXT[],
  dependencies JSONB,
  product_selection JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_services ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own custom services" 
ON public.custom_services 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own custom services" 
ON public.custom_services 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom services" 
ON public.custom_services 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom services" 
ON public.custom_services 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create company_profiles table for storing company-specific settings
CREATE TABLE public.company_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  primary_industry TEXT NOT NULL DEFAULT 'general_contractor',
  secondary_industries TEXT[],
  services_enabled JSONB DEFAULT '{"useIndustryDefaults": true}'::jsonb,
  working_hours JSONB,
  holidays TEXT[],
  buffer_days_per_task NUMERIC DEFAULT 0.1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for company profiles
CREATE POLICY "Users can view their own company profiles" 
ON public.company_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own company profiles" 
ON public.company_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company profiles" 
ON public.company_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own company profiles" 
ON public.company_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create service_templates table for storing template selections
CREATE TABLE public.service_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  phases JSONB,
  dependencies JSONB,
  product_selection JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for service templates
CREATE POLICY "Users can view their own service templates" 
ON public.service_templates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own service templates" 
ON public.service_templates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own service templates" 
ON public.service_templates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own service templates" 
ON public.service_templates 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_custom_services_user_id ON public.custom_services(user_id);
CREATE INDEX idx_company_profiles_user_id ON public.company_profiles(user_id);
CREATE INDEX idx_service_templates_user_id ON public.service_templates(user_id);

-- Create update trigger for updated_at columns
CREATE TRIGGER update_custom_services_updated_at
  BEFORE UPDATE ON public.custom_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_profiles_updated_at
  BEFORE UPDATE ON public.company_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_templates_updated_at
  BEFORE UPDATE ON public.service_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();