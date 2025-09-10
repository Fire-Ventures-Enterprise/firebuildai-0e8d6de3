-- Fix security issue: Restrict notification_preferences table access to owner only

-- Enable RLS on notification_preferences if not already enabled
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- First, drop any existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Public read access" ON notification_preferences;
DROP POLICY IF EXISTS "Allow public read" ON notification_preferences;
DROP POLICY IF EXISTS "Users can view own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can insert own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can update own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can delete own notification preferences" ON notification_preferences;

-- Create secure RLS policies that only allow users to manage their own preferences
-- Users can only view their own notification preferences
CREATE POLICY "Users can view own notification preferences"
ON notification_preferences
FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own notification preferences
CREATE POLICY "Users can insert own notification preferences"
ON notification_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own notification preferences
CREATE POLICY "Users can update own notification preferences"
ON notification_preferences
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own notification preferences
CREATE POLICY "Users can delete own notification preferences"
ON notification_preferences
FOR DELETE
USING (auth.uid() = user_id);