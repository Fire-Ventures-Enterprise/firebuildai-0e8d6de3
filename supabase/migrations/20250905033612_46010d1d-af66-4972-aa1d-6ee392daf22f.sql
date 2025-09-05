-- Seed the Kitchen Remodel v1 template
DO $$
DECLARE
  v_template_id UUID;
  v_task_id UUID;
BEGIN
  -- Create the Kitchen Remodel template
  INSERT INTO public.templates (
    user_id,
    name,
    category,
    version,
    description,
    options_schema,
    params_schema
  ) VALUES (
    auth.uid(),
    'Kitchen Remodel',
    'kitchen',
    'v1',
    'Complete kitchen renovation template with proper trade sequencing',
    jsonb_build_object(
      'includeDemoFloor', jsonb_build_object('type', 'boolean', 'default', true, 'label', 'Include floor demolition'),
      'floorsBeforeCabs', jsonb_build_object('type', 'boolean', 'default', false, 'label', 'Install floors before cabinets'),
      'includeBacksplash', jsonb_build_object('type', 'boolean', 'default', true, 'label', 'Include backsplash'),
      'includeSubfloor', jsonb_build_object('type', 'boolean', 'default', false, 'label', 'Include subfloor repair'),
      'countertopMaterial', jsonb_build_object('type', 'select', 'default', 'Quartz', 'options', jsonb_build_array('Granite', 'Quartz', 'Marble', 'Laminate'))
    ),
    jsonb_build_object(
      'floorSqft', jsonb_build_object('type', 'number', 'label', 'Floor area (sq ft)', 'required', true),
      'backsplashLF', jsonb_build_object('type', 'number', 'label', 'Backsplash length (linear ft)', 'required', false),
      'cabinetBoxes', jsonb_build_object('type', 'number', 'label', 'Number of cabinet boxes', 'required', true)
    )
  ) RETURNING id INTO v_template_id;

  -- Pre-construction tasks
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'PERMITS', 'Permits and approvals', 'Admin', 0.5, 1, 500, 'ea');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'CONTAIN', 'Site protection & containment', 'General', 0.5, 2, 300, 'ea')
  RETURNING id INTO v_task_id;

  -- Demo tasks
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'DEMO_CASEWORK', 'Demo cabinets/counters/backsplash', 'Demo', 1, 3, 45, 'sqft')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'CONTAIN');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, enabled_condition, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'DEMO_FLOOR', 'Demo flooring', 'Demo', 1, 4, 'options.includeDemoFloor', 8, 'sqft')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'CONTAIN');
  
  -- Safe-off tasks
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'PL_SAFE_OFF', 'Plumbing safe-off', 'Plumbing', 0.5, 5, 350, 'ea')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'DEMO_CASEWORK');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'EL_SAFE_OFF', 'Electrical safe-off', 'Electrical', 0.5, 6, 350, 'ea')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'DEMO_CASEWORK');
  
  -- Rough-in tasks
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'FRAMING', 'Minor framing adjustments', 'Carpentry', 0.5, 7, 85, 'hr')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'DEMO_CASEWORK'), (v_task_id, 'DEMO_FLOOR');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'PL_ROUGH', 'Rough plumbing', 'Plumbing', 1, 8, 850, 'ea')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'FRAMING');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'EL_ROUGH', 'Rough electrical', 'Electrical', 1, 9, 950, 'ea')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'FRAMING');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, requires_inspection, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'INSPECT_ROUGH', 'Rough-in inspection(s)', 'Inspection', 0.5, 10, true, 150, 'ea')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'PL_ROUGH'), (v_task_id, 'EL_ROUGH');
  
  -- Drywall & paint
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'DRYWALL', 'Drywall & mud', 'Drywall', 2, 11, 12, 'sqft')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'INSPECT_ROUGH');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'PAINT_1', 'Prime & first coat', 'Paint', 1, 12, 8, 'sqft')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'DRYWALL');
  
  -- Flooring tasks
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, enabled_condition, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'SUBFLOOR', 'Subfloor repair', 'Carpentry', 0.5, 13, 'options.includeSubfloor', 15, 'sqft')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'DEMO_FLOOR');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, default_qty_formula, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'FLOOR', 'Flooring install', 'Flooring', 2, 14, 'floorSqft', 12, 'sqft')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'SUBFLOOR'), (v_task_id, 'PAINT_1');
  
  -- Cabinet & counter tasks
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, default_qty_formula, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'CABS_INSTALL', 'Cabinet install', 'Install', 2, 15, 'cabinetBoxes', 250, 'ea')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'PAINT_1');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'TOPS_TEMPLATE', 'Countertop template/measure', 'Counters', 0.2, 16, 250, 'ea')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'CABS_INSTALL');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, is_lead_time, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'TOPS_FAB', 'Countertop fabrication', 'Counters', 7, 17, true, 0, 'ea')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'TOPS_TEMPLATE');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'TOPS_INSTALL', 'Countertop install', 'Counters', 1, 18, 85, 'lf')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'TOPS_FAB');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, enabled_condition, default_qty_formula, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'BS_INSTALL', 'Backsplash install & grout', 'Tile', 1.5, 19, 'options.includeBacksplash', 'backsplashLF', 45, 'lf')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'TOPS_INSTALL');
  
  -- Finish tasks
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'PL_FINISH', 'Finish plumbing (sink/DW/faucet)', 'Plumbing', 0.5, 20, 450, 'ea')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'TOPS_INSTALL');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'EL_FINISH', 'Finish electrical (fixtures)', 'Electrical', 0.5, 21, 450, 'ea')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'TOPS_INSTALL');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'PAINT_2', 'Final paint/touch-ups', 'Paint', 0.5, 22, 6, 'sqft')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'BS_INSTALL'), (v_task_id, 'PL_FINISH'), (v_task_id, 'EL_FINISH');
  
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, sort_order, rate_per_unit, unit_of_measure)
  VALUES (v_template_id, 'CLEAN', 'Final clean & walkthrough', 'General', 0.5, 23, 350, 'ea')
  RETURNING id INTO v_task_id;
  
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code)
  VALUES (v_task_id, 'PAINT_2');
  
  -- Add billing milestones for the template
  INSERT INTO public.billing_milestones (template_id, name, percentage, trigger_type, depends_on_task_codes, sort_order)
  VALUES 
    (v_template_id, 'Deposit', 25, 'on_accept', NULL, 1),
    (v_template_id, 'Rough-ins complete', 25, 'after_tasks', ARRAY['INSPECT_ROUGH'], 2),
    (v_template_id, 'Cabinets installed', 25, 'after_tasks', ARRAY['CABS_INSTALL'], 3),
    (v_template_id, 'Final', 25, 'after_tasks', ARRAY['CLEAN'], 4);

END $$;