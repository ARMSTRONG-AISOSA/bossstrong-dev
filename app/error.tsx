"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/shared/public-shell";

// error-pages-specification.md §3: honest statement, link home, and —
// critically — never render the raw error/stack trace to the visitor.
// error.tsx must be a Client Component per the Next.js App Router convention.
//
// Rendered outside app/(public), so it wraps itself in PublicShell directly
// rather than inheriting it from a layout (ui-design-system-specification.md
// §9 — admin never gets this shell, but this page always should).
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for diagnostics only — never surfaced in the rendered page.
    console.error(error);
  }, [error]);

  return (
    <PublicShell>
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <p className="text-small font-medium text-text-secondary">500</p>
        <h1 className="text-h1 font-semibold text-text-primary">
          Something went wrong
        </h1>
        <p className="text-body text-text-secondary">
          This isn&apos;t something you did — an unexpected error occurred on
          our end.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-primary px-6 py-3 text-small font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-full border px-6 py-3 text-small font-medium text-text-primary transition-colors hover:bg-surface-alt"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </PublicShell>
  );
}
