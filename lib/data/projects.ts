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
  // Desktop screenshot of the live site's hero (1440×900, in
  // public/projects/), shown above the title on cards and case-study pages.
  image?: { src: string; alt: string };
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
    image: {
      src: "/projects/bossstrong-dev.jpg",
      alt: "Homepage hero of the bossstrong-dev portfolio",
    },
    liveUrl: "https://bossstrong-dev.vercel.app",
    repoUrl: "https://github.com/ARMSTRONG-AISOSA/bossstrong-dev",
  },
  {
    slug: "kempt-laundry",
    name: "Kempt Laundry Services",
    shortDescription:
      "A website for a pickup-and-delivery laundry business in Benin City — built to be found in local search and to turn visitors into WhatsApp bookings, with no backend to maintain.",
    featured: true,
    role: "Sole developer for a paid client — design direction, build, deployment, and SEO. Built using an AI-assisted workflow (Claude Code).",
    techStack: [
      "Next.js 14 (App Router)",
      "React 18",
      "TypeScript",
      "CSS (no framework)",
      "WhatsApp click-to-chat",
      "Google Maps embed",
      "Python + Pillow (share images)",
      "Vercel",
    ],
    problem:
      "Kempt Laundry Services is a pickup-and-delivery laundry in Uselu, Benin City, and a business I'd been a customer of for years before the owner hired me. It needed a website that people searching for laundry in Benin City could actually find, that explained its services and per-item pricing clearly, and that made booking a pickup as easy as sending a message.",
    goals:
      'Rank for local searches like "laundry in Benin City," present services and prices clearly, give schools and churches a way to request bulk quotes, and lead every visitor toward one of two actions — schedule a pickup or message on WhatsApp — on every screen size from a 390px phone to a 1440px desktop.',
    solution:
      'A three-page Next.js site (Home, Services, Pricing) with booking, opening hours and map, and contact sections shared across every page. "Schedule pickup" and the bulk-quote form both open WhatsApp with a prefilled message, so requests land in the channel the business already runs on — with no server, inbox, or database to maintain. A design system drawn only from the logo\'s colors keeps every page consistent.',
    architecture:
      "Statically rendered App Router pages built from Server Components, with client components only where interaction needs them: the mobile menu, reviews slider, price tabs, FAQ accordion, and quote form. All business data — phone, address, opening hours, services, prices, FAQs, reviews — lives in one content file (`lib/site.ts`) that the pages, the structured data, and the sitemap all read from, so changing a price or phone number is a one-file edit. Pushes to `main` deploy automatically on Vercel.",
    frontend:
      "Hand-written CSS in a single stylesheet: design tokens taken from the logo (navy, blue, sky), BEM-style class names, and fluid grids (`auto-fit`/`minmax` with `clamp()`) that reflow from phone to desktop with almost no media queries. Shapes borrowed from the logo — wave dividers, a teardrop-framed hero photo, circular price badges — give it personality without a component library. Fonts are self-hosted at build time via `next/font`, loading only the weights the CSS actually uses.",
    backend:
      "None, by design. The bulk-quote form originally posted to a placeholder API route that only logged requests — so a real customer's request would have been silently lost while the page told them \"we'll be in touch.\" I replaced it with a client-side flow that validates all six fields (including whitespace-only answers, which HTML's `required` lets through) and opens WhatsApp with the request prefilled, plus a fallback link in case the browser blocks the popup.",
    database:
      "None. The business data changes rarely, so a single content file replaces a CMS or database entirely — nothing to host, secure, or pay for, and every edit goes through version control.",
    challenges:
      "The quote form's silent data loss was the most important fix: a form that looks like it works but delivers nothing is worse than no form at all. Smaller issues came up too — price-badge photos stretching inside their circular frames (fixed by positioning each image inside a fixed-ratio ring), and a section heading pushed to the wrong side by two conflicting flexbox utility classes. Link previews needed care as well: WhatsApp only shows a large preview for images under about 300 KB, so each page's share image is generated to fit that limit.",
    technicalDecisions:
      "Plain CSS and only three runtime dependencies (`next`, `react`, `react-dom`), all pinned to exact versions, so builds are reproducible and there's very little for a small business to maintain. WhatsApp instead of a backend for bookings, matching how customers already contact the business. Kept on Next.js 14 for launch, with the framework's image-optimization endpoint switched off since the site doesn't use it — less surface area — and an upgrade to Next.js 16 planned. Left review star ratings out of the structured data on purpose: Google treats reviews a business publishes about itself as self-serving.",
    results:
      "Live and showing in Google search results, with Google Search Console and Bing Webmaster Tools set up, the sitemap submitted, and the site linked from Kempt's Google Business profile. Every page has its own branded link preview for WhatsApp, Facebook, and X, plus local-business structured data carrying the address, opening hours, and services. The site is drawing visitors, and the owner is happy with it.",
    lessonsLearned:
      "Test the whole path a user's data takes, not just whether the form submits — the original quote form passed every visual check while delivering nothing. And the simplest architecture that fits the business is usually the right one: routing requests into WhatsApp, which the business already runs on, delivered the feature without a server to maintain.",
    image: {
      src: "/projects/kempt-laundry.jpg",
      alt: "Homepage hero of the Kempt Laundry Services website",
    },
    liveUrl: "https://kemptlaundry.vercel.app",
    repoUrl:
      "https://github.com/ARMSTRONG-AISOSA/Kempt-Laundry-Service-Website",
  },
  {
    slug: "blessing-osamudiamen-portfolio",
    name: "Accounting/Financial Analyst Portfolio — Blessing Osamudiamen",
    shortDescription:
      "A portfolio for a Chartered Accountant and financial analyst — five finance case studies as indexable pages, with structured data that tells search engines exactly who she is.",
    featured: true,
    role: "Sole developer for a paid client — design direction, build, deployment, and SEO. Built using an AI-assisted workflow (Claude Code).",
    techStack: [
      "Next.js 16 (App Router)",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "lucide-react",
      "Vercel",
    ],
    problem:
      "Blessing Osamudiamen, a Chartered Accountant (ACA) and FMVA-certified financial analyst, was applying for accounting and financial-analyst roles. Her strongest evidence — five detailed case studies, including a DCF equity valuation, an integrated budgeting model, and a Tableau sales dashboard — existed only as PDF reports and model files, which don't make a quick first impression or show up in search.",
    goals:
      "Present her as a credible hire within seconds, make every case study readable on the page rather than only as a download, get her name and credentials found in search, and keep personal details private — no age, address, nationality, or grades anywhere. Every number on the site had to come from her CV or her own case-study reports.",
    solution:
      'A fully static Next.js site — Home, About, Projects, and a dedicated page for each of the five case studies — with downloadable PDFs and links to the original model files. Each case study follows the same structure (Problem → Methodology → Findings → Recommendations → "So what?") with its headline figures up front, and all content lives in one typed data file, so her details can change without touching any components.',
    architecture:
      "Every route is statically prerendered, including one page per case study generated with `generateStaticParams` (unknown slugs return a 404). Server Components by default; client components only for the mobile menu, scroll animations, and the projects explorer. The Projects page has a filterable grid with a deep-linkable modal (`?open=<slug>`, closed by the back button), and one shared content component renders each case study in both the modal and its standalone page.",
    frontend:
      "Tailwind CSS with a deliberately restrained finance palette — navy and slate with a single orange accent — and IBM Plex Mono for every figure, date, and label, so the site reads like a well-built financial model. Framer Motion animates the filter tabs and section reveals, and respects reduced-motion settings. Accessibility is built in: 44px touch targets, a modal that takes focus, closes on Escape, and returns focus afterward, a skip link, and tap feedback on phones (hover styles only apply on devices that can hover).",
    backend:
      "None needed: the site has no forms or accounts, and contact goes through direct email, phone, WhatsApp, and LinkedIn links — so there's no server to run or secure. The build does the server-side work instead: an `llms.txt` route generates a plain-text summary of her profile for AI search tools, and a build step reads git history to date every page (see Technical Decisions).",
    database:
      "None. All content — profile, experience, certifications, the five case studies, and every SEO keyword — lives in one typed TypeScript file (`data/profile.ts`). Strict typing catches a missing case-study field at build time, which matters on a site where every figure has to be exact.",
    challenges:
      "The biggest problem was invisible in a browser. Case studies originally existed only inside a modal, so search engines couldn't index them at all — and reading the modal's URL state with `useSearchParams` silently made the entire projects grid client-rendered, so crawlers received an empty page. I rebuilt each case study as its own static page and moved the URL read to after the page loads, so all five cards are now in the HTML a crawler receives. Link previews needed a fix too: the share image is a tall portrait, which X's large card format would crop through her face, so it uses the square card instead.",
    technicalDecisions:
      '"Last modified" dates in the sitemap and structured data come from the git commit that last touched the content, read at build time — never from the build time itself, which would tell search engines everything changed on every deploy. Structured data is one linked JSON-LD graph: a single Person entity (credentials, issuers, occupations) referenced by every page, plus an Article for each case study. Privacy is a content rule, not an afterthought — no age, address, nationality, or grades appear anywhere, including in the CV download, which was edited to match.',
    results:
      "Live, verified in Google Search Console with its sitemap submitted, and showing in Google search results. Blessing is happy with it and is using it in her job applications — and people who've seen it have already asked about having similar sites built for themselves.",
    lessonsLearned:
      "A site can look perfect in the browser and still be invisible to search engines — checking the raw HTML a crawler actually receives caught a problem no visual review would have. And on a finance portfolio, credibility depends on exactness, so every figure traces back to a source document instead of being rounded or paraphrased.",
    image: {
      src: "/projects/blessing-osamudiamen-portfolio.jpg",
      alt: "Homepage hero of Blessing Osamudiamen's portfolio website",
    },
    liveUrl: "https://blessing-osamudiamen.vercel.app",
    repoUrl: "https://github.com/ARMSTRONG-AISOSA/blessing-osamudiamen",
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
