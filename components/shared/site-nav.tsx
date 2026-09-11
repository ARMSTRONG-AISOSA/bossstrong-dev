"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

// homepage-specification.md §4.1 nav content: identity, Home, About, Projects,
// Blog, Contact, Resume/CV action. No bio, skill lists, or long CTAs here.
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav({ resumeUrl }: { resumeUrl: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-h3 font-semibold text-text-primary"
        >
          bossstrong-dev
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-small font-medium text-text-secondary transition-colors hover:bg-surface-alt hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <ResumeAction resumeUrl={resumeUrl} />
          <ThemeToggle />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text-primary sm:hidden"
        >
          {open ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="flex flex-col gap-1 border-t px-6 py-4 sm:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-full px-4 py-3 text-body font-medium text-text-secondary transition-colors hover:bg-surface-alt hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center justify-between px-4">
            <ResumeAction resumeUrl={resumeUrl} />
            <ThemeToggle />
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function ResumeAction({ resumeUrl }: { resumeUrl: string | null }) {
  // Backed by a real Supabase Storage check (lib/resume-status.ts) now that
  // Phase 2/4.7 exist. Honest "not available" fallback when nothing has been
  // uploaded yet (backend-specification.md §5.2 / about-specification.md §4.6).
  if (!resumeUrl) {
    return (
      <span
        aria-disabled="true"
        title="Resume not available yet"
        className="cursor-not-allowed rounded-full border px-4 py-2 text-small font-medium text-text-secondary opacity-50"
      >
        Resume
      </span>
    );
  }

  return (
    <a
      href={resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border px-4 py-2 text-small font-medium text-text-primary transition-colors hover:bg-surface-alt"
    >
      Resume
    </a>
  );
}
