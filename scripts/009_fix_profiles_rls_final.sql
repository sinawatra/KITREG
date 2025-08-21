-- First, disable RLS temporarily to clean up
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles." ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.profiles;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
-- Policy 1: Allow users to read all profiles (for admin functionality, user listings, etc.)
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT 
    USING (true);

-- Policy 2: Allow authenticated users to insert their own profile
CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Policy 3: Allow users to update their own profile
CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy 4: Allow users to delete their own profile (optional)
CREATE POLICY "profiles_delete_policy" ON public.profiles
    FOR DELETE 
    USING (auth.uid() = id);

-- Verify the policies were created correctly
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';
