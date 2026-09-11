import type { ReactNode } from "react";
import { SiteNav } from "@/components/shared/site-nav";
import { SiteFooter } from "@/components/shared/site-footer";

// The public marketing chrome (nav + footer) — everything under app/(public)
// uses this via its layout, and the two root-level error boundaries
// (not-found.tsx, error.tsx) apply it directly, since they render outside
// any route group and would otherwise lose it entirely (ui-design-system-
// specification.md §9 / CLAUDE.md rule 11 — admin never gets this shell).
//
// resumeUrl is fetched server-side by each caller (a Server Component) and
// passed down, since this component itself must stay a plain sync component
// to be renderable from error.tsx, which is a required Client Component and
// can't render an async Server Component directly. Callers that can't fetch
// it (error.tsx) omit the prop and get the honest "not available" fallback.
export function PublicShell({
  children,
  resumeUrl = null,
}: {
  children: ReactNode;
  resumeUrl?: string | null;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav resumeUrl={resumeUrl} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
