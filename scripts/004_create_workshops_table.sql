CREATE TABLE public.workshops (
  id SERIAL PRIMARY KEY,
  title text NOT NULL,
  status text DEFAULT 'Open Application' NOT NULL,
  image text,
  location text,
  date date,
  type text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workshops are viewable by everyone."
  ON public.workshops FOR SELECT
  USING (true);

CREATE POLICY "Admins can create workshops."
  ON public.workshops FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admins can update workshops."
  ON public.workshops FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admins can delete workshops."
  ON public.workshops FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
