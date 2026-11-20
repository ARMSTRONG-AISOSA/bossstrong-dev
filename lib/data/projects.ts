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
  // Shorter <title>/OG title when `name` plus the " | Armstrong Omoregie"
  // template would run past ~60 characters and get cut off in search
  // results. The on-page H1 always uses `name`.
  seoTitle?: string;
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
  // Link-preview (OG/Twitter) image when it should differ from `image`,
  // e.g. an app's own 1200×630 share image. Falls back to `image`.
  ogImage?: { src: string; alt: string };
  liveUrl?: string;
  repoUrl?: string;
  // App projects (projects-specification.md §4.5): a direct download of the
  // latest build and the page listing every release. Download APK shows on
  // the card and the case-study page; All Releases only on the page.
  downloadUrl?: string;
  releasesUrl?: string;
  // Optional case-study extras (§4.5), each omitted when absent: a
  // bulleted Highlights section, 3–5 app screenshots (portrait, in
  // public/projects/<slug>/), and small-print disclaimer at the bottom.
  highlights?: string[];
  screenshots?: Screenshot[];
  // Projects made of several apps (projects-specification.md §4.5): one
  // screenshot group per app, each under its own app-name subheading.
  // Used instead of `screenshots`, not as well.
  screenshotGroups?: { title: string; caption?: string; shots: Screenshot[] }[];
  // Several apps, one APK each: the case-study page shows one labelled
  // download button per app instead of the single `downloadUrl` button.
  // The card keeps `downloadUrl` (the main, public-facing app).
  downloads?: { label: string; url: string }[];
  disclaimer?: string;
};

type Screenshot = { src: string; alt: string; width: number; height: number };

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
    seoTitle: "Blessing Osamudiamen — Finance Portfolio",
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
  {
    slug: "dexplorer",
    name: "Dexplorer",
    seoTitle: "Dexplorer: Every Pokémon, even offline",
    shortDescription:
      "An offline-first Pokédex for Android, built with React Native and Expo. It covers all 1,025 Pokémon, with branching evolution trees, type matchups and a team builder that flags weak spots.",
    featured: true,
    role: "Solo developer — design, development, testing on real Android devices, the release, and the promotional website. Built using an AI-assisted workflow (Claude Code).",
    techStack: [
      "React Native 0.88",
      "Expo SDK 58",
      "Expo Router",
      "TypeScript",
      "TanStack Query",
      "SQLite (expo-sqlite)",
      "AsyncStorage",
      "zod",
      "Reanimated 4",
      "react-native-svg",
      "Jest",
      "EAS Build",
      "GitHub Actions",
      "GitHub Pages",
      "PokéAPI (REST + GraphQL)",
    ],
    problem:
      "A Pokédex looks simple, but the data fights back. PokéAPI's REST list endpoint returns only names, so showing types and stats on 1,025 cards would take 1,025 requests, and sorting by stats would only ever cover the cards loaded so far. Evolution data comes as recursive trees with several possible methods per step. And an app used on a phone has to keep working when the connection is weak or gone.",
    goals:
      "Build a portfolio-grade Android app that covers every Pokémon, not just a first page: search, type filters and sorting across the full list; detail screens with stats and type matchups; evolution lines drawn as real trees; a team builder that checks six Pokémon for weak spots; and offline use for anything already opened. It also had to be accessible, polished in light and dark mode, and released where anyone can install it.",
    solution:
      "Dexplorer is a free Android app for browsing all 1,025 Pokémon. You can search, filter by type and sort by number, name or base-stat total. Detail screens show the Pokédex entry, abilities, stats and type matchups. Evolution lines are drawn as branching trees (Eevee's eight branches included), each labelled with how the evolution happens. A team builder checks six Pokémon against all 18 attack types and flags the gaps. Everything you open is cached on the phone, so it keeps working offline.",
    highlights: [
      "One GraphQL request (about 25 KB) loads a summary of every Pokémon, so sorting and filtering cover all 1,025 at once. The obvious approach would have taken 1,025 requests.",
      "It works offline: data lives in SQLite and is refreshed in the background after 30 days.",
      "Every API response and every stored value is validated with zod; corrupt data falls back safely instead of crashing.",
      "It has accessibility support: TalkBack labels, 44 dp touch targets, layouts that adapt to larger text, and a reduced-motion setting.",
      "It ships as per-processor APKs (39 MB instead of 114 MB) through GitHub Releases. A promotional site with SEO and share links is published by GitHub Actions.",
    ],
    screenshots: [
      {
        src: "/projects/dexplorer/list-light.webp",
        alt: "Pokédex list with search, type filters and sorting",
        width: 800,
        height: 1187,
      },
      {
        src: "/projects/dexplorer/detail-charizard-dark.webp",
        alt: "Charizard's detail screen in dark mode",
        width: 800,
        height: 1187,
      },
      {
        src: "/projects/dexplorer/evolution-light.webp",
        alt: "Eevee's branching evolution tree",
        width: 800,
        height: 1187,
      },
      {
        src: "/projects/dexplorer/team-light.webp",
        alt: "Team builder with three Pokémon",
        width: 800,
        height: 1187,
      },
      {
        src: "/projects/dexplorer/team-weak-light.webp",
        alt: "Team weak-spot table across all 18 types",
        width: 800,
        height: 1187,
      },
    ],
    architecture:
      "Layered so each part has one job. Screens read data through TanStack Query hooks; the hooks call repositories that work as a read-through cache, checking SQLite first and only going to PokéAPI on a cache miss or when saved data is more than 30 days old. Below that, the domain logic — the 18×18 type chart, evolution-tree parsing, sorting and team analysis — is plain TypeScript in `src/domain`, with no UI code, so it can be unit tested against real PokéAPI responses. Every failure becomes a typed `AppError` (no connection, not found, rate limited, server error, unreadable data), and one failing section, such as the evolution chain, doesn't take down the rest of the screen.",
    frontend:
      'File-based, typed routes with Expo Router and a custom tab bar matched to the design. Animation runs on Reanimated 4: a launch animation, sliding tabs, a dimmed detail transition and a pop when a Pokémon joins the team, all skipped when the phone\'s "remove animations" setting is on. Artwork loads through `expo-image` with a memory and disk cache, icons, the Poké Ball and the evolution trees are drawn with react-native-svg, and the theme defines all 18 type colors for both light and dark mode. Every button has a TalkBack label, touch targets are at least 44 dp, and layouts adapt to larger system text.',
    backend:
      "None of its own, by design. All Pokémon data comes from PokéAPI, a free public API, so the app has no server to host or pay for. Being a good API citizen shaped the design instead: one GraphQL query replaces 1,025 list requests, detail requests are limited in how many run at once, and cached data is only refreshed after 30 days.",
    database:
      "Two on-device stores, each matched to its data. SQLite (expo-sqlite) caches Pokémon, species, evolution chains and About text, so anything already opened shows instantly and works offline. AsyncStorage holds the small user data: the team, favorites and settings. Both are validated with zod on the way in and on the way out; corrupt or outdated stored values fall back to safe defaults, and if the database can't open at all, the app keeps working online and says so.",
    challenges:
      "The list was the first real wall: fetching full REST records for all 1,025 Pokémon would have meant about 200 MB, because each record includes every move. A single GraphQL summary request solved it, with REST paging kept as a fallback if GraphQL fails. Real data had edge cases too — Leafeon's evolution showed a location-based method from an older game until I switched to the default entry instead of the first one listed. Two bugs only appeared on a real phone: the add-to-team sheet closed itself right after opening on a fresh start, and the tab you had just left stayed on top for a moment and caught taps. Screenshots and logs pulled over adb found both. Screen tests weren't practical either, since Reanimated 4's Jest mocks wouldn't load in this setup, so screens were checked on a real phone and tablet instead.",
    technicalDecisions:
      'Chose a GraphQL summary over paging so that sorting and filtering are honest about the whole Pokédex, not just what\'s loaded. Chose "show cached data first, refresh in the background after 30 days" over blocking on a refresh or never refreshing. Shipped three APKs per release — arm64 (39 MB) as the main download, armv7 (31 MB) for older phones and a 114 MB universal fallback — with fixed file names, so a `releases/latest/download` link always serves the newest version. Kept the native stack\'s screen transition over a JavaScript one, trading exact design timings for speed on low-end phones and native back gestures. Named the app Dexplorer rather than anything containing "Pokémon" or "Pokédex", which are Nintendo trademarks. No global state library, no ORM and no backend: none of them solved a problem this app has.',
    results:
      "Released in November 2026 and currently at version 1.0.1, available as a free APK download from GitHub Releases. The domain logic is covered by 169 unit tests, and screens were checked on two real Android devices, a phone and a tablet, including forced failure cases, both color modes and 130% text size. The promotional website is published to GitHub Pages by GitHub Actions, with share links, link previews and structured data, and is verified in Google Search Console and Bing Webmaster Tools with its sitemap submitted.",
    lessonsLearned:
      "Design around the API's shape: the obvious request-per-card approach would have hammered PokéAPI and made sorting by stats impossible. Offline-first is mostly about deciding what counts as fresh — caching was easy, deciding when cached data is too old and refreshing it without making the user wait took more thought. And test on real devices: some bugs only exist on a phone.",
    image: {
      src: "/projects/dexplorer.jpg",
      alt: "Homepage hero of the Dexplorer website",
    },
    ogImage: {
      src: "/projects/dexplorer/og-image.png",
      alt: "Dexplorer app: the Pokédex list and Charizard's detail screen on two phones",
    },
    liveUrl: "https://armstrong-aisosa.github.io/pokedex-mobile/",
    repoUrl: "https://github.com/ARMSTRONG-AISOSA/pokedex-mobile",
    downloadUrl:
      "https://github.com/ARMSTRONG-AISOSA/pokedex-mobile/releases/latest/download/dexplorer-arm64.apk",
    releasesUrl: "https://github.com/ARMSTRONG-AISOSA/pokedex-mobile/releases",
    disclaimer:
      "Unofficial fan project, not affiliated with or endorsed by Nintendo, Game Freak, Creatures or The Pokémon Company. Pokémon data from PokéAPI.",
  },
  {
    slug: "casual-kitchen-express",
    name: "Casual Kitchen Express",
    shortDescription:
      "A complete food delivery platform for a Nigerian kitchen: customer, rider and kitchen Android apps, a serverless API with live updates, and a website, built and released in eight days on free plans.",
    featured: true,
    role: "Product owner, designer and sole developer: planning, brand and UX design, all three apps, the API, the website, real-device testing and the releases. Built using an AI-assisted workflow (Claude Code).",
    techStack: [
      "React Native 0.88",
      "Expo SDK 58",
      "Expo Router",
      "TypeScript",
      "TanStack Query",
      "MapLibre",
      "Hono",
      "Cloudflare Workers",
      "Durable Objects",
      "Workers KV",
      "Neon Postgres",
      "Drizzle ORM",
      "Better Auth",
      "Firebase Cloud Messaging",
      "Turborepo",
      "Vitest",
      "Playwright",
      "GitHub Actions",
      "GitHub Pages",
    ],
    problem: [
      "A food delivery business is really several businesses that have to agree with each other second by second. Customers want to order in a few taps and see exactly where their food is. Riders need to carry orders efficiently without their phone dying halfway through a shift. The kitchen needs one place to see what's coming in, take walk-in orders at the counter, send riders out, manage the menu and staff, and account for every naira at the end of the day. Each group needs its own app, and all of them have to agree about the same order at the same moment.",
      'Casual Kitchen Express (CKE) is a portfolio concept I designed so I could build all of that end to end: a home-style Nigerian kitchen in Ugbowo, Benin City, near the University of Benin, delivering from Uselu to Oluku Market under the slogan "Tastes like home. Arrives fast." I wrote the brand and business foundation first, and the setting brought real constraints with it: budget Android phones, unreliable and expensive mobile data, riders on long shifts in the sun, and streets where an address is often a landmark rather than a number.',
      "There was also no budget. Everything had to run on free plans: a serverless API limited to about 10 ms of CPU per request, daily caps on requests and database queries, and no card on file anywhere, so a public demo could never generate a bill. It also had to be safe to show to anyone. Payments, refunds, deliveries and rider payouts are simulated, and no real card details are ever collected.",
    ].join("\n\n"),
    goals: [
      "Customers should order in as few taps as possible on everyday Android phones, without creating an account until checkout, and see the order's progress and the rider's position live.",
      "Riders should carry orders efficiently, up to three at once when they fit, without the app draining the battery or heating the phone over a long shift.",
      "The kitchen and the office should run the whole day from one app on a tablet or phone: the order board, walk-ins at the counter, dispatch, the menu, staff, reports, rider pay and the daily cash-up, with each staff role seeing only what it needs.",
      "The platform should cost nothing to run, be safe to demonstrate in public, and be documented and tested like a real product: every feature has an ID, every decision is written down, and every release is checked on real devices before it ships.",
    ].join("\n\n"),
    solution: [
      "Casual Kitchen Express is three Android apps, one API and a promotional website, all in a single TypeScript monorepo and all open source under the MIT licence. The apps install free from GitHub Releases on Android 10 or newer.",
      "CKE, the customer app, lets anyone browse the menu without an account, where a daily soup of the day changes what the soup dishes include. Checkout is one screen, with Google sign-in only at the moment it's needed. Delivery addresses use a dropped pin, checked against a delivery boundary drawn from real map points. After a simulated payment, the customer follows the order through every stage (placed, cooking, ready, picked up, arriving, delivered) with push notifications at each step and a live map showing the kitchen, the address and the rider's marker once the food is picked up. A 4-digit delivery code closes the order, and a past order can be repeated in two taps.",
      "CKE Rider lets a rider go online and take orders from a shared queue, where the first rider to accept wins. A rider can carry up to three orders when their combined load fits a capacity budget. The app has no map of its own: it hands each address to the phone's navigation app, and shares its location only while carrying an order, as an Android foreground service with a visible \"Delivery in progress\" notification. A geofence about 300 metres from the door tells the customer the rider is arriving, and the rider confirms the delivery with the customer's code. An earnings screen shows deliveries, amounts owed and amounts paid.",
      "CKE Kitchen is the business app, for tablets and phones, with five staff roles: kitchen staff, dispatch officers, account officers, managers and the owner. The kitchen gets the order board with a new-order chime, walk-in orders paid in cash or online, sold-out switches and the soup of the day. Dispatch assigns riders and sees timed alerts for orders that wait too long. Managers get a dashboard, orders, riders, staff accounts and roles, the menu with photo upload and compression, sales, area, rider and refund reports, rider pay, Finance (the daily cash-up and the monthly close), settings for hours, capacity, tracking and the delivery boundary, a guided tour, and demo controls for practice orders and a full reset.",
      "Behind all three sits one API of about 40 route groups on Cloudflare Workers, covering sign-in and roles, the menu, orders, refunds, riders, alerts, live updates, push notifications, photos, reports, finance and the demo tools. The website, on GitHub Pages, presents the brand, the menu, the delivery area, an FAQ, privacy pages and the customer app download, with structured data and light and dark themes.",
    ].join("\n\n"),
    highlights: [
      "Planned, prototyped and built in eight days: clickable prototypes on 11 November 2026, release 1.0.0 on day 8, then 1.0.1 and 1.0.2 by 19 November. 129 feature IDs, about 35,000 lines of TypeScript, HTML and CSS, and 68 commits.",
      "Live updates with no polling: a Durable Object holds every app's WebSocket and sends each changed record once. Idle connections hibernate, and a reconnecting app catches up with one `GET /changes?since=N` call.",
      "Password hashing measured to fit Cloudflare's 10 ms CPU budget: PBKDF2 through the native Web Crypto API at 30,000 iterations (about 5 ms median on the project's own account), plus rate limiting.",
      "A rider app built for battery life: no map, balanced-accuracy location only while carrying an order, and a geofence for arrival. A two-hour delivery test used about 0.5% of the battery an hour, against a target of 10%.",
      "The delivery code is never stored. It's derived from the order with a keyed hash (HMAC-SHA-256), and only a hash of it is saved to check what the rider types.",
      "Tested on a budget tablet (Unisoc T310, 4 GB): no memory leaks across all three apps, 104 to 154 MB per app, 9 to 14% of one core in use and 0% in the background, all 60 colour pairs passing contrast, plus 45 API tests and 27 website tests.",
      "Every release ships three signed APKs with SHA-256 checksums, and the apps tell people when a new version is out.",
    ],
    screenshotGroups: [
      {
        title: "CKE (customer app)",
        caption:
          "Browse, order and follow the food. On the test tablet, in portrait.",
        shots: [
          {
            src: "/projects/casual-kitchen-express/customer-menu.webp",
            alt: "Customer app menu: the slogan banner, menu search, category filters and rice meals with photos and prices in naira",
            width: 800,
            height: 1280,
          },
          {
            src: "/projects/casual-kitchen-express/customer-cart.webp",
            alt: "Your order screen with delivery or pickup, item quantities, food total, delivery fee and Go to checkout",
            width: 800,
            height: 1280,
          },
          {
            src: "/projects/casual-kitchen-express/customer-checkout.webp",
            alt: "One-screen checkout: signed-in customer, delivery address, payment method with a demo-payment notice, and the total to pay",
            width: 800,
            height: 1280,
          },
          {
            src: "/projects/casual-kitchen-express/customer-profile.webp",
            alt: "Customer profile with photo upload, name, gender, saved addresses and the light, dark or follow-phone theme choice",
            width: 800,
            height: 1280,
          },
        ],
      },
      {
        title: "CKE Rider",
        caption:
          "Go online, take orders and track earnings. On the test tablet, in portrait.",
        shots: [
          {
            src: "/projects/casual-kitchen-express/rider-home.webp",
            alt: "Rider home screen showing the rider online, deliveries and earnings today, and carrying 0 of 3 orders",
            width: 800,
            height: 1280,
          },
          {
            src: "/projects/casual-kitchen-express/rider-earnings.webp",
            alt: "Rider earnings for the week: deliveries, amount earned and owed, and a day-by-day breakdown",
            width: 800,
            height: 1280,
          },
          {
            src: "/projects/casual-kitchen-express/rider-profile.webp",
            alt: "Rider profile for a demo rider with staff ID, job title and phone, editable only by a manager",
            width: 800,
            height: 1280,
          },
        ],
      },
      {
        title: "CKE Kitchen (business app)",
        caption: "The manager's view on the test tablet, with demo data.",
        shots: [
          {
            src: "/projects/casual-kitchen-express/kitchen-board.webp",
            alt: "Kitchen order board with New, Preparing and Ready columns, the Taking orders switch and the manager's side menu",
            width: 1280,
            height: 800,
          },
          {
            src: "/projects/casual-kitchen-express/kitchen-walk-in.webp",
            alt: "New walk-in order: menu categories, dishes with prices, and the order panel with take away or eat in",
            width: 1280,
            height: 800,
          },
          {
            src: "/projects/casual-kitchen-express/kitchen-reports.webp",
            alt: "Reports screen with sales, average order and refunds, and a sales-per-day bar chart",
            width: 1280,
            height: 800,
          },
          {
            src: "/projects/casual-kitchen-express/kitchen-finance.webp",
            alt: "Finance statement for November 2026: online and walk-in sales, delivery fees and order count, with cash-up, audit trail and close month tabs",
            width: 1280,
            height: 800,
          },
          {
            src: "/projects/casual-kitchen-express/kitchen-settings.webp",
            alt: "Settings screen with opening hours for online orders and walk-ins, a pause switch and alert sounds",
            width: 1280,
            height: 800,
          },
        ],
      },
    ],
    architecture: [
      "One API is the single source of truth, and the clients never talk to each other directly. The three apps reach a Hono API on Cloudflare Workers over HTTPS for requests and WebSockets for live updates. Behind the API, Neon Postgres holds the data (reached through Cloudflare Hyperdrive), a Durable Object called `LiveHub` holds every live connection, Workers KV stores menu and staff photos as WebP, and Expo's push service delivers notifications through Firebase Cloud Messaging. Better Auth runs inside the Worker, so sign-in needs no separate service.",
      "Everything lives in one TypeScript monorepo (npm workspaces and Turborepo): the customer, rider and business apps, the API and the website, plus shared packages for types, validation schemas, a typed API client and brand tokens. Because the apps and the API share those packages, a change to an order's shape is type-checked in every app at once rather than discovered at runtime.",
      "An order is always saved to the database first and pushed second. The kitchen also gets a push notification for each new order, so it's alerted even if its live connection dropped. Each status is pushed exactly once: the order remembers the last status it notified, so a retried request never repeats a notification.",
      "Access control lives in the API, not in database rules. There are six roles (customer, rider, kitchen staff, dispatch officer, account officer and manager), and every endpoint checks the caller's role and ownership of the data, because hiding a screen in an app isn't protection. Money actions, account changes, manual overrides and taps on a customer's phone number are all written to an audit log.",
      "Outside the API, the website is static on GitHub Pages, signed APKs are published on GitHub Releases, and GitHub Actions both deploys the website and re-seeds the online demo database when a manager asks for a reset from the business app.",
    ].join("\n\n"),
    frontend: [
      "All three apps are React Native 0.88 on Expo SDK 58, with file-based routes in Expo Router and server data in TanStack Query. Each kind of data gets its own freshness time, so stable data such as the menu isn't fetched again just because a screen reopens, and the apps refetch when they reconnect or return to the foreground, never on a timer. Custom Expo config plugins handle release signing from keys kept outside the repository, and the processor targets (64-bit ARM for development, plus 32-bit ARM for release).",
      "The customer app is built around fewest taps. The menu works without an account, and Google sign-in happens only at checkout, through Better Auth's browser flow returning to the app by its link scheme. The tracking map uses MapLibre with OpenFreeMap tiles, which need no account, key or card. Instead of an address search, which would mean geocoding costs and works poorly where street addresses are unreliable, the customer picks a neighbourhood in the delivery range, drops a pin and adds a landmark. The API then checks the pin against a 14-corner boundary polygon.",
      "The rider app is deliberately plain: high-contrast screens readable in sunlight, no images or animations, and no map. Location runs at balanced accuracy, about every 45 seconds and only after the rider has moved about 100 metres, slowing further on battery saver. The screen stays awake only on the pickup and code-entry screens. When the rider switches to their navigation app, the CKE app keeps sharing through a foreground service and stops when the last delivery is done.",
      "The business app adapts to tablets and phones. Its side menu shows each staff role only its own screens; the board chimes for new orders; the walk-in screen works out change for cash payments; and Reports and Finance draw their charts and statements from the API. A guided tour walks managers through every screen. On narrow phones the top bar splits into two rows and hides the clock at 425 dp or less, while tablets keep the single-row layout.",
      "Photos are compressed on the phone before upload in every app: cropped to a fixed ratio, resized to at most 1200 px for menu images or 512 px for profile photos, converted to WebP at about quality 78, and stripped of location and camera data, with a preview of the space saved. Every app has light and dark themes, and all 60 text and colour pairs were measured to pass contrast. Each app checks GitHub's latest release once after opening and offers the update when there is one.",
    ].join("\n\n"),
    backend: [
      "The API is Hono on Cloudflare Workers, with about 40 route groups: sign-in and roles, the menu and soups, checkout and orders, cancellations and refunds, riders and the queue, alerts, settings, addresses, live updates, push, photos, reports, finance and the demo tools. It runs at Cloudflare's edge with no server to manage, inside the free plan's limits.",
      "Those limits shaped the code. With about 10 ms of CPU per request, reports and aggregations run as SQL inside Postgres rather than in the Worker, images are never processed on the server, and handlers stay light. Workers also allow 100,000 requests a day, so I estimated a busy demo day (about 200 orders at about 40 requests each, plus browsing and rider updates) at around 10,000 requests and 30,000 database queries, comfortably inside the limits.",
      "Business rules live on the server. Checkout prices every order from the current menu, never from what the app sends, and checks the opening hours, the pause switch and whether the address is inside the delivery boundary. Each kitchen step includes the expected status in the update itself, so two taps at once can't both succeed. When two riders accept the same order, the order row is locked first, so one wins and the other is told it's gone. A timed check runs every minute while orders are open and raises alerts for orders waiting too long. Refunds can be full or partial (up to 99% of what was paid), and customers who cancel repeatedly within seven days can only request cancellations, which a dispatcher or manager decides.",
      "Data freshness was designed to keep calls low. One start-up call, `GET /bootstrap`, returns the menu and customer-facing settings with a catalog version as an ETag, so an unchanged menu comes back as a tiny 304. Orders, alerts and rider states share one change counter, so a reconnecting app asks for everything since the last number it saw in a single call. Writes return the updated record, so no follow-up read is needed, and long lists are paged 150 at a time.",
      "To make the demo believable, seed scripts create three months of order history (about 4,266 orders), a live simulator places orders, and managers can create practice orders or reset all demo data from the business app. The online reset needs the seed scripts, which can't run inside a Worker, so the API starts a GitHub Actions workflow using a fine-grained token limited to that one repository. A reset takes about two minutes.",
    ].join("\n\n"),
    database: [
      "Neon Postgres, chosen after comparing it with Supabase and Firebase on their November 2026 free plans. Orders and money are relational data, and manager reports need grouping, joins and date ranges, which SQL does natively. Firebase's per-operation billing and the billing account its file storage now requires ruled it out. Supabase would have bundled auth and real-time, but its free projects pause after a week of inactivity. Neon is only the database, so authentication, real-time and storage were chosen separately.",
      "The schema is written in TypeScript with Drizzle ORM, and Better Auth's user and session tables live in the same schema as the app's own. The project has 10 versioned SQL migrations, all kept in Git. The Worker connects through Cloudflare Hyperdrive for pooled connections from the edge. Hyperdrive caches query results by default, and that caching was turned off so a live order is never served stale.",
      "Every order records its channel. Online orders are numbered continuously (O-0001, O-0002 and so on), while walk-in numbers restart at W-001 each day, because they're called out at the counter. Order lines keep the dish name and price at the time of the order, and every status change is stored with who made it and when, which makes the timing reports possible: preparation time, wait for a rider and delivery time. Payments, refunds, rider payouts, daily cash-ups and monthly closes all have their own tables, a closed month can't be edited, and the audit log keeps before and after values for every money and setting change.",
      "Privacy was designed in rather than added. The rider's position is kept only as the last point and only while an order is on the way, and it's deleted at the last delivery. The delivery code is stored only as a hash, and staff passwords are hashed with PBKDF2 and rate-limited. Staff accounts are deactivated, never deleted, so order history and reports stay accurate. Seeded customers and staff are fake, with emails on a reserved example domain, so nothing can ever reach a real person. Photos live in Workers KV, with only their references in the database.",
    ].join("\n\n"),
    challenges: [
      "Hashing passwords inside a 10 ms CPU budget. Riders and other staff sign in with usernames and passwords, but bcrypt and scrypt take 70 ms or more, far over the Workers free plan's roughly 10 ms per request. PBKDF2 through the native Web Crypto API was the workable option, so I measured it on the project's own Cloudflare account: 20,000 iterations took a median of 4 ms, 30,000 took 5 ms, 50,000 took 9.5 ms, and 100,000 reached 34 ms. I chose 30,000, which leaves room under the limit for the rest of the sign-in request, and added rate limiting through a Durable Object. That's weaker than the usual recommendation, which is acceptable here because these accounts guard only simulated data, and the trade-off is written down.",
      "The business app slowed the tablet down. After a tour of the app, the budget tablet was nearly out of memory, with about 80 MB free and the business app at 735 MB. The cause was navigation: every tap on the side menu added a new screen on top of the stack, so every screen visited stayed alive with its photos and charts. A small navigation helper now replaces the screen instead of stacking it. Memory growth per tour fell from 98 MB to 11 MB once warm. The customer and rider apps had a smaller version of the same problem, where returning to the tabs opened a whole new set of tabs (54 MB and 14 back presses after six trips in one case), and both were fixed the same day. Later checks on the release builds found no leaks.",
      "The customer's map froze for the last 300 metres. An end-to-end test of one order through all three apps showed that the rider app stopped sending its position once an order was \"arriving\", so the customer's map stood still at the most important moment. Sharing now continues until the last delivery, and only the arrival geofences skip arriving orders. Fixed in release 1.0.1, along with a sign-in screen where the keyboard covered the button and its error message.",
      "The top bar didn't fit on a narrow phone. On a Samsung Galaxy A07, about 384 dp wide, the business app's top bar pushed the profile photo and \"Switch person\" off the screen, and Android's navigation buttons covered the bottom of the content. On phones the bar now uses two rows, the clock is hidden only at 425 dp or narrower, and content stops above the navigation buttons, while tablets are unchanged. Fixed in release 1.0.2.",
      "Testing battery life without leaving home. The two-hour rider battery test ran on the tablet with Android test locations moved along a route at 30 km/h by a script, which also sampled the battery every minute and checked that each position reached the server. At the end I moved the location to the door to confirm the arrival alert, and entered the code to confirm the delivery.",
      "Release builds on a 2014 laptop, through a power cut. A release build takes 30 to 60 minutes per app on this machine, and a power cut stopped one mid-build. The database came back intact (all 4,274 orders at the time), and I made the release script resumable: it keeps any APK already built from the same code, so a rerun builds only what's missing. Development builds target only 64-bit ARM to keep everyday builds shorter.",
      "Google couldn't fetch the sitemap. Search Console reported \"Couldn't fetch\" for the sitemap on GitHub Pages, even though the file returned 200 and Bing read it fine. Research showed this is a widely reported github.io problem that doesn't stop indexing, so I requested indexing for each page by hand and improved the titles, descriptions and structured data for local search.",
      "Smaller walls: photos moved from R2 to Workers KV so storage needs no card on file; Wrangler needed Node's network family timeout raised before it could reach Cloudflare from this laptop; four npm audit advisories in laptop-only build tools had no safe upgrade yet, so they were recorded and left for a later version; and a GitGuardian alert led to a check of the whole Git history, which found no real secret, only values that are public on purpose, such as the shared demo staff password.",
    ].join("\n\n"),
    technicalDecisions: [
      "A TypeScript monorepo, so the apps and the API share types, validation schemas and one API client. Expo and React Native, for native Android apps from one language, with config plugins for signing and processor targets. Hono on Cloudflare Workers for a fast, free, global API with no server to manage. It replaced an earlier Fastify plan that suited a Node server but not Workers, and because Hono also runs on Node, the API could move hosts later without a rewrite.",
      "Durable Objects for live updates, because WebSockets with hibernation mean no polling and idle connections cost almost nothing against the daily request limit. Neon Postgres through Hyperdrive with Drizzle, for a real relational database for orders and money, pooled connections from the edge, and migrations in Git.",
      "Better Auth for one sign-in system with roles: Google for customers and managers, usernames and passwords for the other staff. Google sign-in also means no forgot-password flow, so the platform sends no email at all. That matters because free email services need a verified domain to reach other people, and this project has none. Staff passwords are reset by a manager instead.",
      "No map in the rider app, because maps and high-accuracy GPS are among the most battery-hungry things a phone does, and riders already use a navigation app. MapLibre with OpenFreeMap for the customer's map, because it needs no account, key or card, so a public demo can't generate a bill. Google Maps would be the choice if richer place search ever mattered more than cost.",
      "APKs on GitHub Releases instead of the Play Store: no store fees or review delays, a check for the latest release in each app, and SHA-256 checksums for anyone who wants to verify a download. Payments, refunds and payouts are simulated throughout, with real statuses, rules and records but no provider, so no card details exist anywhere in the system.",
      "Written decisions before code. An architecture document gives every feature an ID (CUS, RID, KIT, MGR, DSP, ACC and WEB), marks each decision as Proposal or Decided, and records the reasons. A design document and clickable HTML prototypes of every screen came before the apps, and a dated progress log kept the build consistent across many sessions.",
    ].join("\n\n"),
    results: [
      "Release 1.0.0 shipped on 18 November 2026, followed by 1.0.1 the same day (the frozen-map and keyboard fixes) and 1.0.2 on 19 November (the narrow-phone top bar). Each release has three signed APKs and SHA-256 checksums, and an update installs over the previous version without signing anyone out. The update notice was verified on the tablet: every 1.0.1 app announced 1.0.2.",
      "Every release was tested on real devices, a budget tablet (Unisoc T310, 4 GB of memory, Android 12) and a Samsung Galaxy A07. On release 1.0.1, about 40 minutes of tapping through every screen of all three apps showed no memory leaks, with memory levelling off at 104 to 154 MB per app. The apps used 9 to 14% of one processor core in use and 0% in the background, screens drew in 12 to 16 ms, and taps responded well within 100 ms. Release 1.0.2 was checked again with the same results.",
      "An end-to-end test took one order through all three apps: placed and paid, acknowledged and cooked, accepted and picked up, followed live on the map, refused once with a wrong code, and delivered with the right one, with every push notification arriving. In the two-hour rider battery test, the tablet went from 100% to 99% with the screen off, about 0.5% an hour for the whole device, and ended cooler than it started. The rider app itself used about 1 mAh an hour. The movement was simulated over Wi-Fi, so a real phone on a real shift will use more, an estimated 1 to 2% an hour, still far under the 10% target.",
      "The codebase has 45 API tests running against a real Postgres database and 27 website tests in Playwright, all passing. The API's health check is live, and the website is verified in Google Search Console and Bing Webmaster Tools. The platform is complete and no new features are planned. The remaining upkeep is timing the cold start over mobile data on a real phone, re-checking the build-tool advisories before any future release, and following up search indexing.",
    ].join("\n\n"),
    lessonsLearned: [
      "Writing decisions down pays off. Feature IDs, decisions marked Proposal or Decided, and a dated progress log kept a build this size consistent across many sessions, and made every change traceable back to why it was made.",
      "Free plans shape the architecture as much as the features do. The CPU limit decided how passwords are hashed, the request limit decided how live updates work, and storage rules decided where photos live. Knowing the limits before choosing the tools saved rewrites later.",
      "Test on the cheapest devices first. A budget tablet and a narrow phone found real problems that a fast phone would have hidden: memory build-up, a frozen map and an overflowing top bar.",
      "Measure, don't guess. Hashing time, memory, CPU, frame times and battery drain were all measured before being called good enough. Several of those measurements changed a decision, the hashing iterations most clearly.",
    ].join("\n\n"),
    image: {
      src: "/projects/casual-kitchen-express.jpg",
      alt: "Homepage hero of the Casual Kitchen Express website: Tastes like home. Arrives fast.",
    },
    liveUrl: "https://armstrong-aisosa.github.io/casual-kitchen-express/",
    repoUrl: "https://github.com/ARMSTRONG-AISOSA/casual-kitchen-express",
    // Release asset names include the version, so a `releases/latest/
    // download/<file>` link can't exist. These point at the current
    // release and are updated when a new one ships (owner decision,
    // 2026-11-20; projects-specification.md §4.5).
    downloadUrl:
      "https://github.com/ARMSTRONG-AISOSA/casual-kitchen-express/releases/download/v1.0.2/cke-customer-1.0.2.apk",
    downloads: [
      {
        label: "Download CKE",
        url: "https://github.com/ARMSTRONG-AISOSA/casual-kitchen-express/releases/download/v1.0.2/cke-customer-1.0.2.apk",
      },
      {
        label: "Download CKE Rider",
        url: "https://github.com/ARMSTRONG-AISOSA/casual-kitchen-express/releases/download/v1.0.2/cke-rider-1.0.2.apk",
      },
      {
        label: "Download CKE Kitchen",
        url: "https://github.com/ARMSTRONG-AISOSA/casual-kitchen-express/releases/download/v1.0.2/cke-business-1.0.2.apk",
      },
    ],
    releasesUrl:
      "https://github.com/ARMSTRONG-AISOSA/casual-kitchen-express/releases",
    disclaimer:
      "Casual Kitchen Express is a portfolio concept: the brand, menu and business were designed for this project. Payments, refunds, deliveries and rider payouts are simulated; no real money moves and no card details are collected. The code is MIT-licensed; the CKE name and logo are not part of that grant. Menu photo credits are in the project's repository.",
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
