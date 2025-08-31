-- Fix security warning for the new function
DROP FUNCTION IF EXISTS public.seed_expense_categories_for_user(UUID);

CREATE OR REPLACE FUNCTION public.seed_expense_categories_for_user(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.expense_categories (user_id, slug, name, is_fuel) 
  VALUES (p_user_id, 'fuel', 'Fuel', true)
  ON CONFLICT (user_id, slug) DO NOTHING;
  
  INSERT INTO public.expense_categories (user_id, slug, name, is_mileage) 
  VALUES (p_user_id, 'mileage', 'Mileage', true)
  ON CONFLICT (user_id, slug) DO NOTHING;
  
  INSERT INTO public.expense_categories (user_id, slug, name) 
  VALUES 
    (p_user_id, 'materials', 'Materials'),
    (p_user_id, 'tools', 'Tools'),
    (p_user_id, 'repairs', 'Repairs'),
    (p_user_id, 'office', 'Office Supplies'),
    (p_user_id, 'insurance', 'Insurance'),
    (p_user_id, 'permits', 'Permits & Licenses'),
    (p_user_id, 'other', 'Other')
  ON CONFLICT (user_id, slug) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;