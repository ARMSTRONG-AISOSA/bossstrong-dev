# Database setup

These migrations implement `docs/specs/backend-specification.md`. Run them in order — each depends on the ones before it.

## Order

1. `20260911060001_categories.sql`
2. `20260911060002_posts.sql`
3. `20260911060003_rls.sql` — **replace `REPLACE_WITH_ADMIN_UID` with the real admin `auth.uid()` first** (see below)
4. `20260911060004_contact_submissions.sql` — same replacement needed
5. `20260911060005_submit_contact_message.sql`
6. `20260911060006_storage.sql` — same replacement needed

## Admin UID

Done (2026-09-11) — the admin user exists and migrations 3, 4, and 6 already use the real UID (`99e3ce55-500e-474b-bf26-0bd098c38a67`), not a placeholder. Google OAuth can be added afterwards as a second sign-in method for the same account — see `docs/specs/technical-specification.md` §7.

## Running them

Either:

- **Supabase Dashboard → SQL Editor** — paste and run each file's contents in order, or
- **Supabase CLI** (if installed and linked to the project): `supabase db push`.

## After running

- `.env.local` needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Project Settings → API (see `.env.example`).
- Auth providers (email/password, Google OAuth) are configured in the dashboard under Authentication → Providers, not via migration.
