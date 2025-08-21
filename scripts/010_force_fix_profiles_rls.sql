-- Force fix RLS policies by dropping ALL policies and recreating them
-- This script handles the case where policies already exist

-- First, disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Get all existing policies and drop them (this will work even if policy names vary)
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    -- Loop through all policies on the profiles table and drop them
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', policy_record.policyname);
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Now create the new policies (they shouldn't exist anymore)
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT 
    USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON public.profiles
    FOR DELETE 
    USING (auth.uid() = id);

-- Show the final policies
SELECT 
    policyname as "Policy Name",
    cmd as "Command",
    permissive as "Permissive",
    qual as "Using Clause",
    with_check as "With Check Clause"
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public'
ORDER BY policyname;

-- Show success message
SELECT 'RLS policies have been successfully reset!' as "Status";
