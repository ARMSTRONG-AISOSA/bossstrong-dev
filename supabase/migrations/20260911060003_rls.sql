-- Row-Level Security (backend-specification.md §3)
--
-- ⚠️ REPLACE 'REPLACE_WITH_ADMIN_UID' BELOW WITH THE REAL ADMIN auth.uid()
-- BEFORE RUNNING THIS FILE. It's a single find-and-replace across this file.
-- Deliberately left as an invalid UUID string (not a placeholder that would
-- silently "work") so an unedited copy fails loudly with a cast error the
-- first time it's exercised, rather than quietly locking everyone out.
-- (backend-specification.md §3.2, §8.3 — confirm the real UID, don't guess.)

alter table categories enable row level security;
alter table posts enable row level security;
alter table contact_submissions enable row level security;

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
using (auth.uid() = 'REPLACE_WITH_ADMIN_UID')
with check (auth.uid() = 'REPLACE_WITH_ADMIN_UID');

-- categories: public read (needed to render filter pills), admin-only write.
create policy "Public can read categories"
on categories for select
to anon, authenticated
using (true);

create policy "Admin can manage categories"
on categories for all
to authenticated
using (auth.uid() = 'REPLACE_WITH_ADMIN_UID')
with check (auth.uid() = 'REPLACE_WITH_ADMIN_UID');
