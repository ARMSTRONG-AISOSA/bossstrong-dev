# bossstrong-dev

Personal full-stack developer portfolio — Home, About, Projects, Blog, and Contact pages backed by a single-user admin dashboard for managing blog content.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Supabase (Postgres + Auth + Storage) · react-hook-form + zod · Resend · Vercel

Full rationale, rejected alternatives, and every architectural decision live under [`docs/specs/`](./docs/specs/) — start with [`CLAUDE.md`](./CLAUDE.md) for an index and the standing operating rules for this project.

## Local setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill in the real values (Supabase URL/anon key, Resend API key).
3. Run the dev server: `npm run dev`

## Project structure and decisions

This project is planned in full before implementation — every page's content, the database schema, the design system, and the deployment pipeline are documented under `docs/specs/` before any corresponding code is written. See `CLAUDE.md` Section 0 for the scope-discipline rule this project runs on: build what's documented, nothing more, and any deviation gets approved before it's implemented.
