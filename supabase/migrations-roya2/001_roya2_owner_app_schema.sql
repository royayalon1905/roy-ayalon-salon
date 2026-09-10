-- ============================================================================
-- ROYA 2.0 — migration 001: אפליקציית הבעלים (roya-owner-app)
-- סטטוס: ממתין להחלה. לא הוחל על prod ולא על branch (D3: branch עולה כסף, אסור לאשר).
-- להחלה: apply_migration(name='roya2_owner_app_schema') על branch, ואחרי בדיקה על prod.
-- כללי הפרויקט: mt_ לכל טבלה, RLS דלוק, policy↔GRANT באותה פעימה, RPC עם search_path, REVOKE FROM PUBLIC.
-- ============================================================================

-- ---------- 1. משתמשי האפליקציה (1.2) ----------
create table if not exists public.mt_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  client_id uuid not null references public.mt_clients(id) on delete cascade,
  staff_id uuid references public.mt_staff(id) on delete set null,
  role text not null default 'staff' check (role in ('owner','manager','staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
comment on table public.mt_users is 'שיוך משתמש Supabase Auth ללקוח (עסק) ולאיש צוות. owner/manager רואים הכול, staff רואה רק את שלו.';
create index if not exists mt_users_client_idx on public.mt_users(client_id);
alter table public.mt_users enable row level security;

-- הזמנות לצוות (1.10/3.3): קישור חד-פעמי שרועי/הבעלים שולח בוואטסאפ; בכניסה ראשונה במייל, הטריגר משייך.
create table if not exists public.mt_staff_invites (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.mt_clients(id) on delete cascade,
  staff_id uuid not null references public.mt_staff(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(18), 'hex'),
  email text,
  used_by uuid references auth.users(id),
  used_at timestamptz,
  expires_at timestamptz not null default now() + interval '14 days',
  created_at timestamptz not null default now()
);
alter table public.mt_staff_invites enable row level security;

-- ---------- 2. פונקציות הקשר (מי המשתמש הנוכחי) ----------
create or replace function public.mt_current_client_id()
returns uuid language sql stable security definer set search_path = public as $$
  select client_id from public.mt_users where user_id = auth.uid() and active
$$;
create or replace function public.mt_current_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.mt_users where user_id = auth.uid() and active
$$;
create or replace function public.mt_current_staff_id()
returns uuid language sql stable security definer set search_path = public as $$
  select staff_id from public.mt_users where user_id = auth.uid() and active
$$;
create or replace function public.mt_current_staff_name()
returns text language sql stable security definer set search_path = public as $$
  select s.name from public.mt_users u join public.mt_staff s on s.id = u.staff_id where u.user_id = auth.uid() and u.active
$$;
-- האם המשתמש רואה הכול (בעלים/מנהל, או איש צוות עם sees_all)
create or replace function public.mt_sees_all()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select u.role in ('owner','manager') or coalesce(s.sees_all,false)
                   from public.mt_users u left join public.mt_staff s on s.id = u.staff_id
                   where u.user_id = auth.uid() and u.active), false)
$$;
revoke execute on function public.mt_current_client_id() from public, anon;
revoke execute on function public.mt_current_role() from public, anon;
revoke execute on function public.mt_current_staff_id() from public, anon;
revoke execute on function public.mt_current_staff_name() from public, anon;
revoke execute on function public.mt_sees_all() from public, anon;
grant execute on function public.mt_current_client_id(), public.mt_current_role(), public.mt_current_staff_id(), public.mt_current_staff_name(), public.mt_sees_all() to authenticated;

-- קבלת הזמנה: המשתמש המחובר מצרף את עצמו ל-mt_users לפי token (RPC, לא כתיבה ישירה)
create or replace function public.mt_accept_staff_invite(p_token text)
returns public.mt_users language plpgsql security definer set search_path = public as $$
declare v_inv public.mt_staff_invites; v_row public.mt_users;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select * into v_inv from public.mt_staff_invites where token = p_token and used_at is null and expires_at > now();
  if v_inv.id is null then raise exception 'invalid or expired invite'; end if;
  insert into public.mt_users(user_id, client_id, staff_id, role, active)
  values (auth.uid(), v_inv.client_id, v_inv.staff_id, 'staff', true)
  on conflict (user_id) do update set client_id = excluded.client_id, staff_id = excluded.staff_id, active = true
  returning * into v_row;
  update public.mt_staff_invites set used_by = auth.uid(), used_at = now() where id = v_inv.id;
  return v_row;
end $$;
revoke execute on function public.mt_accept_staff_invite(text) from public, anon;
grant execute on function public.mt_accept_staff_invite(text) to authenticated;

-- ---------- 3. הרחבת טבלאות קיימות ----------
alter table public.mt_clients add column if not exists custom_domain text;
comment on column public.mt_clients.custom_domain is 'N-4: דומיין מותאם של העסק (host בלבד). ה-build של האתר קורא אותו ל-canonical/OG.';

alter table public.mt_staff
  add column if not exists phone text,
  add column if not exists role text not null default 'staff' check (role in ('owner','manager','staff')),
  add column if not exists sees_all boolean not null default false,
  add column if not exists hours_override jsonb;

alter table public.mt_services add column if not exists visible_on_site boolean not null default true;
comment on column public.mt_services.visible_on_site is 'מתג מוצג/מוסתר באתר (מסך המחירון). האתר מסנן לפי זה.';

alter table public.mt_end_customers
  add column if not exists notes text,
  add column if not exists birthdate date,
  add column if not exists blocked boolean,
  add column if not exists block_override boolean not null default false,
  add column if not exists custom_fields jsonb not null default '{}'::jsonb,
  add column if not exists referred_by uuid references public.mt_end_customers(id),
  add column if not exists referral_code text,
  add column if not exists loyalty_reset_at timestamptz,
  add column if not exists loyalty_reward_pending text,
  add column if not exists last_birthday_sent_at timestamptz;
create unique index if not exists mt_end_customers_referral_code_idx on public.mt_end_customers(client_id, referral_code) where referral_code is not null;

alter table public.mt_appointments
  add column if not exists duration_minutes integer,
  add column if not exists staff_id uuid references public.mt_staff(id),
  add column if not exists service_id uuid references public.mt_services(id),
  add column if not exists recurring_id uuid,
  add column if not exists notes text,
  add column if not exists morning_reminder_sent_at timestamptz;
comment on column public.mt_appointments.morning_reminder_sent_at is 'N-1: תזכורת הבוקר (batch 09:00). נפרד מ-reminder_sent_at (T-24h).';

-- 2.3: הרשמה עצמית לרשימת המתנה בלי תור קיים
alter table public.mt_waitlist alter column original_appointment_id drop not null;
alter table public.mt_waitlist add column if not exists desired_date date;
alter table public.mt_waitlist add column if not exists source text not null default 'cancel_flow';
comment on column public.mt_waitlist.source is 'cancel_flow = נרשם אחרי ביטול (הקיים); self = הרשמה עצמית מהאתר (2.3); manual = הצעה ידנית מהיומן.';

-- ---------- 4. טבלאות חדשות ----------
-- N-3 מחירון לכל איש צוות
create table if not exists public.mt_staff_service_prices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.mt_clients(id) on delete cascade,
  staff_id uuid not null references public.mt_staff(id) on delete cascade,
  service_id uuid not null references public.mt_services(id) on delete cascade,
  price numeric not null,
  duration_minutes integer,
  unique (staff_id, service_id)
);
alter table public.mt_staff_service_prices enable row level security;

-- 4.1 תשלומים (מינימלי): רישום ידני + יתרה פתוחה
create table if not exists public.mt_payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.mt_clients(id) on delete cascade,
  appointment_id uuid references public.mt_appointments(id) on delete set null,
  end_customer_id uuid references public.mt_end_customers(id) on delete set null,
  amount numeric not null check (amount > 0),
  method text not null default 'cash' check (method in ('cash','bit','card','link','other')),
  note text,
  paid_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);
create index if not exists mt_payments_appt_idx on public.mt_payments(appointment_id);
alter table public.mt_payments enable row level security;

-- N-8 תור קבוע
create table if not exists public.mt_recurring_rules (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.mt_clients(id) on delete cascade,
  end_customer_id uuid not null references public.mt_end_customers(id) on delete cascade,
  service_id uuid references public.mt_services(id),
  staff_id uuid references public.mt_staff(id),
  time_of_day time not null,
  every_weeks integer not null default 1 check (every_weeks between 1 and 12),
  until_date date,
  last_generated_date date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.mt_recurring_rules enable row level security;
alter table public.mt_appointments add constraint mt_appointments_recurring_fk foreign key (recurring_id) references public.mt_recurring_rules(id) on delete set null;

-- N-6 הפניות
create table if not exists public.mt_referrals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.mt_clients(id) on delete cascade,
  referrer_id uuid not null references public.mt_end_customers(id) on delete cascade,
  referred_id uuid not null references public.mt_end_customers(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','rewarded','cancelled')),
  rewarded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (referred_id)
);
alter table public.mt_referrals enable row level security;

-- 5.1 טפסים
create table if not exists public.mt_forms (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.mt_clients(id) on delete cascade,
  name text not null,
  fields jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.mt_form_responses (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.mt_clients(id) on delete cascade,
  form_id uuid not null references public.mt_forms(id) on delete cascade,
  end_customer_id uuid references public.mt_end_customers(id) on delete set null,
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now()
);
alter table public.mt_forms enable row level security;
alter table public.mt_form_responses enable row level security;

-- 2.6 / 2.7 קמפיינים + הודעות מתוזמנות
create table if not exists public.mt_campaigns (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.mt_clients(id) on delete cascade,
  audience text not null check (audience in ('all','service','lost','loyal')),
  service text,
  message text not null,
  scheduled_at timestamptz,
  status text not null default 'queued' check (status in ('queued','scheduled','sending','sent','cancelled')),
  recipient_ids uuid[] not null default '{}',
  sent_count integer not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
alter table public.mt_campaigns enable row level security;

-- יומן הודעות (outbox): כל בקשת שליחה מהאפליקציה. n8n (service_role) מעדכן status/wamid.
create table if not exists public.mt_message_log (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.mt_clients(id) on delete cascade,
  to_phone text not null,
  event_type text not null,
  message_kind text not null default 'template',
  params jsonb not null default '[]'::jsonb,
  text_body text,
  buttons jsonb,
  ref_type text,
  ref_id text,
  status text not null default 'queued' check (status in ('queued','sent','failed','skipped')),
  wamid text,
  error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
create index if not exists mt_message_log_client_status_idx on public.mt_message_log(client_id, status, created_at desc);
alter table public.mt_message_log enable row level security;

-- ---------- 5. RLS policies + GRANT (באותה פעימה, לפי הכלל) ----------
-- mt_users: כל אחד רואה את השורה שלו; בעלים רואה את כל הצוות של העסק
create policy mt_users_select on public.mt_users for select to authenticated
  using (user_id = auth.uid() or (client_id = public.mt_current_client_id() and public.mt_current_role() = 'owner'));
create policy mt_users_owner_update on public.mt_users for update to authenticated
  using (client_id = public.mt_current_client_id() and public.mt_current_role() = 'owner')
  with check (client_id = public.mt_current_client_id() and role <> 'owner');
grant select (user_id, client_id, staff_id, role, active, created_at) on public.mt_users to authenticated;
grant update (staff_id, role, active) on public.mt_users to authenticated;

create policy mt_staff_invites_owner on public.mt_staff_invites for all to authenticated
  using (client_id = public.mt_current_client_id() and public.mt_current_role() in ('owner','manager'))
  with check (client_id = public.mt_current_client_id() and public.mt_current_role() in ('owner','manager'));
grant select (id, client_id, staff_id, token, email, used_at, expires_at, created_at), insert (client_id, staff_id, email), delete on public.mt_staff_invites to authenticated;

-- mt_clients: קריאה של העסק שלי בלבד, בלי integration_config (טוקנים). עדכון settings/custom_domain רק לבעלים.
create policy mt_clients_select_own on public.mt_clients for select to authenticated using (id = public.mt_current_client_id());
create policy mt_clients_owner_update on public.mt_clients for update to authenticated
  using (id = public.mt_current_client_id() and public.mt_current_role() = 'owner')
  with check (id = public.mt_current_client_id());
grant select (id, business_name, slug, timezone, tier, status, settings, owner_name, owner_phone, owner_email, custom_domain, allowed_origin, created_at) on public.mt_clients to authenticated;
grant update (settings, custom_domain, owner_name, owner_phone, owner_email) on public.mt_clients to authenticated;
-- מפתחות ציבוריים ב-integration_config (קישור ביקורת, יומן גוגל) — דרך RPC עם whitelist, לא גישה ישירה
create or replace function public.mt_set_public_integration(p_key text, p_value text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.mt_current_role() <> 'owner' then raise exception 'owner only'; end if;
  if p_key not in ('google_review_link','google_calendar_id') then raise exception 'key not allowed'; end if;
  update public.mt_clients set integration_config = coalesce(integration_config,'{}'::jsonb) || jsonb_build_object(p_key, p_value)
  where id = public.mt_current_client_id();
end $$;
create or replace function public.mt_get_public_integration()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'google_review_link', integration_config->>'google_review_link',
    'google_calendar_id', integration_config->>'google_calendar_id',
    'google_calendar_connected', (integration_config ? 'google_calendar_credential'),
    'meta_connected', (integration_config ? 'meta_phone_number_id'))
  from public.mt_clients where id = public.mt_current_client_id()
$$;
revoke execute on function public.mt_set_public_integration(text, text) from public, anon;
revoke execute on function public.mt_get_public_integration() from public, anon;
grant execute on function public.mt_set_public_integration(text, text), public.mt_get_public_integration() to authenticated;

-- mt_staff
create policy mt_staff_select on public.mt_staff for select to authenticated using (client_id = public.mt_current_client_id());
create policy mt_staff_owner_write on public.mt_staff for all to authenticated
  using (client_id = public.mt_current_client_id() and public.mt_current_role() in ('owner','manager'))
  with check (client_id = public.mt_current_client_id() and public.mt_current_role() in ('owner','manager'));
grant select (id, client_id, name, active, created_at, phone, role, sees_all, hours_override) on public.mt_staff to authenticated;
grant insert (client_id, name, active, phone, role, sees_all, hours_override), update (name, active, phone, role, sees_all, hours_override) on public.mt_staff to authenticated;

-- mt_services
create policy mt_services_select on public.mt_services for select to authenticated using (client_id = public.mt_current_client_id());
create policy mt_services_owner_write on public.mt_services for all to authenticated
  using (client_id = public.mt_current_client_id() and public.mt_current_role() in ('owner','manager'))
  with check (client_id = public.mt_current_client_id() and public.mt_current_role() in ('owner','manager'));
grant select (id, client_id, name, price, duration_minutes, active, created_at, visible_on_site) on public.mt_services to authenticated;
grant insert (client_id, name, price, duration_minutes, active, visible_on_site), update (name, price, duration_minutes, active, visible_on_site) on public.mt_services to authenticated;
-- האתר (anon) קורא רק שירותים גלויים ופעילים
create policy mt_services_public_read on public.mt_services for select to anon using (active and visible_on_site);
grant select (id, client_id, name, price, duration_minutes) on public.mt_services to anon;

create policy mt_ssp_select on public.mt_staff_service_prices for select to authenticated using (client_id = public.mt_current_client_id());
create policy mt_ssp_owner_write on public.mt_staff_service_prices for all to authenticated
  using (client_id = public.mt_current_client_id() and public.mt_current_role() in ('owner','manager'))
  with check (client_id = public.mt_current_client_id() and public.mt_current_role() in ('owner','manager'));
grant select, insert (client_id, staff_id, service_id, price, duration_minutes), update (price, duration_minutes), delete on public.mt_staff_service_prices to authenticated;
create policy mt_ssp_public_read on public.mt_staff_service_prices for select to anon using (true);
grant select (client_id, staff_id, service_id, price, duration_minutes) on public.mt_staff_service_prices to anon;

-- mt_end_customers: איש צוות רגיל רואה רק לקוחות שיש להם תור אצלו
create policy mt_customers_select on public.mt_end_customers for select to authenticated
  using (client_id = public.mt_current_client_id() and (public.mt_sees_all() or exists (
    select 1 from public.mt_appointments a where a.end_customer_id = mt_end_customers.id and a.staff_id = public.mt_current_staff_id())));
create policy mt_customers_write on public.mt_end_customers for insert to authenticated with check (client_id = public.mt_current_client_id());
create policy mt_customers_update on public.mt_end_customers for update to authenticated
  using (client_id = public.mt_current_client_id()) with check (client_id = public.mt_current_client_id());
grant select (id, client_id, phone, name, visit_count, no_show_count, last_visit_at, last_no_show_at, loyalty_points, marketing_consent, created_at, requires_deposit, loyalty_enabled, notes, birthdate, blocked, block_override, custom_fields, referred_by, referral_code, loyalty_reset_at, loyalty_reward_pending) on public.mt_end_customers to authenticated;
grant insert (client_id, phone, name, marketing_consent, notes, birthdate, custom_fields, referred_by, referral_code), update (name, marketing_consent, notes, birthdate, blocked, block_override, custom_fields, loyalty_enabled, loyalty_reset_at, loyalty_reward_pending) on public.mt_end_customers to authenticated;

-- mt_appointments: staff רואה רק את שלו
create policy mt_appts_select on public.mt_appointments for select to authenticated
  using (client_id = public.mt_current_client_id() and (public.mt_sees_all() or staff_id = public.mt_current_staff_id() or staff_member = public.mt_current_staff_name()));
create policy mt_appts_insert on public.mt_appointments for insert to authenticated with check (client_id = public.mt_current_client_id());
create policy mt_appts_update on public.mt_appointments for update to authenticated
  using (client_id = public.mt_current_client_id() and (public.mt_sees_all() or staff_id = public.mt_current_staff_id() or staff_member = public.mt_current_staff_name()))
  with check (client_id = public.mt_current_client_id());
grant select (id, client_id, end_customer_id, appointment_code, scheduled_at, service, staff_member, customer_name, customer_phone, status, reminder_sent_at, source, cancelled_reason, created_at, updated_at, review_requested_at, price, reminder_stage, last_reminder_at, confirmed_at, duration_minutes, staff_id, service_id, recurring_id, notes, morning_reminder_sent_at) on public.mt_appointments to authenticated;
grant insert (client_id, end_customer_id, appointment_code, scheduled_at, service, staff_member, customer_name, customer_phone, status, source, price, duration_minutes, staff_id, service_id, recurring_id, notes), update (scheduled_at, service, staff_member, status, cancelled_reason, updated_at, price, duration_minutes, staff_id, service_id, notes, confirmed_at, reminder_sent_at) on public.mt_appointments to authenticated;

-- mt_blocked_slots / mt_waitlist / החדשות: לפי client_id
create policy mt_blocks_all on public.mt_blocked_slots for all to authenticated using (client_id = public.mt_current_client_id()) with check (client_id = public.mt_current_client_id());
grant select, insert (client_id, staff_member, start_at, end_at, reason), delete on public.mt_blocked_slots to authenticated;

create policy mt_waitlist_all on public.mt_waitlist for all to authenticated using (client_id = public.mt_current_client_id()) with check (client_id = public.mt_current_client_id());
grant select, insert (client_id, end_customer_id, desired_service, desired_staff_member, desired_scheduled_at, position, status, desired_date, source), update (status, offered_at, offer_expires_at, responded_at, updated_at) on public.mt_waitlist to authenticated;

create policy mt_payments_all on public.mt_payments for all to authenticated using (client_id = public.mt_current_client_id()) with check (client_id = public.mt_current_client_id());
grant select, insert (client_id, appointment_id, end_customer_id, amount, method, note, paid_at, created_by), delete on public.mt_payments to authenticated;

create policy mt_recurring_all on public.mt_recurring_rules for all to authenticated using (client_id = public.mt_current_client_id()) with check (client_id = public.mt_current_client_id());
grant select, insert (client_id, end_customer_id, service_id, staff_id, time_of_day, every_weeks, until_date, last_generated_date, active), update (until_date, active, last_generated_date) on public.mt_recurring_rules to authenticated;

create policy mt_referrals_all on public.mt_referrals for all to authenticated using (client_id = public.mt_current_client_id()) with check (client_id = public.mt_current_client_id());
grant select, insert (client_id, referrer_id, referred_id, status, rewarded_at), update (status, rewarded_at) on public.mt_referrals to authenticated;

create policy mt_forms_all on public.mt_forms for all to authenticated using (client_id = public.mt_current_client_id()) with check (client_id = public.mt_current_client_id());
grant select, insert (client_id, name, fields, active), update (name, fields, active) on public.mt_forms to authenticated;
create policy mt_form_responses_select on public.mt_form_responses for select to authenticated using (client_id = public.mt_current_client_id());
grant select on public.mt_form_responses to authenticated;
-- הלקוח ממלא טופס מהאתר (anon) דרך RPC בלבד
create or replace function public.mt_submit_form_response(p_form_id uuid, p_customer_id uuid, p_answers jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_client uuid; v_id uuid;
begin
  select client_id into v_client from public.mt_forms where id = p_form_id and active;
  if v_client is null then raise exception 'form not found'; end if;
  if jsonb_typeof(p_answers) <> 'object' or length(p_answers::text) > 8000 then raise exception 'bad answers'; end if;
  insert into public.mt_form_responses(client_id, form_id, end_customer_id, answers) values (v_client, p_form_id, p_customer_id, p_answers) returning id into v_id;
  return v_id;
end $$;
revoke execute on function public.mt_submit_form_response(uuid, uuid, jsonb) from public, authenticated;
grant execute on function public.mt_submit_form_response(uuid, uuid, jsonb) to anon;
create policy mt_forms_public_read on public.mt_forms for select to anon using (active);
grant select (id, client_id, name, fields) on public.mt_forms to anon;

create policy mt_campaigns_all on public.mt_campaigns for all to authenticated
  using (client_id = public.mt_current_client_id() and public.mt_current_role() in ('owner','manager'))
  with check (client_id = public.mt_current_client_id() and public.mt_current_role() in ('owner','manager'));
grant select, insert (client_id, audience, service, message, scheduled_at, status, recipient_ids, created_by), update (status, scheduled_at) on public.mt_campaigns to authenticated;

create policy mt_message_log_select on public.mt_message_log for select to authenticated using (client_id = public.mt_current_client_id());
create policy mt_message_log_insert on public.mt_message_log for insert to authenticated with check (client_id = public.mt_current_client_id());
grant select, insert (client_id, to_phone, event_type, message_kind, params, text_body, buttons, ref_type, ref_id) on public.mt_message_log to authenticated;

-- ---------- 6. טריגרים ----------
-- 4.1: כשתור מסומן no_show ידנית מהאפליקציה — mt_handle_no_show הקיים כבר מעדכן no_show_count.
-- N-6: קוד הפניה אוטומטי לכל לקוח חדש
create or replace function public.mt_set_referral_code()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.referral_code is null then
    new.referral_code := 'R' || upper(substr(replace(new.id::text,'-',''), 1, 5));
  end if;
  return new;
end $$;
drop trigger if exists mt_end_customers_referral_code on public.mt_end_customers;
create trigger mt_end_customers_referral_code before insert on public.mt_end_customers for each row execute function public.mt_set_referral_code();
update public.mt_end_customers set referral_code = 'R' || upper(substr(replace(id::text,'-',''), 1, 5)) where referral_code is null;

-- N-6: כשתור ראשון של מופנה מושלם → רשומת הפניה rewarded (השליחה ב-n8n לפי status='rewarded' and notified_at is null)
alter table public.mt_referrals add column if not exists notified_at timestamptz;
create or replace function public.mt_handle_referral_reward()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_ref uuid;
begin
  if new.status = 'completed' and old.status is distinct from 'completed' and new.end_customer_id is not null then
    select referred_by into v_ref from public.mt_end_customers where id = new.end_customer_id;
    if v_ref is not null and not exists (select 1 from public.mt_referrals where referred_id = new.end_customer_id) then
      insert into public.mt_referrals(client_id, referrer_id, referred_id, status, rewarded_at) values (new.client_id, v_ref, new.end_customer_id, 'rewarded', now());
    end if;
  end if;
  return new;
end $$;
drop trigger if exists mt_appointments_referral_reward on public.mt_appointments;
create trigger mt_appointments_referral_reward after update on public.mt_appointments for each row execute function public.mt_handle_referral_reward();

-- N-5: נאמנות לפי ספירת תורים (לצד loyalty_points הקיים). כשמגיעים ל-settings.loyalty.target → loyalty_reward_pending + איפוס. n8n שולח לפי loyalty_reward_pending is not null and loyalty_reward_notified_at < loyalty_reset_at.
create or replace function public.mt_handle_loyalty_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_settings jsonb; v_target int; v_done int; v_since timestamptz;
begin
  if new.status = 'completed' and old.status is distinct from 'completed' and new.end_customer_id is not null then
    select settings into v_settings from public.mt_clients where id = new.client_id;
    if coalesce((v_settings->'loyalty'->>'enabled')::boolean, false) then
      v_target := coalesce((v_settings->'loyalty'->>'target')::int, 10);
      select loyalty_reset_at into v_since from public.mt_end_customers where id = new.end_customer_id;
      select count(*) into v_done from public.mt_appointments where end_customer_id = new.end_customer_id and status = 'completed' and scheduled_at > coalesce(v_since, '1970-01-01'::timestamptz);
      if v_done >= v_target then
        update public.mt_end_customers set loyalty_reset_at = now(), loyalty_reward_pending = coalesce(v_settings->'loyalty'->>'reward_text','הטבה') where id = new.end_customer_id;
      end if;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists mt_appointments_loyalty_count on public.mt_appointments;
create trigger mt_appointments_loyalty_count after update on public.mt_appointments for each row execute function public.mt_handle_loyalty_count();

-- ---------- 7. עדכון get_busy_slots: מתחשב בחיץ ובמשך (#33) — מחליף את הגרסה הקודמת, אותה חתימה ואותה הגנת origin ----------
create or replace function public.get_busy_slots(p_client_id uuid, p_date_from date, p_date_to date)
returns table(date date, "time" text, barber text)
language plpgsql stable security definer set search_path to 'public' as $$
declare v_allowed_origin text; v_request_origin text; v_buffer int; v_slot int;
begin
  select allowed_origin, coalesce((settings->>'buffer_minutes')::int, 0), coalesce((settings->>'slot_minutes')::int, 30)
    into v_allowed_origin, v_buffer, v_slot from public.mt_clients where id = p_client_id;
  if v_allowed_origin is null then return; end if;
  v_request_origin := nullif(current_setting('request.headers', true), '')::json ->> 'origin';
  if v_request_origin is null or v_request_origin <> v_allowed_origin then return; end if;
  return query
    -- כל סלוט (לפי קפיצת העסק) שנופל בתוך [start - buffer, end + buffer) של תור/חסימה נחשב תפוס
    with busy as (
      select a.scheduled_at - make_interval(mins => v_buffer) as s,
             a.scheduled_at + make_interval(mins => coalesce(a.duration_minutes, v_slot) + v_buffer) as e,
             a.staff_member as who
      from public.mt_appointments a
      where a.client_id = p_client_id and a.status in ('pending','confirmed')
        and (a.scheduled_at at time zone 'Asia/Jerusalem')::date between p_date_from and p_date_to
      union all
      select b.start_at, b.end_at, b.staff_member from public.mt_blocked_slots b
      where b.client_id = p_client_id and (b.start_at at time zone 'Asia/Jerusalem')::date between p_date_from - 1 and p_date_to + 1
    ), grid as (
      select gs as t from busy, generate_series(date_trunc('day', busy.s at time zone 'Asia/Jerusalem') at time zone 'Asia/Jerusalem',
                                                 date_trunc('day', busy.e at time zone 'Asia/Jerusalem') at time zone 'Asia/Jerusalem' + interval '1 day',
                                                 make_interval(mins => v_slot)) gs
    )
    select distinct (g.t at time zone 'Asia/Jerusalem')::date as date,
           to_char(g.t at time zone 'Asia/Jerusalem', 'HH24:MI') as "time",
           busy.who as barber
    from grid g join busy on g.t >= busy.s and g.t < busy.e
    where (g.t at time zone 'Asia/Jerusalem')::date between p_date_from and p_date_to;
end $$;

-- ---------- 8. 2.8: חסימת מבריז — האתר בודק דרך RPC (anon, לפי טלפון + origin) ----------
create or replace function public.mt_is_phone_blocked(p_client_id uuid, p_phone text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_allowed_origin text; v_request_origin text; v_threshold int; v_row public.mt_end_customers;
begin
  select allowed_origin, coalesce((settings->>'block_after_no_shows')::int, 2) into v_allowed_origin, v_threshold from public.mt_clients where id = p_client_id;
  if v_allowed_origin is null then return false; end if;
  v_request_origin := nullif(current_setting('request.headers', true), '')::json ->> 'origin';
  if v_request_origin is null or v_request_origin <> v_allowed_origin then return false; end if;
  select * into v_row from public.mt_end_customers where client_id = p_client_id and phone = p_phone;
  if v_row.id is null then return false; end if;
  if v_row.blocked is true then return true; end if;
  if v_row.blocked is false and v_row.block_override then return false; end if;
  return coalesce(v_row.no_show_count, 0) >= v_threshold;
end $$;
revoke execute on function public.mt_is_phone_blocked(uuid, text) from public, authenticated;
grant execute on function public.mt_is_phone_blocked(uuid, text) to anon;

-- ---------- 9. 2.3: הרשמה עצמית לרשימת המתנה מהאתר (anon, RPC עם origin) ----------
create or replace function public.mt_join_waitlist_self(p_client_id uuid, p_name text, p_phone text, p_service text, p_staff text, p_date date)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_allowed_origin text; v_request_origin text; v_cust uuid; v_id uuid; v_phone text;
begin
  select allowed_origin into v_allowed_origin from public.mt_clients where id = p_client_id and status = 'active';
  if v_allowed_origin is null then raise exception 'unknown client'; end if;
  v_request_origin := nullif(current_setting('request.headers', true), '')::json ->> 'origin';
  if v_request_origin is null or v_request_origin <> v_allowed_origin then raise exception 'origin not allowed'; end if;
  v_phone := regexp_replace(p_phone, '[^0-9]', '', 'g');
  if v_phone like '0%' then v_phone := '972' || substr(v_phone, 2); end if;
  if v_phone !~ '^972[0-9]{8,9}$' then raise exception 'invalid phone'; end if;
  insert into public.mt_end_customers(client_id, phone, name) values (p_client_id, v_phone, left(regexp_replace(p_name, '[<>]', '', 'g'), 100))
  on conflict (client_id, phone) do update set name = coalesce(public.mt_end_customers.name, excluded.name) returning id into v_cust;
  if exists (select 1 from public.mt_waitlist where client_id = p_client_id and end_customer_id = v_cust and status = 'waiting' and source = 'self') then
    raise exception 'already waiting';
  end if;
  insert into public.mt_waitlist(client_id, end_customer_id, original_appointment_id, desired_service, desired_staff_member, desired_scheduled_at, position, status, desired_date, source)
  values (p_client_id, v_cust, null, left(p_service, 100), nullif(left(p_staff, 100), ''), coalesce(p_date, current_date)::timestamptz, 1, 'waiting', p_date, 'self')
  returning id into v_id;
  return v_id;
end $$;
revoke execute on function public.mt_join_waitlist_self(uuid, text, text, text, text, date) from public, authenticated;
grant execute on function public.mt_join_waitlist_self(uuid, text, text, text, text, date) to anon;

-- ---------- 10. 5.4: ביקורות אמיתיות שנאספו (מוצגות באתר) ----------
create table if not exists public.mt_reviews (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.mt_clients(id) on delete cascade,
  end_customer_id uuid references public.mt_end_customers(id) on delete set null,
  appointment_id uuid references public.mt_appointments(id) on delete set null,
  rating smallint check (rating between 1 and 5),
  text text,
  author_name text,
  source text not null default 'whatsapp' check (source in ('whatsapp','google','manual')),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
comment on table public.mt_reviews is '5.4: ביקורות שנאספו דרך בקשת הביקורת (0.1) או הוזנו ידנית. רק approved=true מוצגות באתר.';
alter table public.mt_reviews enable row level security;
create policy mt_reviews_owner on public.mt_reviews for all to authenticated using (client_id = public.mt_current_client_id()) with check (client_id = public.mt_current_client_id());
grant select, insert (client_id, end_customer_id, appointment_id, rating, text, author_name, source, approved), update (approved, text, author_name, rating), delete on public.mt_reviews to authenticated;
create policy mt_reviews_public on public.mt_reviews for select to anon using (approved);
grant select (id, client_id, rating, text, author_name, created_at) on public.mt_reviews to anon;

-- ---------- 11. מונה הודעות לפי מסלול (D10): monthly_limit נקרא מ-settings.monthly_message_limit; 'TBD' → ברירת מחדל 300 ----------
-- (הפונקציה הקיימת mt_increment_usage_and_check כבר קוראת settings->>'monthly_message_limit'; 'TBD' ייכשל ב-cast → נעטוף)
create or replace function public.mt_increment_usage_and_check(p_client_id uuid, p_amount integer default 1)
returns table(allowed boolean, messages_sent integer, monthly_limit integer)
language plpgsql security definer set search_path to 'public' as $$
declare v_period date := date_trunc('month', (now() at time zone 'Asia/Jerusalem'))::date; v_limit int;
begin
  select case when (c.settings->>'monthly_message_limit') ~ '^[0-9]+$' then (c.settings->>'monthly_message_limit')::int else 300 end
    into v_limit from public.mt_clients c where c.id = p_client_id;
  insert into public.mt_usage_counters (client_id, period_month, messages_sent, monthly_limit)
  values (p_client_id, v_period, 0, coalesce(v_limit, 300)) on conflict (client_id, period_month) do nothing;
  update public.mt_usage_counters u set messages_sent = u.messages_sent + p_amount, updated_at = now()
    where u.client_id = p_client_id and u.period_month = v_period
    returning u.messages_sent, u.monthly_limit into messages_sent, monthly_limit;
  allowed := messages_sent <= monthly_limit;
  if not allowed then
    update public.mt_usage_counters set blocked = true, warned_at = coalesce(warned_at, now()) where client_id = p_client_id and period_month = v_period;
  end if;
  return next;
end $$;
