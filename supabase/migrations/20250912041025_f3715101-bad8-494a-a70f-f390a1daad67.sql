-- Fix security issue: Restrict notification_preferences access to owner only
-- First, drop ALL existing policies to clean up
DROP POLICY IF EXISTS "Public can view notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Public can create notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can view own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can create own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can update own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can delete own notification preferences" ON public.notification_preferences;

-- Now create proper secure policies
-- Only authenticated users can view their own preferences
CREATE POLICY "Users can view own notification preferences" 
ON public.notification_preferences
FOR SELECT
USING (auth.uid() = user_id);

-- Only authenticated users can create their own preferences
CREATE POLICY "Users can create own notification preferences"
ON public.notification_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can update their own preferences
CREATE POLICY "Users can update own notification preferences"
ON public.notification_preferences
FOR UPDATE
USING (auth.uid() = user_id);

-- Only authenticated users can delete their own preferences
CREATE POLICY "Users can delete own notification preferences"
ON public.notification_preferences
FOR DELETE
USING (auth.uid() = user_id);