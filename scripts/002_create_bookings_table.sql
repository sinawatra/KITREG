CREATE TABLE public.bookings (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  workshop_id integer NOT NULL,
  booked_at timestamp with time zone DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings."
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings."
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
