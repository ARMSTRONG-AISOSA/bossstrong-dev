// Projects aren't database-backed (no admin CRUD, no schema table exists for
// them per backend-specification.md) — they're hand-authored here, per
// projects-specification.md §4.4's recommended case-study structure.
// Content-authenticity rule (homepage-specification.md §9): no fabricated
// projects.
//
// Related Content (blog-admin-specification.md §3.2): a post can optionally
// reference a project by its `slug` here via `posts.related_project_slug`
// (2026-09-16 migration) — matched against this array at read time, not a
// real foreign key, since this file (not a table) is the source of truth.

export type Project = {
  slug: string;
  name: string;
  shortDescription: string;
  featured: boolean;
  problem: string;
  goals: string;
  solution: string;
  role: string;
  techStack: string[];
  architecture: string;
  frontend: string;
  backend: string;
  database: string;
  challenges: string;
  technicalDecisions: string;
  results: string;
  lessonsLearned: string;
  liveUrl?: string;
  repoUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "bossstrong-dev",
    name: "bossstrong-dev — This Portfolio",
    shortDescription:
      "A full-stack developer portfolio with its own single-admin content dashboard — built end to end, from database schema and row-level security to the public site you're looking at right now.",
    featured: true,
    role: "Sole developer — planning, database design, frontend, backend, and deployment.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase (Postgres, Auth, Storage)",
      "react-hook-form",
      "zod",
      "Resend",
      "Vercel",
    ],
    problem:
      "A portfolio needs to prove full-stack ability, not just claim it — a static site with hardcoded content doesn't demonstrate database design, auth, or backend logic. It also needed a way to publish blog posts and manage a resume without hand-editing code for every update.",
    goals:
      "Build a public marketing/evidence site (Home, About, Projects, Blog, Contact) backed by a single-admin dashboard for managing blog content — with real authentication, real data validation, and security handled properly rather than superficially.",
    solution:
      "A Next.js App Router site with two distinct registers: a public marketing site and a denser, lower-motion `/admin` dashboard, both built on the same design-token system. Supabase provides Postgres, authentication (email/password and Google OAuth), and file storage; all writes go through validated Server Actions, and draft content is invisible at the database level, not just hidden in the UI.",
    architecture:
      "Route groups separate the public site from the admin dashboard so they can never accidentally share marketing styling. Server Components fetch data directly from Supabase for reads; Server Actions handle every write. Middleware (`proxy.ts` on Next 16) refreshes the auth session and guards every `/admin/*` route centrally, rather than repeating auth checks per page.",
    frontend:
      "Tailwind CSS v4 design tokens (color, type scale, spacing, radius) drive both registers from one source, with a manual dark-mode class strategy that respects system preference by default. Forms use react-hook-form with zod schemas for client-side validation; markdown content (blog posts) renders through react-markdown with syntax highlighting, deliberately without raw-HTML passthrough, to close off a real XSS vector.",
    backend:
      "Server Actions handle post/category CRUD, resume upload, and contact-form submission. The contact form's rate limiting is enforced by a single atomic Postgres function (`submit_contact_message`), not application-level logic, closing a race condition a naive insert-then-check approach would leave open. Email notifications send via Resend, and a failed send never blocks the saved submission.",
    database:
      'Postgres via Supabase, with Row-Level Security on every table — draft posts are invisible to public queries at the database level, not filtered client-side. Categories, posts, and contact submissions are hand-written, version-controlled SQL migrations. Deleting a category reassigns its posts to a non-deletable "Uncategorized" category via `ON DELETE SET DEFAULT` rather than orphaning or cascading.',
    challenges:
      "A few real walls came up during the build: shadcn/ui's CLI turned out to inject its own color palette that silently collided with the project's existing design tokens (including a real WCAG contrast bug caught in the process); Next.js 16 renamed `middleware.ts` to `proxy.ts` mid-project; a migration ran in the wrong order against the live database and had to be diagnosed and fixed; and a Google OAuth `redirect_uri_mismatch` turned out to be a blank field in the Google Cloud Console, found by decoding the actual error payload rather than guessing.",
    technicalDecisions:
      "Chose Next.js route groups to physically separate the admin and public layouts rather than conditionally styling one shared layout. Chose a single atomic database function over a separate rate-limiting table or external service for the contact form, matching the actual scale of the problem instead of over-engineering it. When a needed icon (GitHub/LinkedIn/WhatsApp logos) wasn't available in the project's icon library, chose hand-authored inline SVG over adding a new dependency.",
    results:
      "The full site is live and deployed on Vercel: public pages, a working admin dashboard with authentication (including Google OAuth), category and post management with image cleanup on delete, resume upload, and a contact form backed by real validation, rate limiting, and email notification.",
    lessonsLearned:
      "Verifying assumptions costs less than debugging them later — a database migration that silently ran in the wrong order, and commits that sat unpushed to GitHub for several sessions without anyone noticing, were both caught by checking actual state rather than trusting that a prior step had completed. Production environment variables are genuinely separate from local ones and need to be verified independently, not assumed to carry over.",
    liveUrl: "https://bossstrong-dev.vercel.app",
    repoUrl: "https://github.com/ARMSTRONG-AISOSA/bossstrong-dev",
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

export function getOtherProjects(): Project[] {
  return projects.filter((project) => !project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
