"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// homepage-specification.md §4.10: identity, nav links, GitHub/LinkedIn,
// contact link, Privacy Policy link, copyright. No new content or CTAs.
const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

// LinkedIn: add once a real profile URL is supplied — no placeholder link,
// per the content-authenticity rules (never link to a guessed/fake URL).
const SOCIAL_LINKS = [
  { href: "https://github.com/ARMSTRONG-AISOSA", label: "GitHub" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-h3 font-semibold text-text-primary">
            bossstrong-dev
          </span>
          <p className="text-small text-text-secondary">
            Full-stack developer portfolio.
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-2 text-small"
        >
          {FOOTER_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "transition-colors hover:text-accent",
                  active ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <nav
          aria-label="Social"
          className="flex flex-wrap gap-x-6 gap-y-2 text-small"
        >
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-text-secondary transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="border-t px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-tiny text-text-secondary">
            © {year} bossstrong-dev. All rights reserved.
          </p>
          <Link
            href="/privacy"
            aria-current={isActive("/privacy") ? "page" : undefined}
            className={cn(
              "text-tiny underline-offset-4 transition-colors hover:text-accent hover:underline",
              isActive("/privacy")
                ? "text-text-primary"
                : "text-text-secondary",
            )}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
