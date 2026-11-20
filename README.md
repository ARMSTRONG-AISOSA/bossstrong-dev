# bossstrong-dev

Personal full-stack developer portfolio: Home, About, Projects, Blog, and Contact pages, backed by a single-user admin dashboard for managing blog content, contact messages, and the resume.

**Live:** https://bossstrong-dev.vercel.app

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Supabase (Postgres + Auth + Storage) · react-hook-form + zod · react-markdown · Resend · cobe · Vercel

## Local setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill in the real values:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase project
   - `RESEND_API_KEY`, `CONTACT_TO_EMAIL` — contact-form email notifications
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` — search engine verification (optional locally)
3. Set up the database: see [`supabase/README.md`](./supabase/README.md).
4. Run the dev server: `npm run dev`

## How this project is built

Every page, the database schema, the design system, and the deployment pipeline were specified in planning documents before the corresponding code was written, and changes go through those documents first. The planning documents are kept locally and aren't part of this repository.
