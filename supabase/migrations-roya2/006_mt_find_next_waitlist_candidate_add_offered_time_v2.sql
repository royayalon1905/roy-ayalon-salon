-- ============================================================================
-- ROYA 2.0 — migration 006: mt_find_next_waitlist_candidate_add_offered_time_v2
-- הוחל בפרודקשן ב-11.9.2026 (project facehdfqvppxnmdtpzuo, version 20260911163021).
-- קובץ זה נוסף לתיקייה המקומית ב-12.9.2026 (משימת "סנכרון SQL") — לא היה קיים לפני כן.
-- ============================================================================

drop function if exists public.mt_find_next_waitlist_candidate(uuid, text, timestamptz);

create function public.mt_find_next_waitlist_candidate(
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
  desired_time_to time,
  offered_scheduled_at timestamptz
)
language plpgsql
set search_path to 'public'
as $function$
declare
  v_date date := (p_scheduled_at at time zone 'Asia/Jerusalem')::date;
  v_time time := (p_scheduled_at at time zone 'Asia/Jerusalem')::time;
begin
  return query
    select w.id, w.client_id, w.end_customer_id, w.original_appointment_id, w.desired_service,
           w.desired_staff_member, w.desired_scheduled_at, w.position, w.desired_date,
           w.desired_time_from, w.desired_time_to, p_scheduled_at
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

  return query
    select w.id, w.client_id, w.end_customer_id, w.original_appointment_id, w.desired_service,
           w.desired_staff_member, w.desired_scheduled_at, w.position, w.desired_date,
           w.desired_time_from, w.desired_time_to, p_scheduled_at
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

  return query
    select w.id, w.client_id, w.end_customer_id, w.original_appointment_id, w.desired_service,
           w.desired_staff_member, w.desired_scheduled_at, w.position, w.desired_date,
           w.desired_time_from, w.desired_time_to, p_scheduled_at
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
