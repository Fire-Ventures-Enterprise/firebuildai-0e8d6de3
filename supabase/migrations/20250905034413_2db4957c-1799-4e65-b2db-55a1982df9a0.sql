-- Enhance templates to become service presets with industry categorization
ALTER TABLE public.templates 
ADD COLUMN industry TEXT DEFAULT 'construction',
ADD COLUMN display_order INTEGER DEFAULT 0,
ADD COLUMN icon TEXT;

-- Rename for clarity (keeping original name for now to avoid breaking changes)
COMMENT ON TABLE public.templates IS 'Service presets library with industry-specific workflows';

-- Add preset options table for configurable toggles
CREATE TABLE public.preset_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  option_key TEXT NOT NULL,
  label TEXT NOT NULL,
  option_type TEXT NOT NULL DEFAULT 'boolean', -- boolean, select, number
  default_value JSONB,
  options JSONB, -- for select type
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(template_id, option_key)
);

-- Enable RLS
ALTER TABLE public.preset_options ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view preset options" ON public.preset_options
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.templates 
    WHERE templates.id = preset_options.template_id 
    AND templates.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage preset options" ON public.preset_options
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.templates 
    WHERE templates.id = preset_options.template_id 
    AND templates.user_id = auth.uid()
  )
);

-- Add metrics table for input parameters
CREATE TABLE public.preset_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  metric_key TEXT NOT NULL,
  label TEXT NOT NULL,
  unit TEXT,
  required BOOLEAN DEFAULT false,
  default_value NUMERIC,
  min_value NUMERIC,
  max_value NUMERIC,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(template_id, metric_key)
);

-- Enable RLS
ALTER TABLE public.preset_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view preset metrics" ON public.preset_metrics
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.templates 
    WHERE templates.id = preset_metrics.template_id 
    AND templates.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage preset metrics" ON public.preset_metrics
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.templates 
    WHERE templates.id = preset_metrics.template_id 
    AND templates.user_id = auth.uid()
  )
);

-- Update the templates table
UPDATE public.templates 
SET industry = 'kitchen_bath',
    display_order = 1,
    icon = 'ChefHat'
WHERE name = 'Kitchen Remodel';

-- Create indexes for performance
CREATE INDEX idx_templates_industry ON public.templates(industry);
CREATE INDEX idx_templates_display_order ON public.templates(display_order);
CREATE INDEX idx_preset_options_template ON public.preset_options(template_id);
CREATE INDEX idx_preset_metrics_template ON public.preset_metrics(template_id);