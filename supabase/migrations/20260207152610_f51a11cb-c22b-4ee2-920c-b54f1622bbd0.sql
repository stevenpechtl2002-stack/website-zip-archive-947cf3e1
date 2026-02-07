-- Add admin role check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
      AND email = 'stevenpechtl2002@gmail.com'
  )
$$;

-- Allow admin to read all profiles
CREATE POLICY "Admin can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin());

-- Allow admin to read all API keys
CREATE POLICY "Admin can view all API keys" 
ON public.api_keys 
FOR SELECT 
USING (is_admin());