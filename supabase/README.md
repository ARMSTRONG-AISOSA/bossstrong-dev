# Database setup

These migrations implement the project's backend specification (schema, RLS, storage, the contact-form function). Run them in order — each depends on the ones before it.

## Order

1. `20260911060001_categories.sql`
2. `20260911060002_posts.sql`
3. `20260911060003_rls.sql` — contains the admin `auth.uid()` (see below)
4. `20260911060004_contact_submissions.sql` — same
5. `20260911060005_submit_contact_message.sql`
6. `20260911060006_storage.sql` — same
7. `20260916090000_posts_related_project.sql` — adds the optional `posts.related_project_slug` column (Related Content)

## Admin UID

Done (2026-09-11) — the admin user exists and migrations 3, 4, and 6 already use the real UID (`99e3ce55-500e-474b-bf26-0bd098c38a67`), not a placeholder. Google OAuth is enabled as a second sign-in method for the same account.

## Running them

Either:

- **Supabase Dashboard → SQL Editor** — paste and run each file's contents in order, or
- **Supabase CLI** (if installed and linked to the project): `supabase db push`.

## After running

- `.env.local` needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Project Settings → API (see `.env.example`).
- Auth providers (email/password, Google OAuth) are configured in the dashboard under Authentication → Providers, not via migration.

## `config.toml`

`supabase/config.toml` pins `[db] major_version = 17` so the weekly backup workflow's `supabase db dump` uses a matching Postgres 17 `pg_dump`. Update it if Supabase upgrades the project's Postgres major version.
