-- Enhanced Templates System with Industry-Specific Presets

-- Add industry type and preset flag to templates table
ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS industry_type text,
ADD COLUMN IF NOT EXISTS is_preset boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS icon text,
ADD COLUMN IF NOT EXISTS typical_duration text,
ADD COLUMN IF NOT EXISTS difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS required_tools jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS common_materials jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS price_range jsonb DEFAULT '{"min": 0, "max": 0}'::jsonb;

-- Create industry presets table for quick access
CREATE TABLE IF NOT EXISTS industry_presets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  industry_type text NOT NULL,
  name text NOT NULL,
  description text,
  icon text,
  base_markup numeric DEFAULT 1.35,
  typical_overhead numeric DEFAULT 0.15,
  common_tasks jsonb DEFAULT '[]'::jsonb,
  common_materials jsonb DEFAULT '[]'::jsonb,
  required_certifications text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(industry_type)
);

-- Enable RLS
ALTER TABLE industry_presets ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view industry presets
CREATE POLICY "Anyone can view industry presets"
ON industry_presets FOR SELECT
USING (true);

-- Only admins can manage presets  
CREATE POLICY "Admins can manage industry presets"
ON industry_presets FOR ALL
USING (is_admin());

-- Insert industry presets
INSERT INTO industry_presets (industry_type, name, description, icon, base_markup, typical_overhead, common_tasks, common_materials, required_certifications) VALUES
(
  'plumbing',
  'Plumbing Services',
  'Standard plumbing repairs, installations, and maintenance',
  'Wrench',
  1.40,
  0.18,
  '[
    {"name": "Leak Detection & Repair", "duration_hours": 2, "rate": 125},
    {"name": "Faucet Installation", "duration_hours": 1.5, "rate": 95},
    {"name": "Toilet Repair/Replace", "duration_hours": 2, "rate": 150},
    {"name": "Drain Cleaning", "duration_hours": 1, "rate": 110},
    {"name": "Water Heater Installation", "duration_hours": 4, "rate": 175},
    {"name": "Pipe Repair", "duration_hours": 3, "rate": 135},
    {"name": "Garbage Disposal Install", "duration_hours": 1.5, "rate": 120}
  ]'::jsonb,
  '[
    {"name": "PVC Pipe (10ft)", "unit": "piece", "avg_cost": 12},
    {"name": "Copper Fittings", "unit": "set", "avg_cost": 25},
    {"name": "Plumber''s Putty", "unit": "container", "avg_cost": 8},
    {"name": "Teflon Tape", "unit": "roll", "avg_cost": 3},
    {"name": "Shut-off Valves", "unit": "piece", "avg_cost": 15},
    {"name": "Wax Ring", "unit": "piece", "avg_cost": 5},
    {"name": "P-Trap", "unit": "piece", "avg_cost": 20}
  ]'::jsonb,
  ARRAY['Licensed Plumber', 'Backflow Prevention Certification']
),
(
  'roofing',
  'Roofing Services',
  'Roof repair, replacement, and maintenance',
  'Home',
  1.45,
  0.20,
  '[
    {"name": "Roof Inspection", "duration_hours": 1.5, "rate": 95},
    {"name": "Shingle Replacement (per sq)", "duration_hours": 0.5, "rate": 75},
    {"name": "Full Roof Replacement", "duration_hours": 24, "rate": 150},
    {"name": "Gutter Installation", "duration_hours": 6, "rate": 85},
    {"name": "Flashing Repair", "duration_hours": 2, "rate": 110},
    {"name": "Emergency Tarp", "duration_hours": 1, "rate": 125},
    {"name": "Ridge Vent Installation", "duration_hours": 4, "rate": 95}
  ]'::jsonb,
  '[
    {"name": "Asphalt Shingles (bundle)", "unit": "bundle", "avg_cost": 35},
    {"name": "Roofing Felt (roll)", "unit": "roll", "avg_cost": 25},
    {"name": "Roofing Nails (5lb)", "unit": "box", "avg_cost": 15},
    {"name": "Flashing", "unit": "piece", "avg_cost": 12},
    {"name": "Ridge Caps", "unit": "linear ft", "avg_cost": 8},
    {"name": "Ice & Water Shield", "unit": "roll", "avg_cost": 65},
    {"name": "Drip Edge", "unit": "10ft piece", "avg_cost": 18}
  ]'::jsonb,
  ARRAY['Roofing License', 'Fall Protection Certification']
),
(
  'kitchen_remodel',
  'Kitchen Remodeling',
  'Complete kitchen renovation and remodeling services',
  'ChefHat',
  1.50,
  0.22,
  '[
    {"name": "Design & Planning", "duration_hours": 8, "rate": 125},
    {"name": "Demolition", "duration_hours": 16, "rate": 85},
    {"name": "Cabinet Installation", "duration_hours": 12, "rate": 110},
    {"name": "Countertop Installation", "duration_hours": 8, "rate": 125},
    {"name": "Backsplash Installation", "duration_hours": 6, "rate": 95},
    {"name": "Flooring Installation", "duration_hours": 10, "rate": 85},
    {"name": "Appliance Installation", "duration_hours": 4, "rate": 95},
    {"name": "Electrical Work", "duration_hours": 12, "rate": 135},
    {"name": "Plumbing Rough-in", "duration_hours": 8, "rate": 125},
    {"name": "Painting & Finishing", "duration_hours": 10, "rate": 75}
  ]'::jsonb,
  '[
    {"name": "Kitchen Cabinets (per linear ft)", "unit": "linear ft", "avg_cost": 150},
    {"name": "Quartz Countertop (per sq ft)", "unit": "sq ft", "avg_cost": 75},
    {"name": "Tile Backsplash (per sq ft)", "unit": "sq ft", "avg_cost": 15},
    {"name": "Vinyl Plank Flooring (per sq ft)", "unit": "sq ft", "avg_cost": 4},
    {"name": "Under-cabinet Lighting", "unit": "set", "avg_cost": 120},
    {"name": "Kitchen Sink", "unit": "piece", "avg_cost": 350},
    {"name": "Faucet", "unit": "piece", "avg_cost": 250}
  ]'::jsonb,
  ARRAY['General Contractor License', 'Kitchen Design Certification']
);

-- Create template presets for each industry
INSERT INTO templates (user_id, name, category, description, is_active, is_preset, industry_type, icon, typical_duration, difficulty_level, price_range, required_tools, common_materials) 
SELECT 
  auth.uid(),
  'Emergency Plumbing Service',
  'plumbing',
  'Quick response template for emergency plumbing repairs',
  true,
  true,
  'plumbing',
  'Wrench',
  '2-4 hours',
  'intermediate',
  '{"min": 200, "max": 500}'::jsonb,
  '["Pipe Wrench", "Plunger", "Snake/Auger", "Pipe Cutter", "Torch", "Leak Detector"]'::jsonb,
  '["Emergency Shutoff Valves", "Pipe Repair Clamps", "Flex Connectors", "Plumber''s Tape"]'::jsonb
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO templates (user_id, name, category, description, is_active, is_preset, industry_type, icon, typical_duration, difficulty_level, price_range, required_tools, common_materials) 
SELECT 
  auth.uid(),
  'Bathroom Renovation - Plumbing',
  'plumbing',
  'Complete plumbing work for bathroom renovation',
  true,
  true,
  'plumbing',
  'Bath',
  '3-5 days',
  'advanced',
  '{"min": 2500, "max": 6000}'::jsonb,
  '["Pipe Wrench", "Tubing Cutter", "Soldering Kit", "PEX Tools", "Level", "Drill"]'::jsonb,
  '["Toilet", "Vanity Plumbing Kit", "Shower Valve", "Supply Lines", "P-Traps", "Shut-off Valves"]'::jsonb
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO templates (user_id, name, category, description, is_active, is_preset, industry_type, icon, typical_duration, difficulty_level, price_range, required_tools, common_materials) 
SELECT 
  auth.uid(),
  'Roof Repair - Storm Damage',
  'roofing',
  'Emergency roof repair after storm damage',
  true,
  true,
  'roofing',
  'CloudRain',
  '1-2 days',
  'intermediate',
  '{"min": 500, "max": 2000}'::jsonb,
  '["Roofing Hammer", "Pry Bar", "Roofing Knife", "Chalk Line", "Safety Harness", "Ladder"]'::jsonb,
  '["Shingles", "Roofing Cement", "Flashing", "Tarp", "Roofing Nails", "Sealant"]'::jsonb
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO templates (user_id, name, category, description, is_active, is_preset, industry_type, icon, typical_duration, difficulty_level, price_range, required_tools, common_materials) 
SELECT 
  auth.uid(),
  'Complete Roof Replacement',
  'roofing',
  'Full tear-off and replacement of residential roof',
  true,
  true,
  'roofing',
  'Home',
  '3-5 days',
  'advanced',
  '{"min": 8000, "max": 20000}'::jsonb,
  '["Nail Gun", "Roofing Shovel", "Tin Snips", "Circular Saw", "Safety Equipment", "Dumpster"]'::jsonb,
  '["Shingles (30+ bundles)", "Underlayment", "Ice & Water Shield", "Ridge Vents", "Flashing Kit", "Starter Strip"]'::jsonb
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO templates (user_id, name, category, description, is_active, is_preset, industry_type, icon, typical_duration, difficulty_level, price_range, required_tools, common_materials) 
SELECT 
  auth.uid(),
  'Small Kitchen Update',
  'kitchen_remodel',
  'Cabinet refacing, new countertops, and backsplash',
  true,
  true,
  'kitchen_remodel',
  'ChefHat',
  '5-7 days',
  'intermediate',
  '{"min": 5000, "max": 15000}'::jsonb,
  '["Circular Saw", "Jigsaw", "Level", "Drill", "Tile Saw", "Sanders"]'::jsonb,
  '["Cabinet Doors", "Countertop Slab", "Backsplash Tile", "Cabinet Hardware", "Adhesive", "Grout"]'::jsonb
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO templates (user_id, name, category, description, is_active, is_preset, industry_type, icon, typical_duration, difficulty_level, price_range, required_tools, common_materials) 
SELECT 
  auth.uid(),
  'Full Kitchen Remodel',
  'kitchen_remodel',
  'Complete kitchen gut and renovation',
  true,
  true,
  'kitchen_remodel',
  'Home',
  '4-8 weeks',
  'advanced',
  '{"min": 25000, "max": 75000}'::jsonb,
  '["Full Tool Set", "Tile Saw", "Compound Miter Saw", "Cabinet Jacks", "Plumbing Tools", "Electrical Tools"]'::jsonb,
  '["Cabinets", "Countertops", "Appliances", "Flooring", "Lighting", "Plumbing Fixtures", "Electrical Supplies"]'::jsonb
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create template tasks for a sample template (Kitchen Remodel) using the correct column names
INSERT INTO template_tasks (template_id, code, label, trade, duration_days, rate_per_unit, sort_order, requires_permit, requires_inspection)
SELECT 
  t.id,
  'DEMO-001',
  'Kitchen Demolition',
  'general',
  2,
  85,
  1,
  false,
  false
FROM templates t
WHERE t.name = 'Full Kitchen Remodel' AND t.user_id = auth.uid()
ON CONFLICT DO NOTHING;

INSERT INTO template_tasks (template_id, code, label, trade, duration_days, rate_per_unit, sort_order, requires_permit, requires_inspection)
SELECT 
  t.id,
  'ELEC-001',
  'Electrical Rough-In',
  'electrical',
  1.5,
  135,
  2,
  true,
  true
FROM templates t
WHERE t.name = 'Full Kitchen Remodel' AND t.user_id = auth.uid()
ON CONFLICT DO NOTHING;

INSERT INTO template_tasks (template_id, code, label, trade, duration_days, rate_per_unit, sort_order, requires_permit, requires_inspection)
SELECT 
  t.id,
  'PLUMB-001',
  'Plumbing Rough-In',
  'plumbing',
  1,
  125,
  3,
  true,
  true
FROM templates t
WHERE t.name = 'Full Kitchen Remodel' AND t.user_id = auth.uid()
ON CONFLICT DO NOTHING;

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_industry_presets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_industry_presets_updated_at
BEFORE UPDATE ON industry_presets
FOR EACH ROW
EXECUTE FUNCTION update_industry_presets_updated_at();