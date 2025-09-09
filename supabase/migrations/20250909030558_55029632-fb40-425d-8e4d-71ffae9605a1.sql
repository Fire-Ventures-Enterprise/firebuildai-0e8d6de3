-- Create notification_preferences table for both authenticated and anonymous users
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT,
  email_reminders BOOLEAN DEFAULT true,
  browser_notifications BOOLEAN DEFAULT false,
  sms_notifications BOOLEAN DEFAULT false,
  phone_number TEXT,
  source_page TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert preferences (for non-authenticated users)
CREATE POLICY "Anyone can create notification preferences"
ON public.notification_preferences
FOR INSERT
WITH CHECK (true);

-- Users can view their own preferences
CREATE POLICY "Users can view own preferences"
ON public.notification_preferences
FOR SELECT
USING (profile_id IN (SELECT id FROM profiles WHERE id = auth.uid()) OR profile_id IS NULL);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
ON public.notification_preferences
FOR UPDATE
USING (profile_id IN (SELECT id FROM profiles WHERE id = auth.uid()));

-- Add missing notification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notify_email BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_browser BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notify_sms BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_notification_preferences_profile_id 
ON public.notification_preferences(profile_id);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON public.notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION update_notification_preferences_updated_at();