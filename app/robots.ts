import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// seo-specification.md §7 — /admin disallowed here as the crawling-layer
// half of the belt-and-suspenders approach; the indexing-layer half is each
// /admin route's own `robots: { index: false, follow: false }` metadata.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
