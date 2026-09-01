/*
# Create plants table (single-tenant, no auth)

## Summary
Creates the `plants` table to store registered plants for the PlantCare AI app.
This is a single-tenant app with no sign-in screen, so all data is intentionally
shared and accessible via the anon key.

## New Tables
- `plants`
  - `id` (uuid, primary key)
  - `name` (text, not null) — the plant's given name
  - `species` (text, not null) — the plant's species
  - `last_watered` (date, not null) — date of last watering
  - `watering_frequency_days` (integer, default 7) — how often the plant needs watering
  - `notes` (text, nullable) — optional notes about the plant
  - `created_at` (timestamptz, default now())

## Security
- Enable RLS on `plants`.
- Allow anon + authenticated full CRUD because the data is intentionally shared/public
  in this single-tenant app with no user accounts.

## Notes
1. The watering frequency lets the dashboard calculate whether a plant needs water
   by comparing `last_watered` + `watering_frequency_days` against today's date.
2. Policies use `USING (true)` / `WITH CHECK (true)` because there is no ownership
   concept — the app has no sign-in screen and all data is shared.
*/

CREATE TABLE IF NOT EXISTS plants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text NOT NULL,
  last_watered date NOT NULL,
  watering_frequency_days integer NOT NULL DEFAULT 7,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE plants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_plants" ON plants;
CREATE POLICY "anon_select_plants" ON plants FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_plants" ON plants;
CREATE POLICY "anon_insert_plants" ON plants FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_plants" ON plants;
CREATE POLICY "anon_update_plants" ON plants FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_plants" ON plants;
CREATE POLICY "anon_delete_plants" ON plants FOR DELETE
  TO anon, authenticated USING (true);
