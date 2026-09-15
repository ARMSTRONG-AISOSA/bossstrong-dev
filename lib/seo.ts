import type { Metadata } from "next";
import {
  DEFAULT_OG_IMAGE,
  DEVELOPER_NAME,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site-config";

// Shared shape for every route's generateMetadata/metadata export
// (seo-specification.md §2-4). Keeps the OG/Twitter/canonical boilerplate in
// one place instead of repeating it per page.
export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt = SITE_NAME,
  type = "website",
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  absoluteTitle?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, alt: imageAlt }],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// Person schema (seo-specification.md §5) — placed once, on Home.
export function personJsonLd(sameAs: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: DEVELOPER_NAME,
    jobTitle: "Full-Stack Developer",
    url: SITE_URL,
    sameAs,
  };
}

// BlogPosting schema (seo-specification.md §5) — one per published article.
export function blogPostingJsonLd({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  image,
}: {
  headline: string;
  description: string;
  url: string;
  datePublished: string | null;
  dateModified: string | null;
  image?: string | null;
}) {
  const wasEdited =
    datePublished &&
    dateModified &&
    new Date(dateModified).getTime() - new Date(datePublished).getTime() > 1000;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    url,
    ...(datePublished ? { datePublished } : {}),
    ...(wasEdited ? { dateModified } : {}),
    ...(image ? { image } : {}),
    author: { "@type": "Person", name: DEVELOPER_NAME, url: SITE_URL },
  };
}
