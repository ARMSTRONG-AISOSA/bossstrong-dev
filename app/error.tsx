"use client";

import { useEffect } from "react";
import Link from "next/link";

// error-pages-specification.md §3: honest statement, link home, and —
// critically — never render the raw error/stack trace to the visitor.
// error.tsx must be a Client Component per the Next.js App Router convention.
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
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p className="text-small font-medium text-text-secondary">500</p>
      <h1 className="text-h1 font-semibold text-text-primary">
        Something went wrong
      </h1>
      <p className="text-body text-text-secondary">
        This isn&apos;t something you did — an unexpected error occurred on our
        end.
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
  );
}
