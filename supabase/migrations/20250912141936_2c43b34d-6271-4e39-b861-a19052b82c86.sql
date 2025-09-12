-- Add INSERT policy for profiles table to allow the trigger to create profiles on signup
CREATE POLICY "insert_own_profile" ON public.profiles
FOR INSERT
WITH CHECK (id = auth.uid());