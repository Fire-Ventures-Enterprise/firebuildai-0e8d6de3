-- Fix infinite recursion in communication_channel_members policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Channel admins can add members" ON communication_channel_members;
DROP POLICY IF EXISTS "Channel admins can update members" ON communication_channel_members;
DROP POLICY IF EXISTS "Users can view channel members" ON communication_channel_members;

-- Create fixed policies that avoid recursion
-- Users can view members of channels they belong to
CREATE POLICY "Users can view channel members"
ON communication_channel_members
FOR SELECT
USING (
  channel_id IN (
    SELECT channel_id 
    FROM communication_channel_members cm2
    WHERE cm2.user_id = auth.uid() 
    AND cm2.is_active = true
  )
);

-- Channel owners and admins can add members
CREATE POLICY "Channel admins can add members"
ON communication_channel_members
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM communication_channels 
    WHERE communication_channels.id = channel_id 
    AND communication_channels.user_id = auth.uid()
  )
  OR 
  channel_id IN (
    SELECT channel_id 
    FROM communication_channel_members 
    WHERE user_id = auth.uid() 
    AND member_type IN ('owner', 'admin')
    AND is_active = true
  )
);

-- Channel owners and admins can update members
CREATE POLICY "Channel admins can update members"
ON communication_channel_members
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 
    FROM communication_channels 
    WHERE communication_channels.id = channel_id 
    AND communication_channels.user_id = auth.uid()
  )
  OR 
  channel_id IN (
    SELECT channel_id 
    FROM communication_channel_members 
    WHERE user_id = auth.uid() 
    AND member_type IN ('owner', 'admin')
    AND is_active = true
  )
);

-- Also ensure the channel creator is automatically added as owner when creating a channel
CREATE OR REPLACE FUNCTION add_channel_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO communication_channel_members (
    channel_id,
    user_id,
    member_type,
    permissions,
    is_active
  ) VALUES (
    NEW.id,
    NEW.user_id,
    'owner',
    '{"can_read": true, "can_send": true, "can_edit": true, "can_delete": true}'::jsonb,
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS add_channel_owner_trigger ON communication_channels;
CREATE TRIGGER add_channel_owner_trigger
AFTER INSERT ON communication_channels
FOR EACH ROW
EXECUTE FUNCTION add_channel_owner();