-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;

-- Create a new INSERT policy that allows both the trigger and users to insert
CREATE POLICY "Allow profile creation on signup" ON public.profiles
FOR INSERT
WITH CHECK (true);

-- Add a more secure UPDATE policy that ensures users can only update their own profile
DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());