-- Atomic rate-limit-and-insert RPC (backend-specification.md §6.3).
-- The whole body runs as one unit, so there's no window between the count and
-- the insert for a burst of concurrent requests to exploit. `security definer`
-- is required: anon has no SELECT policy on contact_submissions (by design,
-- to prevent enumeration), so this function runs as its owner to perform the
-- internal count check without granting broader public read access.
create or replace function public.submit_contact_message(
  p_name text,
  p_email text,
  p_subject text,
  p_message text,
  p_ip text
) returns contact_submissions
language plpgsql
security definer
as $$
declare
  recent_count int;
  new_row contact_submissions;
begin
  select count(*) into recent_count
  from contact_submissions
  where ip_address = p_ip
    and created_at > now() - interval '15 minutes';

  if recent_count >= 3 then
    raise exception 'rate_limit_exceeded';
  end if;

  insert into contact_submissions (name, email, subject, message, ip_address)
  values (p_name, p_email, p_subject, p_message, p_ip)
  returning * into new_row;

  return new_row;
end;
$$;
