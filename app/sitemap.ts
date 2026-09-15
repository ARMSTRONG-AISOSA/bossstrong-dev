import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { projects } from "@/lib/data/projects";
import { SITE_URL } from "@/lib/site-config";

// seo-specification.md §6. Static routes are the ones the spec names
// explicitly (Home, About, Projects, Contact, Blog listing); Privacy is
// included too since it's a real, indexable, un-disallowed route — omitting
// it from the sitemap while leaving it fully crawlable would work against
// §1's own "fully crawlable, correctly indexed" goal, not toward it.
const STATIC_PATHS = [
  "/",
  "/about",
  "/projects",
  "/contact",
  "/blog",
  "/privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  // Same published-only filter RLS already enforces — never a separate
  // query that could drift from the Draft Visibility Rule.
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("status", "published");

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
  }));

  const postEntries: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    // Postgres returns microsecond precision + a "+00:00" offset
    // (e.g. "2026-09-15T20:54:34.732206+00:00") — passed through as-is,
    // Next.js writes that raw string into <lastmod> unchanged, which isn't
    // the millisecond-precision "Z"-suffixed W3C-DTF form most sitemap
    // parsers expect. Normalize via toISOString() instead.
    lastModified: new Date(post.updated_at).toISOString(),
  }));

  return [...staticEntries, ...projectEntries, ...postEntries];
}
