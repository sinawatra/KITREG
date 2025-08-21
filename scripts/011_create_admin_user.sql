-- Script to create or update a user to be an admin
-- Replace 'your-email@example.com' with the actual email you want to make admin

-- First, let's see what users exist in the system
SELECT 
    au.id,
    au.email,
    au.created_at,
    p.name,
    p.is_admin
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- Update a specific user to be admin (replace the email with your actual email)
-- IMPORTANT: Change 'your-email@example.com' to your actual email address
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'your-email@example.com'  -- CHANGE THIS EMAIL
);

-- If the profile doesn't exist yet, create it as admin
-- IMPORTANT: Change 'your-email@example.com' to your actual email address
INSERT INTO public.profiles (id, name, is_admin)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email),
    TRUE
FROM auth.users au
WHERE au.email = 'your-email@example.com'  -- CHANGE THIS EMAIL
AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
);

-- Verify the admin user was created/updated
SELECT 
    au.id,
    au.email,
    au.created_at,
    p.name,
    p.is_admin
FROM auth.users au
JOIN public.profiles p ON au.id = p.id
WHERE p.is_admin = TRUE;
