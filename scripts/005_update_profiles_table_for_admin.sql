ALTER TABLE public.profiles
ADD COLUMN is_admin boolean DEFAULT FALSE NOT NULL;

-- Optional: Update existing profiles to be non-admin by default
UPDATE public.profiles SET is_admin = FALSE WHERE is_admin IS NULL;

-- Add RLS policy for is_admin column (optional, but good practice)
CREATE POLICY "Admins can view all profiles."
  ON public.profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
