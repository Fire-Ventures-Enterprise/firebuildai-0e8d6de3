-- Create notification_preferences table for storing user preferences
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  email_reminders BOOLEAN DEFAULT true,
  browser_notifications BOOLEAN DEFAULT false,
  sms_notifications BOOLEAN DEFAULT false,
  source_page TEXT DEFAULT 'homepage',
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to insert preferences (for marketing purposes)
CREATE POLICY "Anyone can submit notification preferences" 
ON public.notification_preferences 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admins to view preferences
CREATE POLICY "Admins can view notification preferences" 
ON public.notification_preferences 
FOR SELECT 
USING (is_admin());

-- Create index for performance
CREATE INDEX idx_notification_preferences_email ON public.notification_preferences(email);
CREATE INDEX idx_notification_preferences_created_at ON public.notification_preferences(created_at);