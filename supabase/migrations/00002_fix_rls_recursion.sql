-- ============================================================
-- Fix: Infinite recursion in profiles RLS policies
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Create a SECURITY DEFINER function to check admin status.
-- This bypasses RLS, breaking the infinite recursion loop.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Step 2: Drop the recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Step 3: Recreate them using the function (no more recursion)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_admin());

-- Step 4: Backfill profiles for users who registered before the table existed
INSERT INTO public.profiles (id, email, full_name, mobile, batch_start_year, passing_year, jnv_school, jnv_state, approval_status, role)
SELECT
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  coalesce(u.raw_user_meta_data->>'mobile', ''),
  coalesce((u.raw_user_meta_data->>'batch_start_year')::INTEGER, 0),
  coalesce((u.raw_user_meta_data->>'passing_year')::INTEGER, 0),
  coalesce(u.raw_user_meta_data->>'jnv_school', ''),
  coalesce(u.raw_user_meta_data->>'jnv_state', ''),
  'approved',
  'admin'
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ORDER BY u.created_at ASC
LIMIT 1;

-- Make the first user admin (in case they already had a profile row)
UPDATE public.profiles
SET approval_status = 'approved', role = 'admin'
WHERE id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1);
