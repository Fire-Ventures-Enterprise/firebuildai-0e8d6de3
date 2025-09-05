-- Seed additional service presets
DO $$
DECLARE
  v_user_id UUID;
  v_bathroom_id UUID;
  v_roof_id UUID;
  v_hvac_id UUID;
  v_panel_id UUID;
  v_counter_id UUID;
BEGIN
  -- Get the first user (for seeding purposes)
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No users found, skipping preset seeding';
    RETURN;
  END IF;

  -- 1. Bathroom Remodel
  INSERT INTO public.templates (user_id, name, category, industry, version, description, display_order, icon)
  VALUES (
    v_user_id,
    'Bathroom Remodel',
    'bathroom',
    'kitchen_bath',
    'v1',
    'Complete bathroom renovation with plumbing, tile, and fixtures',
    2,
    'Bath'
  ) RETURNING id INTO v_bathroom_id;

  -- Bathroom tasks
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, rate_per_unit, unit_of_measure, sort_order) VALUES
  (v_bathroom_id, 'BATH_DEMO', 'Demo existing bathroom', 'Demo', 1, 500, 'ea', 1),
  (v_bathroom_id, 'BATH_PL_ROUGH', 'Rough plumbing', 'Plumbing', 1.5, 800, 'ea', 2),
  (v_bathroom_id, 'BATH_EL_ROUGH', 'Rough electrical', 'Electrical', 1, 600, 'ea', 3),
  (v_bathroom_id, 'BATH_INSPECT', 'Inspection', 'Inspection', 0.5, 200, 'ea', 4),
  (v_bathroom_id, 'BATH_DRYWALL', 'Drywall & waterproofing', 'Drywall', 2, 45, 'sqft', 5),
  (v_bathroom_id, 'BATH_TILE', 'Tile installation', 'Tile', 3, 25, 'sqft', 6),
  (v_bathroom_id, 'BATH_VANITY', 'Vanity & countertop', 'Install', 1, 800, 'ea', 7),
  (v_bathroom_id, 'BATH_PL_FINISH', 'Finish plumbing', 'Plumbing', 1, 600, 'ea', 8),
  (v_bathroom_id, 'BATH_EL_FINISH', 'Finish electrical', 'Electrical', 0.5, 400, 'ea', 9),
  (v_bathroom_id, 'BATH_CLEAN', 'Final clean', 'General', 0.5, 200, 'ea', 10);

  -- Bathroom dependencies
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code) VALUES
  ((SELECT id FROM template_tasks WHERE template_id = v_bathroom_id AND code = 'BATH_PL_ROUGH'), 'BATH_DEMO'),
  ((SELECT id FROM template_tasks WHERE template_id = v_bathroom_id AND code = 'BATH_EL_ROUGH'), 'BATH_DEMO'),
  ((SELECT id FROM template_tasks WHERE template_id = v_bathroom_id AND code = 'BATH_INSPECT'), 'BATH_PL_ROUGH'),
  ((SELECT id FROM template_tasks WHERE template_id = v_bathroom_id AND code = 'BATH_INSPECT'), 'BATH_EL_ROUGH'),
  ((SELECT id FROM template_tasks WHERE template_id = v_bathroom_id AND code = 'BATH_DRYWALL'), 'BATH_INSPECT'),
  ((SELECT id FROM template_tasks WHERE template_id = v_bathroom_id AND code = 'BATH_TILE'), 'BATH_DRYWALL'),
  ((SELECT id FROM template_tasks WHERE template_id = v_bathroom_id AND code = 'BATH_VANITY'), 'BATH_TILE'),
  ((SELECT id FROM template_tasks WHERE template_id = v_bathroom_id AND code = 'BATH_PL_FINISH'), 'BATH_VANITY'),
  ((SELECT id FROM template_tasks WHERE template_id = v_bathroom_id AND code = 'BATH_EL_FINISH'), 'BATH_VANITY'),
  ((SELECT id FROM template_tasks WHERE template_id = v_bathroom_id AND code = 'BATH_CLEAN'), 'BATH_PL_FINISH'),
  ((SELECT id FROM template_tasks WHERE template_id = v_bathroom_id AND code = 'BATH_CLEAN'), 'BATH_EL_FINISH');

  -- 2. Roof Replacement
  INSERT INTO public.templates (user_id, name, category, industry, version, description, display_order, icon)
  VALUES (
    v_user_id,
    'Roof Replacement',
    'roofing',
    'exterior',
    'v1',
    'Complete roof tear-off and replacement',
    3,
    'Home'
  ) RETURNING id INTO v_roof_id;

  -- Roof tasks
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, rate_per_unit, unit_of_measure, sort_order) VALUES
  (v_roof_id, 'ROOF_TEAROFF', 'Tear off existing roof', 'Roofing', 1, 2, 'sqft', 1),
  (v_roof_id, 'ROOF_DRYIN', 'Dry-in/felt paper', 'Roofing', 0.5, 1, 'sqft', 2),
  (v_roof_id, 'ROOF_UNDERLAYMENT', 'Install underlayment', 'Roofing', 1, 1.5, 'sqft', 3),
  (v_roof_id, 'ROOF_SHINGLES', 'Install shingles', 'Roofing', 2, 3.5, 'sqft', 4),
  (v_roof_id, 'ROOF_FLASHING', 'Flashings & details', 'Roofing', 1, 45, 'lf', 5),
  (v_roof_id, 'ROOF_CLEANUP', 'Final cleanup', 'General', 0.5, 300, 'ea', 6);

  -- Roof dependencies
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code) VALUES
  ((SELECT id FROM template_tasks WHERE template_id = v_roof_id AND code = 'ROOF_DRYIN'), 'ROOF_TEAROFF'),
  ((SELECT id FROM template_tasks WHERE template_id = v_roof_id AND code = 'ROOF_UNDERLAYMENT'), 'ROOF_DRYIN'),
  ((SELECT id FROM template_tasks WHERE template_id = v_roof_id AND code = 'ROOF_SHINGLES'), 'ROOF_UNDERLAYMENT'),
  ((SELECT id FROM template_tasks WHERE template_id = v_roof_id AND code = 'ROOF_FLASHING'), 'ROOF_SHINGLES'),
  ((SELECT id FROM template_tasks WHERE template_id = v_roof_id AND code = 'ROOF_CLEANUP'), 'ROOF_FLASHING');

  -- 3. HVAC Changeout
  INSERT INTO public.templates (user_id, name, category, industry, version, description, display_order, icon)
  VALUES (
    v_user_id,
    'HVAC Changeout',
    'hvac',
    'mechanical',
    'v1',
    'Complete HVAC system replacement',
    4,
    'Wind'
  ) RETURNING id INTO v_hvac_id;

  -- HVAC tasks
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, rate_per_unit, unit_of_measure, sort_order) VALUES
  (v_hvac_id, 'HVAC_RECOVER', 'Recover refrigerant', 'HVAC', 0.5, 350, 'ea', 1),
  (v_hvac_id, 'HVAC_REMOVE', 'Remove old equipment', 'HVAC', 1, 500, 'ea', 2),
  (v_hvac_id, 'HVAC_SET_CONDENSER', 'Set new condenser', 'HVAC', 0.5, 800, 'ea', 3),
  (v_hvac_id, 'HVAC_SET_HANDLER', 'Set air handler', 'HVAC', 1, 1200, 'ea', 4),
  (v_hvac_id, 'HVAC_LINESET', 'Run line set', 'HVAC', 1, 45, 'lf', 5),
  (v_hvac_id, 'HVAC_CHARGE', 'Charge & test system', 'HVAC', 0.5, 450, 'ea', 6),
  (v_hvac_id, 'HVAC_THERMOSTAT', 'Install thermostat', 'HVAC', 0.5, 350, 'ea', 7);

  -- HVAC dependencies
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code) VALUES
  ((SELECT id FROM template_tasks WHERE template_id = v_hvac_id AND code = 'HVAC_REMOVE'), 'HVAC_RECOVER'),
  ((SELECT id FROM template_tasks WHERE template_id = v_hvac_id AND code = 'HVAC_SET_CONDENSER'), 'HVAC_REMOVE'),
  ((SELECT id FROM template_tasks WHERE template_id = v_hvac_id AND code = 'HVAC_SET_HANDLER'), 'HVAC_REMOVE'),
  ((SELECT id FROM template_tasks WHERE template_id = v_hvac_id AND code = 'HVAC_LINESET'), 'HVAC_SET_CONDENSER'),
  ((SELECT id FROM template_tasks WHERE template_id = v_hvac_id AND code = 'HVAC_LINESET'), 'HVAC_SET_HANDLER'),
  ((SELECT id FROM template_tasks WHERE template_id = v_hvac_id AND code = 'HVAC_CHARGE'), 'HVAC_LINESET'),
  ((SELECT id FROM template_tasks WHERE template_id = v_hvac_id AND code = 'HVAC_THERMOSTAT'), 'HVAC_CHARGE');

  -- 4. Electrical Panel Upgrade
  INSERT INTO public.templates (user_id, name, category, industry, version, description, display_order, icon)
  VALUES (
    v_user_id,
    'Electrical Panel Upgrade',
    'electrical',
    'electrical',
    'v1',
    '200A panel upgrade with utility coordination',
    5,
    'Zap'
  ) RETURNING id INTO v_panel_id;

  -- Panel tasks
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, rate_per_unit, unit_of_measure, sort_order) VALUES
  (v_panel_id, 'PANEL_UTILITY', 'Utility coordination', 'Electrical', 1, 500, 'ea', 1),
  (v_panel_id, 'PANEL_TEMP', 'Setup temp power', 'Electrical', 0.5, 400, 'ea', 2),
  (v_panel_id, 'PANEL_DEMO', 'Demo old panel', 'Electrical', 0.5, 300, 'ea', 3),
  (v_panel_id, 'PANEL_SET', 'Set new 200A panel', 'Electrical', 1, 2500, 'ea', 4),
  (v_panel_id, 'PANEL_CIRCUITS', 'Terminate circuits', 'Electrical', 1.5, 75, 'circuit', 5),
  (v_panel_id, 'PANEL_INSPECT', 'Final inspection', 'Inspection', 0.5, 250, 'ea', 6);

  -- Panel dependencies
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code) VALUES
  ((SELECT id FROM template_tasks WHERE template_id = v_panel_id AND code = 'PANEL_TEMP'), 'PANEL_UTILITY'),
  ((SELECT id FROM template_tasks WHERE template_id = v_panel_id AND code = 'PANEL_DEMO'), 'PANEL_TEMP'),
  ((SELECT id FROM template_tasks WHERE template_id = v_panel_id AND code = 'PANEL_SET'), 'PANEL_DEMO'),
  ((SELECT id FROM template_tasks WHERE template_id = v_panel_id AND code = 'PANEL_CIRCUITS'), 'PANEL_SET'),
  ((SELECT id FROM template_tasks WHERE template_id = v_panel_id AND code = 'PANEL_INSPECT'), 'PANEL_CIRCUITS');

  -- 5. Countertop Fabrication & Install
  INSERT INTO public.templates (user_id, name, category, industry, version, description, display_order, icon)
  VALUES (
    v_user_id,
    'Countertop Fab & Install',
    'countertops',
    'kitchen_bath',
    'v1',
    'Template, fabricate, and install stone countertops',
    6,
    'Square'
  ) RETURNING id INTO v_counter_id;

  -- Countertop tasks
  INSERT INTO public.template_tasks (template_id, code, label, trade, duration_days, rate_per_unit, unit_of_measure, sort_order, is_lead_time) VALUES
  (v_counter_id, 'CTR_TEMPLATE', 'Template & measure', 'Counters', 0.25, 350, 'ea', 1, false),
  (v_counter_id, 'CTR_FAB', 'Fabrication (lead time)', 'Counters', 7, 45, 'sqft', 2, true),
  (v_counter_id, 'CTR_INSTALL', 'Install countertops', 'Counters', 1, 35, 'sqft', 3, false),
  (v_counter_id, 'CTR_PLUMB', 'Plumbing reconnect', 'Plumbing', 0.5, 450, 'ea', 4, false);

  -- Countertop dependencies
  INSERT INTO public.template_dependencies (template_task_id, depends_on_code) VALUES
  ((SELECT id FROM template_tasks WHERE template_id = v_counter_id AND code = 'CTR_FAB'), 'CTR_TEMPLATE'),
  ((SELECT id FROM template_tasks WHERE template_id = v_counter_id AND code = 'CTR_INSTALL'), 'CTR_FAB'),
  ((SELECT id FROM template_tasks WHERE template_id = v_counter_id AND code = 'CTR_PLUMB'), 'CTR_INSTALL');

  -- Add billing milestones for each preset
  INSERT INTO public.billing_milestones (template_id, name, percentage, trigger_type, sort_order) VALUES
  -- Bathroom
  (v_bathroom_id, 'Deposit', 30, 'on_accept', 1),
  (v_bathroom_id, 'Rough-ins Complete', 30, 'after_tasks', 2),
  (v_bathroom_id, 'Tile Complete', 20, 'after_tasks', 3),
  (v_bathroom_id, 'Final', 20, 'after_tasks', 4),
  -- Roof
  (v_roof_id, 'Deposit', 40, 'on_accept', 1),
  (v_roof_id, 'Dry-in Complete', 30, 'after_tasks', 2),
  (v_roof_id, 'Final', 30, 'after_tasks', 3),
  -- HVAC
  (v_hvac_id, 'Deposit', 50, 'on_accept', 1),
  (v_hvac_id, 'Final', 50, 'after_tasks', 2),
  -- Panel
  (v_panel_id, 'Deposit', 40, 'on_accept', 1),
  (v_panel_id, 'Panel Set', 40, 'after_tasks', 2),
  (v_panel_id, 'Final', 20, 'after_tasks', 3),
  -- Countertops
  (v_counter_id, 'Deposit', 50, 'on_accept', 1),
  (v_counter_id, 'Final', 50, 'after_tasks', 2);

  -- Add preset metrics
  INSERT INTO public.preset_metrics (template_id, metric_key, label, unit, required, default_value, sort_order) VALUES
  -- Bathroom
  (v_bathroom_id, 'bathroom_sqft', 'Bathroom Area', 'sq ft', true, 100, 1),
  (v_bathroom_id, 'tile_sqft', 'Tile Area', 'sq ft', true, 80, 2),
  -- Roof
  (v_roof_id, 'roof_squares', 'Roof Squares', 'squares', true, 25, 1),
  (v_roof_id, 'flashing_lf', 'Flashing Length', 'linear ft', false, 100, 2),
  -- HVAC
  (v_hvac_id, 'tonnage', 'System Tonnage', 'tons', true, 3, 1),
  (v_hvac_id, 'lineset_length', 'Line Set Length', 'ft', true, 25, 2),
  -- Panel
  (v_panel_id, 'circuit_count', 'Number of Circuits', 'circuits', true, 30, 1),
  -- Countertops
  (v_counter_id, 'counter_sqft', 'Countertop Area', 'sq ft', true, 50, 1);

END $$;