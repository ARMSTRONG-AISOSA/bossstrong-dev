import Link from "next/link";
import { PublicShell } from "@/components/shared/public-shell";
import { getResumeUrl } from "@/lib/resume-status";

// error-pages-specification.md §2: plain statement, one clear way back,
// no search bar, no "related pages" grid, same design tokens as every
// other page. Also what a guessed draft-post slug resolves to (Draft
// Visibility Rule, blog-admin-specification.md §5).
//
// Rendered outside app/(public), so it wraps itself in PublicShell directly
// rather than inheriting it from a layout (ui-design-system-specification.md
// §9 — admin never gets this shell, but this page always should).
export default async function NotFound() {
  const resumeUrl = await getResumeUrl();
  return (
    <PublicShell resumeUrl={resumeUrl}>
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <p className="text-small font-medium text-text-secondary">404</p>
        <h1 className="text-h1 font-semibold text-text-primary">
          Page not found
        </h1>
        <p className="text-body text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-primary px-6 py-3 text-small font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Back to Home
          </Link>
          <Link
            href="/blog"
            className="rounded-full border px-6 py-3 text-small font-medium text-text-primary transition-colors hover:bg-surface-alt"
          >
            Read the Blog
          </Link>
        </div>
      </main>
    </PublicShell>
  );
}
