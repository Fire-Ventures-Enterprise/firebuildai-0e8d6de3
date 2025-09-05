-- Create templates system for smart estimates/invoices
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general', -- 'kitchen', 'bathroom', 'basement', 'flooring', etc.
  version TEXT DEFAULT 'v1',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  options_schema JSONB, -- Defines available options (includeDemoFloor, floorsBeforeCabs, etc.)
  params_schema JSONB, -- Defines required parameters (floorSqft, backsplashLF, etc.)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create template tasks
CREATE TABLE IF NOT EXISTS public.template_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- DEMO_CASEWORK, PL_ROUGH, etc.
  label TEXT NOT NULL,
  trade TEXT NOT NULL, -- Plumbing, Electrical, Carpentry, etc.
  duration_days NUMERIC DEFAULT 1,
  default_qty_formula TEXT, -- Expression like 'floorSqft * 1.1'
  unit_of_measure TEXT, -- sqft, lf, ea, etc.
  rate_per_unit NUMERIC DEFAULT 0,
  requires_permit BOOLEAN DEFAULT false,
  requires_inspection BOOLEAN DEFAULT false,
  is_lead_time BOOLEAN DEFAULT false, -- For tasks like countertop fabrication
  vendor_category TEXT, -- For PO generation
  crew_role TEXT,
  options_json JSONB, -- Additional options specific to this task
  sort_order INTEGER DEFAULT 0,
  enabled_condition TEXT, -- Expression like 'options.includeDemoFloor'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create template task dependencies
CREATE TABLE IF NOT EXISTS public.template_dependencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_task_id UUID NOT NULL REFERENCES public.template_tasks(id) ON DELETE CASCADE,
  depends_on_code TEXT NOT NULL, -- The code of the task this depends on
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create project tasks (expanded from templates)
CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID, -- Links to invoices_enhanced
  estimate_id UUID, -- Links to estimates
  template_id UUID REFERENCES public.templates(id),
  code TEXT NOT NULL,
  label TEXT NOT NULL,
  trade TEXT NOT NULL,
  duration_days NUMERIC DEFAULT 1,
  quantity NUMERIC,
  unit_of_measure TEXT,
  rate_per_unit NUMERIC,
  total_amount NUMERIC,
  depends_on_codes TEXT[], -- Array of task codes this depends on
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  vendor_id UUID,
  work_order_id UUID,
  purchase_order_id UUID,
  status TEXT DEFAULT 'pending', -- pending, scheduled, in_progress, completed, cancelled
  crew_assigned TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create billing milestones
CREATE TABLE IF NOT EXISTS public.billing_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE,
  invoice_id UUID,
  estimate_id UUID,
  name TEXT NOT NULL,
  percentage NUMERIC NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  amount NUMERIC,
  trigger_type TEXT NOT NULL, -- 'on_accept', 'after_tasks', 'manual'
  depends_on_task_codes TEXT[], -- Task codes that must be complete
  due_date TIMESTAMPTZ,
  paid_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- pending, due, paid
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create project-task to invoice-item linkage
CREATE TABLE IF NOT EXISTS public.project_task_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_task_id UUID NOT NULL REFERENCES public.project_tasks(id) ON DELETE CASCADE,
  invoice_item_id UUID, -- References invoice_items_enhanced
  estimate_item_id UUID, -- References estimate_items
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_templates_user_id ON public.templates(user_id);
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_template_tasks_template_id ON public.template_tasks(template_id);
CREATE INDEX idx_template_tasks_code ON public.template_tasks(code);
CREATE INDEX idx_template_dependencies_task_id ON public.template_dependencies(template_task_id);
CREATE INDEX idx_project_tasks_invoice_id ON public.project_tasks(invoice_id);
CREATE INDEX idx_project_tasks_estimate_id ON public.project_tasks(estimate_id);
CREATE INDEX idx_project_tasks_status ON public.project_tasks(status);
CREATE INDEX idx_project_tasks_work_order_id ON public.project_tasks(work_order_id);
CREATE INDEX idx_billing_milestones_invoice_id ON public.billing_milestones(invoice_id);
CREATE INDEX idx_billing_milestones_estimate_id ON public.billing_milestones(estimate_id);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_task_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for templates
CREATE POLICY "Users can view own templates" 
ON public.templates FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own templates" 
ON public.templates FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" 
ON public.templates FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" 
ON public.templates FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for template_tasks
CREATE POLICY "Users can view own template tasks" 
ON public.template_tasks FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.templates 
  WHERE templates.id = template_tasks.template_id 
  AND templates.user_id = auth.uid()
));

CREATE POLICY "Users can manage own template tasks" 
ON public.template_tasks FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.templates 
  WHERE templates.id = template_tasks.template_id 
  AND templates.user_id = auth.uid()
));

-- RLS Policies for template_dependencies
CREATE POLICY "Users can view own template dependencies" 
ON public.template_dependencies FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.template_tasks tt
  JOIN public.templates t ON t.id = tt.template_id
  WHERE tt.id = template_dependencies.template_task_id 
  AND t.user_id = auth.uid()
));

CREATE POLICY "Users can manage own template dependencies" 
ON public.template_dependencies FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.template_tasks tt
  JOIN public.templates t ON t.id = tt.template_id
  WHERE tt.id = template_dependencies.template_task_id 
  AND t.user_id = auth.uid()
));

-- RLS Policies for project_tasks
CREATE POLICY "Users can view own project tasks" 
ON public.project_tasks FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.invoices_enhanced 
    WHERE invoices_enhanced.id = project_tasks.invoice_id 
    AND invoices_enhanced.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.estimates 
    WHERE estimates.id = project_tasks.estimate_id 
    AND estimates.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage own project tasks" 
ON public.project_tasks FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.invoices_enhanced 
    WHERE invoices_enhanced.id = project_tasks.invoice_id 
    AND invoices_enhanced.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.estimates 
    WHERE estimates.id = project_tasks.estimate_id 
    AND estimates.user_id = auth.uid()
  )
);

-- RLS Policies for billing_milestones
CREATE POLICY "Users can view own billing milestones" 
ON public.billing_milestones FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.invoices_enhanced 
    WHERE invoices_enhanced.id = billing_milestones.invoice_id 
    AND invoices_enhanced.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.estimates 
    WHERE estimates.id = billing_milestones.estimate_id 
    AND estimates.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.templates 
    WHERE templates.id = billing_milestones.template_id 
    AND templates.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage own billing milestones" 
ON public.billing_milestones FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.invoices_enhanced 
    WHERE invoices_enhanced.id = billing_milestones.invoice_id 
    AND invoices_enhanced.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.estimates 
    WHERE estimates.id = billing_milestones.estimate_id 
    AND estimates.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.templates 
    WHERE templates.id = billing_milestones.template_id 
    AND templates.user_id = auth.uid()
  )
);

-- RLS Policies for project_task_items
CREATE POLICY "Users can view own project task items" 
ON public.project_task_items FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.project_tasks pt
  LEFT JOIN public.invoices_enhanced ie ON ie.id = pt.invoice_id
  LEFT JOIN public.estimates e ON e.id = pt.estimate_id
  WHERE pt.id = project_task_items.project_task_id 
  AND (ie.user_id = auth.uid() OR e.user_id = auth.uid())
));

CREATE POLICY "Users can manage own project task items" 
ON public.project_task_items FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.project_tasks pt
  LEFT JOIN public.invoices_enhanced ie ON ie.id = pt.invoice_id
  LEFT JOIN public.estimates e ON e.id = pt.estimate_id
  WHERE pt.id = project_task_items.project_task_id 
  AND (ie.user_id = auth.uid() OR e.user_id = auth.uid())
));

-- Add triggers for updated_at
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON public.project_tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_milestones_updated_at BEFORE UPDATE ON public.billing_milestones
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();