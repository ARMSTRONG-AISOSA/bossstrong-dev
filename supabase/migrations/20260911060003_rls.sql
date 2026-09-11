-- Row-Level Security (backend-specification.md §3)
--
-- The admin UID below (99e3ce55-500e-474b-bf26-0bd098c38a67) is the real
-- auth.uid() of the single admin user, confirmed 2026-09-11 — not a
-- placeholder. (backend-specification.md §3.2, §8.3)

alter table categories enable row level security;
alter table posts enable row level security;
-- contact_submissions doesn't exist yet at this point in the migration order
-- (created in 20260911060004_contact_submissions.sql, which enables RLS on
-- it there) — enabling it here would fail with "relation does not exist".

-- posts: public can read only published rows. This is the enforcement point
-- for the Draft Visibility Rule (blog-admin-specification.md §5) — no client
-- query, however written, can ever retrieve a draft.
create policy "Public can read published posts"
on posts for select
to anon, authenticated
using (status = 'published');

-- posts: single hardcoded admin, not "any authenticated user" (§3.2, §4).
create policy "Admin can manage all posts"
on posts for all
to authenticated
using (auth.uid() = '99e3ce55-500e-474b-bf26-0bd098c38a67')
with check (auth.uid() = '99e3ce55-500e-474b-bf26-0bd098c38a67');

-- categories: public read (needed to render filter pills), admin-only write.
create policy "Public can read categories"
on categories for select
to anon, authenticated
using (true);

create policy "Admin can manage categories"
on categories for all
to authenticated
using (auth.uid() = '99e3ce55-500e-474b-bf26-0bd098c38a67')
with check (auth.uid() = '99e3ce55-500e-474b-bf26-0bd098c38a67');
