-- contact_submissions (backend-specification.md §2.4, §3.5)
-- Uses the real admin UID (99e3ce55-500e-474b-bf26-0bd098c38a67) — see the RLS migration.

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  ip_address text,
  created_at timestamptz not null default now()
);

alter table contact_submissions enable row level security;

-- Public can insert only — never read, not even their own submission back.
-- This prevents the contact form from ever being used to enumerate messages.
create policy "Public can submit contact form"
on contact_submissions for insert
to anon
with check (true);

create policy "Admin can read contact submissions"
on contact_submissions for select
to authenticated
using (auth.uid() = '99e3ce55-500e-474b-bf26-0bd098c38a67');

create policy "Admin can delete contact submissions"
on contact_submissions for delete
to authenticated
using (auth.uid() = '99e3ce55-500e-474b-bf26-0bd098c38a67');

-- No public update policy, deliberately (§3.5) — a submitted message is
-- immutable once sent.
