-- Fix security issue: Restrict notification_preferences access to owner only
-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Public can view notification preferences" ON public.notification_preferences;

-- Create new policy that only allows users to view their own preferences
CREATE POLICY "Users can view own notification preferences" 
ON public.notification_preferences
FOR SELECT
USING (auth.uid() = user_id);

-- Update INSERT policy to ensure users can only create their own preferences
DROP POLICY IF EXISTS "Public can create notification preferences" ON public.notification_preferences;

CREATE POLICY "Users can create own notification preferences"
ON public.notification_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add UPDATE policy for users to update their own preferences
CREATE POLICY "Users can update own notification preferences"
ON public.notification_preferences
FOR UPDATE
USING (auth.uid() = user_id);

-- Add DELETE policy for users to delete their own preferences
CREATE POLICY "Users can delete own notification preferences"
ON public.notification_preferences
FOR DELETE
USING (auth.uid() = user_id);