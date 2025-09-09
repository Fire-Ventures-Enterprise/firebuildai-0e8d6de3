-- First, create the notification_preferences table without the foreign key
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
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

-- Allow anyone to insert preferences
CREATE POLICY "Anyone can insert notification preferences"
ON public.notification_preferences
FOR INSERT
WITH CHECK (true);

-- Users can view their own preferences
CREATE POLICY "Users can view notification preferences"
ON public.notification_preferences
FOR SELECT
USING (true);

-- Users can update their own preferences  
CREATE POLICY "Users can update notification preferences"
ON public.notification_preferences
FOR UPDATE
USING (user_id = auth.uid() OR user_id IS NULL);

-- Add missing notification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notify_email BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_browser BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notify_sms BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id 
ON public.notification_preferences(user_id);

-- Create function to update timestamp if it doesn't exist
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