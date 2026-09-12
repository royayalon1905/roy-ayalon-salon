-- ============================================================================
-- ROYA 2.0 — migration 002: mt_staff_public_read_scoped
-- הוחל בפרודקשן ב-11.9.2026 (project facehdfqvppxnmdtpzuo, version 20260911160746).
-- קובץ זה נוסף לתיקייה המקומית ב-12.9.2026 (משימת "סנכרון SQL") — לא היה קיים לפני כן.
-- ============================================================================

-- D28 fix: mt_staff had RLS enabled but zero anon policy/grant at all,
-- so the public-facing site (anon key) got a hard failure reading staff.
-- Fix: anon can read only active staff, and only safe columns
-- (id, client_id, name, active, role) — phone, sees_all, hours_override
-- stay restricted to authenticated owner/manager (existing policies untouched).
-- Approved by Roy 11.9.2026 (Cowork session), per project rule: new anon policy
-- always paired with a column-scoped GRANT in the same migration.

create policy mt_staff_public_read
  on public.mt_staff
  for select
  to anon
  using (active = true);

grant select (id, client_id, name, active, role) on public.mt_staff to anon;
