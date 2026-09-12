-- ============================================================================
-- ROYA 2.0 — migration 003: mt_waitlist_time_range_priority
-- הוחל בפרודקשן ב-11.9.2026 (project facehdfqvppxnmdtpzuo, version 20260911162424).
-- קובץ זה נוסף לתיקייה המקומית ב-12.9.2026 (משימת "סנכרון SQL") — לא היה קיים לפני כן.
-- הערה: mt_join_waitlist_self תוקן פעמיים אחרי המיגרציה הזו (ראו 004, 005) — זו לא הגרסה הסופית של הפונקציה.
-- ============================================================================

-- תכונת "טווח שעות מנצח יום שלם" ברשימת המתנה - אושר ע"י רועי 11.9.2026 (Cowork session)
-- שני עמודות אופציונליות חדשות: אם שתיהן ריקות = "יום שלם" (כמו היום), אם שתיהן מלאות = "טווח שעות ספציפי".
alter table public.mt_waitlist
  add column if not exists desired_time_from time,
  add column if not exists desired_time_to time,
  add column if not exists offered_scheduled_at timestamptz;

comment on column public.mt_waitlist.desired_time_from is 'תחילת טווח שעות מבוקש (NULL = יום שלם, בלי העדפת שעה)';
comment on column public.mt_waitlist.desired_time_to is 'סוף טווח שעות מבוקש (NULL = יום שלם)';
comment on column public.mt_waitlist.offered_scheduled_at is 'הזמן המדויק של הסלוט שבפועל הוצע ללקוח (עשוי להיות שונה מ-desired_scheduled_at/desired_date כשההתאמה היא לפי יום שלם או טווח שעות ולא זמן מדויק) - זה מה שמשמש ביצירת התור בפועל אם ההצעה מתקבלת.';

alter table public.mt_waitlist
  add constraint mt_waitlist_time_range_both_or_neither
  check (
    (desired_time_from is null and desired_time_to is null)
    or (desired_time_from is not null and desired_time_to is not null and desired_time_from < desired_time_to)
  );

-- עדכון ה-RPC הציבורי: שני פרמטרים אופציונליים חדשים בסוף (ברירת מחדל NULL) - קריאות קיימות מהאתר החי ממשיכות לעבוד בלי שינוי.
create or replace function public.mt_join_waitlist_self(
  p_client_id uuid,
  p_name text,
  p_phone text,
  p_service text,
  p_staff text,
  p_date date,
  p_time_from time default null,
  p_time_to time default null
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_allowed_origin text;
  v_request_origin text;
  v_cust uuid;
  v_id uuid;
  v_phone text;
begin
  select allowed_origin into v_allowed_origin from public.mt_clients where id = p_client_id and status = 'active';
  if v_allowed_origin is null then
    raise exception 'unknown client';
  end if;

  v_request_origin := nullif(current_setting('request.headers', true), '')::json ->> 'origin';
  if v_request_origin is null or v_request_origin <> v_allowed_origin then
    raise exception 'origin not allowed';
  end if;

  v_phone := regexp_replace(p_phone, '[^0-9]', '', 'g');
  if v_phone like '0%' then
    v_phone := '972' || substr(v_phone, 2);
  end if;
  if v_phone !~ '^972[0-9]{8,9}$' then
    raise exception 'invalid phone';
  end if;

  if (p_time_from is null) <> (p_time_to is null) then
    raise exception 'time range must be both set or both empty';
  end if;
  if p_time_from is not null and p_time_from >= p_time_to then
    raise exception 'invalid time range';
  end if;

  insert into public.mt_end_customers(client_id, phone, name)
  values (p_client_id, v_phone, left(regexp_replace(p_name, '[<>]', '', 'g'), 100))
  on conflict (client_id, phone) do update set name = coalesce(public.mt_end_customers.name, excluded.name)
  returning id into v_cust;

  if exists (
    select 1 from public.mt_waitlist
    where client_id = p_client_id and end_customer_id = v_cust and status = 'waiting' and source = 'self'
  ) then
    raise exception 'already waiting';
  end if;

  insert into public.mt_waitlist(
    client_id, end_customer_id, original_appointment_id, desired_service, desired_staff_member,
    desired_scheduled_at, position, status, desired_date, source, desired_time_from, desired_time_to
  )
  values (
    p_client_id, v_cust, null, left(p_service, 100), nullif(left(p_staff, 100), ''),
    coalesce(p_date, current_date)::timestamptz, 1, 'waiting', p_date, 'self', p_time_from, p_time_to
  )
  returning id into v_id;

  return v_id;
end
$function$;

-- RPC פנימי חדש (נקרא רק ע"י האוטומציה עם service key, לא מהאתר) - מוצא את המועמד הבא ברשימת ההמתנה
-- כשמתפנה סלוט מדויק, לפי עדיפות: (1) טווח שעות שמכיל את השעה שהתפנתה, (2) יום שלם לאותו תאריך,
-- (3) התאמה מדויקת בזמן (רשומות ישנות/legacy בלי desired_date) - שומר על התאמה שגרת ליים היום.
-- מוחזרת שורה אחת (הראשונה לפי position בתוך השכבה הכי ספציפית שיש בה מועמד).
create or replace function public.mt_find_next_waitlist_candidate(
  p_client_id uuid,
  p_service text,
  p_scheduled_at timestamptz
)
returns table (
  id uuid,
  client_id uuid,
  end_customer_id uuid,
  original_appointment_id uuid,
  desired_service text,
  desired_staff_member text,
  desired_scheduled_at timestamptz,
  "position" smallint,
  desired_date date,
  desired_time_from time,
  desired_time_to time
)
language plpgsql
set search_path to 'public'
as $function$
declare
  v_date date := (p_scheduled_at at time zone 'Asia/Jerusalem')::date;
  v_time time := (p_scheduled_at at time zone 'Asia/Jerusalem')::time;
begin
  -- שכבה 1: טווח שעות ספציפי שמכיל את השעה שהתפנתה
  return query
    select w.id, w.client_id, w.end_customer_id, w.original_appointment_id, w.desired_service,
           w.desired_staff_member, w.desired_scheduled_at, w.position, w.desired_date,
           w.desired_time_from, w.desired_time_to
    from public.mt_waitlist w
    where w.client_id = p_client_id
      and w.desired_service = p_service
      and w.status = 'waiting'
      and w.desired_date = v_date
      and w.desired_time_from is not null
      and v_time >= w.desired_time_from
      and v_time < w.desired_time_to
    order by w.position asc
    limit 1;
  if found then
    return;
  end if;

  -- שכבה 2: "יום שלם" לאותו תאריך (בלי טווח שעות)
  return query
    select w.id, w.client_id, w.end_customer_id, w.original_appointment_id, w.desired_service,
           w.desired_staff_member, w.desired_scheduled_at, w.position, w.desired_date,
           w.desired_time_from, w.desired_time_to
    from public.mt_waitlist w
    where w.client_id = p_client_id
      and w.desired_service = p_service
      and w.status = 'waiting'
      and w.desired_date = v_date
      and w.desired_time_from is null
    order by w.position asc
    limit 1;
  if found then
    return;
  end if;

  -- שכבה 3: התאמה מדויקת בזמן (תאימות לאחור לרשומות בלי desired_date)
  return query
    select w.id, w.client_id, w.end_customer_id, w.original_appointment_id, w.desired_service,
           w.desired_staff_member, w.desired_scheduled_at, w.position, w.desired_date,
           w.desired_time_from, w.desired_time_to
    from public.mt_waitlist w
    where w.client_id = p_client_id
      and w.desired_service = p_service
      and w.status = 'waiting'
      and w.desired_date is null
      and w.desired_scheduled_at = p_scheduled_at
    order by w.position asc
    limit 1;
  return;
end
$function$;
