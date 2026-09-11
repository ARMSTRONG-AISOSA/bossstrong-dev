import type { Metadata } from "next";
import Link from "next/link";
import { getResumeUrl } from "@/lib/resume-status";

export const metadata: Metadata = {
  title: "About",
};

// about-specification.md §3-4. Real experience/history is placeholder text
// until supplied — never invented (§7, Claude Instructions #3).
export default async function AboutPage() {
  const resumeUrl = await getResumeUrl();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <section>
        <h1 className="text-h1 font-semibold text-text-primary">About</h1>
        <p className="mt-4 text-body-lg text-text-secondary">
          [A fuller introduction goes here — who you are, your current
          positioning as a full-stack developer / software engineer, and the
          kinds of problems or products you&apos;re interested in building.]
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-h2 font-semibold text-text-primary">My Journey</h2>
        <p className="mt-3 text-body text-text-secondary">
          [The path into development and the shift toward full-stack engineering
          specifically — key turning points, and how your interests evolved over
          time.]
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-h2 font-semibold text-text-primary">Experience</h2>
        <div className="mt-3 flex flex-col gap-4 text-body text-text-secondary">
          <div>
            <p className="font-medium text-text-primary">
              [Company Name — Role — Dates]
            </p>
            <p className="mt-1">
              [Core responsibilities and meaningful, truthful achievements from
              this role.]
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-h2 font-semibold text-text-primary">
          Engineering Philosophy
        </h2>
        <p className="mt-3 text-body text-text-secondary">
          [How you actually think about building software — problem-solving
          approach, attitude toward learning, views on maintainability and
          simplicity, and how technical decisions get made in practice.]
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-h2 font-semibold text-text-primary">
          Skills &amp; Technologies
        </h2>
        <dl className="mt-3 flex flex-col gap-3 text-body">
          {[
            ["Languages", "TypeScript, JavaScript"],
            ["Frontend", "React, Next.js, Tailwind CSS"],
            ["Backend", "Next.js Server Actions, Supabase"],
            ["Databases", "PostgreSQL"],
            ["DevOps / Deployment", "Vercel, GitHub Actions"],
            ["Tools", "Git, GitHub"],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col sm:flex-row sm:gap-3">
              <dt className="w-40 shrink-0 font-medium text-text-primary">
                {label}
              </dt>
              <dd className="text-text-secondary">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8">
        {resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-primary px-6 py-3 text-small font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Download Resume
          </a>
        ) : (
          <span
            aria-disabled="true"
            title="Resume not available yet"
            className="cursor-not-allowed rounded-full border border-border px-6 py-3 text-small font-medium text-text-secondary opacity-50"
          >
            Resume not available yet
          </span>
        )}
        <Link
          href="/projects"
          className="rounded-full border border-border px-6 py-3 text-small font-medium text-text-primary transition-colors hover:bg-surface-alt"
        >
          View Projects
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-border px-6 py-3 text-small font-medium text-text-primary transition-colors hover:bg-surface-alt"
        >
          Get in Touch
        </Link>
      </section>
    </main>
  );
}
