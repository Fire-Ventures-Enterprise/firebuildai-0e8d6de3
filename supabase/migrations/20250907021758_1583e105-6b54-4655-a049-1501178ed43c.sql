-- Fix search_path for existing functions
UPDATE pg_proc 
SET prosrc = replace(prosrc, 'LANGUAGE plpgsql', 'LANGUAGE plpgsql SECURITY DEFINER SET search_path = public')
WHERE proname IN ('update_bank_integration_timestamp', 'update_communication_updated_at')
AND prosrc NOT LIKE '%search_path = public%';

-- Enhanced Settings and Company Setup Migration (Fixed)
-- Create user_settings table for user-specific preferences
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification preferences
  email_notifications JSONB DEFAULT '{
    "estimates": true,
    "invoices": true,
    "payments": true,
    "jobs": true,
    "team_updates": true,
    "system_updates": false
  }',
  push_notifications JSONB DEFAULT '{
    "estimates": true,
    "invoices": true,
    "payments": true,
    "jobs": true,
    "team_updates": true,
    "system_updates": false
  }',
  sms_notifications JSONB DEFAULT '{
    "estimates": false,
    "invoices": false,
    "payments": true,
    "jobs": false,
    "team_updates": false,
    "system_updates": false
  }',
  
  -- Application preferences
  theme TEXT DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es', 'fr')),
  timezone TEXT DEFAULT 'America/New_York',
  date_format TEXT DEFAULT 'MM/DD/YYYY' CHECK (date_format IN ('MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD')),
  time_format TEXT DEFAULT '12h' CHECK (time_format IN ('12h', '24h')),
  currency TEXT DEFAULT 'USD',
  
  -- Privacy settings
  data_sharing_analytics BOOLEAN DEFAULT true,
  data_sharing_marketing BOOLEAN DEFAULT false,
  profile_visibility TEXT DEFAULT 'team' CHECK (profile_visibility IN ('private', 'team', 'company', 'public')),
  
  -- Security settings
  two_factor_enabled BOOLEAN DEFAULT false,
  session_timeout_minutes INTEGER DEFAULT 480,
  require_password_change BOOLEAN DEFAULT false,
  
  -- UI preferences
  sidebar_collapsed BOOLEAN DEFAULT false,
  dashboard_layout JSONB DEFAULT '{"widgets": ["recent_jobs", "pending_estimates", "overdue_invoices", "team_performance"]}',
  items_per_page INTEGER DEFAULT 25 CHECK (items_per_page IN (10, 25, 50, 100)),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Create company_branding table for custom branding
CREATE TABLE IF NOT EXISTS public.company_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Brand colors
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#64748B',
  accent_color TEXT DEFAULT '#10B981',
  background_color TEXT DEFAULT '#FFFFFF',
  text_color TEXT DEFAULT '#1F2937',
  
  -- Typography
  font_family TEXT DEFAULT 'Inter',
  heading_font TEXT DEFAULT 'Inter',
  body_font TEXT DEFAULT 'Inter',
  
  -- Logo settings
  logo_url TEXT,
  logo_dark_url TEXT,
  favicon_url TEXT,
  watermark_url TEXT,
  
  -- Template customizations
  email_template_header TEXT,
  email_template_footer TEXT,
  invoice_template_style JSONB DEFAULT '{"layout": "modern", "showLogo": true, "showWatermark": false}',
  estimate_template_style JSONB DEFAULT '{"layout": "modern", "showLogo": true, "showWatermark": false}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Create user_roles table for role-based access control
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  is_system_role BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(name)
);

-- Create integration_settings table for third-party integrations
CREATE TABLE IF NOT EXISTS public.integration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Integration type and status
  integration_type TEXT NOT NULL CHECK (integration_type IN ('google_calendar', 'quickbooks', 'stripe', 'mailchimp', 'zapier', 'slack')),
  is_enabled BOOLEAN DEFAULT false,
  
  -- Configuration (encrypted sensitive data)
  config JSONB DEFAULT '{}',
  encrypted_credentials TEXT,
  
  -- Sync settings
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_frequency TEXT DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'manual')),
  auto_sync_enabled BOOLEAN DEFAULT true,
  
  -- Error handling
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, integration_type)
);

-- Create audit_logs table for tracking changes
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  
  -- Action details
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Extend company_details table with additional fields
ALTER TABLE public.company_details 
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS tax_id TEXT,
ADD COLUMN IF NOT EXISTS registration_number TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS employee_count INTEGER,
ADD COLUMN IF NOT EXISTS annual_revenue TEXT,
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_areas TEXT[],
ADD COLUMN IF NOT EXISTS certifications TEXT[],
ADD COLUMN IF NOT EXISTS insurance_info JSONB DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_company_branding_user_id ON public.company_branding(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_settings_user_id ON public.integration_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_settings_type ON public.integration_settings(integration_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "Users can view own settings" 
ON public.user_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" 
ON public.user_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for company_branding
CREATE POLICY "Users can view own branding" 
ON public.company_branding 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own branding" 
ON public.company_branding 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (is_admin());

CREATE POLICY "Users can view roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for integration_settings
CREATE POLICY "Users can view own integrations" 
ON public.integration_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own integrations" 
ON public.integration_settings 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for audit_logs
CREATE POLICY "Users can view own audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- Insert default user roles
INSERT INTO public.user_roles (name, description, permissions, is_system_role) VALUES
('Owner', 'Full access to all features and settings', '{"all": true}', true),
('Admin', 'Administrative access with most permissions', '{"manage_team": true, "manage_settings": true, "view_reports": true, "manage_jobs": true, "manage_finances": true}', true),
('Manager', 'Management access to jobs and team', '{"manage_jobs": true, "view_reports": true, "manage_team": false, "manage_finances": false}', true),
('Employee', 'Basic access to assigned jobs and tasks', '{"view_jobs": true, "update_job_status": true, "view_reports": false}', true),
('Contractor', 'Limited access for external contractors', '{"view_assigned_jobs": true, "update_job_status": true}', true)
ON CONFLICT (name) DO NOTHING;

-- Create trigger functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_settings_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for updated_at timestamps
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_settings_updated_at_column();

DROP TRIGGER IF EXISTS update_company_branding_updated_at ON public.company_branding;
CREATE TRIGGER update_company_branding_updated_at
BEFORE UPDATE ON public.company_branding
FOR EACH ROW
EXECUTE FUNCTION public.update_settings_updated_at_column();

DROP TRIGGER IF EXISTS update_integration_settings_updated_at ON public.integration_settings;
CREATE TRIGGER update_integration_settings_updated_at
BEFORE UPDATE ON public.integration_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_settings_updated_at_column();

-- Create function to automatically create default user settings
CREATE OR REPLACE FUNCTION public.create_default_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO public.company_branding (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically create default settings for new users
DROP TRIGGER IF EXISTS create_user_defaults_trigger ON auth.users;
CREATE TRIGGER create_user_defaults_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_default_user_settings();

-- Create function for audit logging
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, row_to_json(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create audit triggers for important tables
DROP TRIGGER IF EXISTS audit_user_settings_trigger ON public.user_settings;
CREATE TRIGGER audit_user_settings_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.user_settings
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

DROP TRIGGER IF EXISTS audit_company_details_trigger ON public.company_details;
CREATE TRIGGER audit_company_details_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.company_details
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

DROP TRIGGER IF EXISTS audit_company_branding_trigger ON public.company_branding;
CREATE TRIGGER audit_company_branding_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.company_branding
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();