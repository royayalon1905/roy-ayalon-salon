-- ============================================================================
-- ROYA 2.0 — migration 005: mt_join_waitlist_self_fix_position_bug
-- הוחל בפרודקשן ב-11.9.2026 (project facehdfqvppxnmdtpzuo, version 20260911162856).
-- קובץ זה נוסף לתיקייה המקומית ב-12.9.2026 (משימת "סנכרון SQL") — לא היה קיים לפני כן.
-- ============================================================================

-- תיקון באג עצמאי וקיים שנמצא תוך כדי בדיקות (לא קשור לתכונת טווח השעות): הפונקציה תמיד קבעה
-- position=1 לכל הרשמה חדשה, בלי לבדוק אם כבר יש מישהו אחר ממתין לאותו יום+שירות. הטריגר
-- mt_enforce_waitlist_slot_cap רק אוכף מקסימום 2 ממתינים, אבל לא קובע את ה-position בעצמו - זה תפקיד
-- הקוד הקורא. בפועל, לקוח שני שמנסה להצטרף לאותו יום+שירות קיבל שגיאת "מפתח כפול" גולמית מה-DB
-- וההרשמה שלו נכשלה בלי שהוא באמת נכנס לתור. אושר לתיקון ע"י רועי 11.9.2026 (Cowork session).
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
  v_service text;
  v_scheduled_at timestamptz;
  v_position smallint;
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

  v_service := left(p_service, 100);
  v_scheduled_at := coalesce(p_date, current_date)::timestamptz;

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

  -- קביעת המיקום בתור לפי כמה אנשים כבר ממתינים/הוצע להם בפועל לאותו יום+שירות (במקום 1 קבוע כמו קודם)
  select count(*) + 1 into v_position
  from public.mt_waitlist
  where client_id = p_client_id
    and desired_scheduled_at = v_scheduled_at
    and desired_service = v_service
    and status in ('waiting', 'offered');

  if v_position > 2 then
    raise exception 'waitlist full for this date and service';
  end if;

  insert into public.mt_waitlist(
    client_id, end_customer_id, original_appointment_id, desired_service, desired_staff_member,
    desired_scheduled_at, position, status, desired_date, source, desired_time_from, desired_time_to
  )
  values (
    p_client_id, v_cust, null, v_service, nullif(left(p_staff, 100), ''),
    v_scheduled_at, v_position, 'waiting', p_date, 'self', p_time_from, p_time_to
  )
  returning id into v_id;

  return v_id;
end
$function$;
