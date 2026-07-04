# Full database recreation for your own Supabase

Copy-paste the SQL below into your own Supabase project (SQL Editor, or a migration file in your IDE). It reproduces everything currently in this project's backend: 3 tables, 1 helper function, RLS policies, grants, and the `updated_at` trigger.

There is **no seed data** yet — `rooms`, `bookings`, and `blocked_dates` are all empty.

---

## 1. Schema (tables, function, RLS, grants, trigger)

```sql
-- =========================================================
-- Shared updated_at trigger function
-- =========================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================
-- rooms
-- =========================================================
CREATE TABLE public.rooms (
  id                uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  slug              text NOT NULL UNIQUE,
  description       text,
  base_price_cents  integer NOT NULL,
  max_guests        integer NOT NULL DEFAULT 2,
  is_active         boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.rooms TO anon, authenticated;
GRANT ALL    ON public.rooms TO service_role;

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rooms are publicly viewable when active"
  ON public.rooms FOR SELECT
  USING (is_active = true);

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- bookings
-- =========================================================
CREATE TABLE public.bookings (
  id                 uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  room_id            uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  guest_name         text NOT NULL,
  guest_email        text NOT NULL,
  guest_phone        text,
  guest_postcode     text,
  guests             integer NOT NULL,
  check_in           date NOT NULL,
  check_out          date NOT NULL,
  total_price_cents  integer NOT NULL,
  status             text NOT NULL DEFAULT 'pending',  -- pending | confirmed | cancelled
  stripe_session_id  text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT ALL    ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Guests can create a pending booking; reading/updating is server-side only.
CREATE POLICY "Anyone can create a pending booking"
  ON public.bookings FOR INSERT
  WITH CHECK (status = 'pending');

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- blocked_dates (owner-blocked ranges, e.g. maintenance)
-- =========================================================
CREATE TABLE public.blocked_dates (
  id          uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  room_id     uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  start_date  date NOT NULL,
  end_date    date NOT NULL,
  reason      text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blocked_dates TO anon, authenticated;
GRANT ALL    ON public.blocked_dates TO service_role;

ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blocked dates are publicly viewable"
  ON public.blocked_dates FOR SELECT
  USING (true);

-- =========================================================
-- Availability helper (used by the booking form)
-- =========================================================
CREATE OR REPLACE FUNCTION public.check_room_availability(
  _room_id   uuid,
  _check_in  date,
  _check_out date
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE room_id = _room_id
      AND status IN ('pending','confirmed')
      AND check_in  < _check_out
      AND check_out > _check_in
  ) AND NOT EXISTS (
    SELECT 1 FROM public.blocked_dates
    WHERE room_id = _room_id
      AND start_date < _check_out
      AND end_date   > _check_in
  );
$$;

GRANT EXECUTE ON FUNCTION public.check_room_availability(uuid, date, date)
  TO anon, authenticated;
```

---

## 2. Data

The tables are empty in this project. Nothing to migrate.

If you want a starter row for testing, use:

```sql
INSERT INTO public.rooms (name, slug, description, base_price_cents, max_guests)
VALUES ('Main Suite', 'main-suite', 'Sample homestay room', 15000, 2);
```

---

## 3. Auth / storage / edge functions

- **Auth:** no custom tables, no custom triggers on `auth.users`. Just enable Email (and Google if you want) in your Supabase Auth settings — matches what the admin login uses.
- **Storage:** one bucket exists in this project, `database_export_03_07_26` (private), used only for a past export. You don't need to recreate it.
- **Edge functions:** none.
- **Secrets:** none you need to copy — the only secret used by app code would be a future `STRIPE_SECRET_KEY`, which you'd add yourself when wiring Stripe.

---

## 4. Client wiring in your new project

In your own repo, set these env vars to point at your Supabase project:

```
VITE_SUPABASE_URL=https://ryehsfrmpcbdaojyprxm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ZY8jbo13QWzgZTmkP80USA_zfzOTvFF
```

Then `@supabase/supabase-js`'s generated types will match the schema above — the `Database` type in `src/integrations/supabase/types.ts` in this project is already accurate and can be copied verbatim.

---

Shall I confirm this is everything you need, or do you also want a ready-to-run seed file with a few sample rooms and blocked dates?