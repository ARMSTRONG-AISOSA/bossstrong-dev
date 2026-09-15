// Single source of truth for site-wide SEO identity (seo-specification.md).
// No custom domain has been purchased — SITE_URL is Vercel's confirmed free
// subdomain (CLAUDE.md §2, seo-specification.md header). If a domain is
// bought later, this is the one place that needs updating (plus the Resend
// setup per backend-specification.md §6.4 — see seo-specification.md §12.8).
export const SITE_URL = "https://bossstrong-dev.vercel.app";
export const SITE_NAME = "bossstrong-dev";
export const DEVELOPER_NAME = "Armstrong Omoregie";
export const DEVELOPER_TITLE = "Full-Stack Developer";
export const DEFAULT_TITLE = `${DEVELOPER_NAME} — ${DEVELOPER_TITLE}`;
export const DEFAULT_DESCRIPTION =
  "Full-stack developer portfolio for Armstrong Omoregie — projects, engineering writing, and background across React, Next.js, and Supabase/PostgreSQL.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;
