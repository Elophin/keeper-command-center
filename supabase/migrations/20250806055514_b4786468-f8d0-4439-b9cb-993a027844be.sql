-- Fix the RLS policy for demo user profile creation
DROP POLICY IF EXISTS "Allow profile creation for demo users" ON public.profiles;

-- Create a more permissive policy for demo user setup
CREATE POLICY "Allow profile creation for demo users" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  -- Allow if no authenticated user (for demo setup)
  auth.uid() IS NULL 
  OR 
  -- Allow if authenticated user is creating their own profile
  auth.uid() = user_id
);