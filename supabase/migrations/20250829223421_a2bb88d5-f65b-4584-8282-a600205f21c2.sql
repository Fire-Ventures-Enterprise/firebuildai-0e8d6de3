-- Create consultation_slots table for available time slots
CREATE TABLE public.consultation_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  is_available BOOLEAN DEFAULT true,
  max_bookings INTEGER DEFAULT 1,
  current_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create consultation_bookings table
CREATE TABLE public.consultation_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_id UUID REFERENCES public.consultation_slots(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  confirmation_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consultation_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;

-- Policies for consultation_slots
CREATE POLICY "Anyone can view available slots" 
ON public.consultation_slots 
FOR SELECT 
USING (is_available = true AND current_bookings < max_bookings);

CREATE POLICY "Admins can manage slots" 
ON public.consultation_slots 
FOR ALL 
USING (is_admin());

-- Policies for consultation_bookings
CREATE POLICY "Anyone can create bookings" 
ON public.consultation_bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view own bookings by email" 
ON public.consultation_bookings 
FOR SELECT 
USING (email = auth.email() OR is_admin());

CREATE POLICY "Admins can manage bookings" 
ON public.consultation_bookings 
FOR ALL 
USING (is_admin());

-- Function to update slot availability
CREATE OR REPLACE FUNCTION public.update_slot_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE public.consultation_slots 
    SET current_bookings = current_bookings + 1,
        is_available = CASE 
          WHEN current_bookings + 1 >= max_bookings THEN false 
          ELSE true 
        END
    WHERE id = NEW.slot_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
    UPDATE public.consultation_slots 
    SET current_bookings = GREATEST(0, current_bookings - 1),
        is_available = true
    WHERE id = NEW.slot_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating slot availability
CREATE TRIGGER update_slot_availability_trigger
AFTER INSERT OR UPDATE ON public.consultation_bookings
FOR EACH ROW EXECUTE FUNCTION public.update_slot_availability();

-- Insert some default available slots (next 14 days, weekdays only, 9am-5pm)
INSERT INTO public.consultation_slots (slot_date, slot_time, duration_minutes)
SELECT 
  date_series::date,
  ('09:00:00'::time + (hour_offset || ' hours')::interval)::time,
  30
FROM 
  generate_series(CURRENT_DATE + 1, CURRENT_DATE + 14, '1 day'::interval) AS date_series,
  generate_series(0, 7) AS hour_offset
WHERE 
  EXTRACT(DOW FROM date_series) NOT IN (0, 6); -- Exclude weekends

-- Create indexes
CREATE INDEX idx_consultation_slots_availability ON public.consultation_slots(slot_date, is_available);
CREATE INDEX idx_consultation_bookings_email ON public.consultation_bookings(email);
CREATE INDEX idx_consultation_bookings_status ON public.consultation_bookings(status);