import { Award, ExternalLink } from "lucide-react";
import type { Certification } from "@/lib/data/certifications";

// about-specification.md §4.7: name, issuer, date, and a link to the
// credential. Same card surface/hover as ProjectCard so it reads as part of
// the same system.
export function CertificationCard({
  certification,
}: {
  certification: Certification;
}) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent">
      <Award className="h-6 w-6 text-accent-text" aria-hidden="true" />
      <p className="mt-1 font-semibold text-text-primary">
        {certification.name}
      </p>
      <p className="text-small text-text-secondary">{certification.issuer}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
        <span className="text-tiny text-text-secondary">
          {certification.date}
        </span>
        {certification.url ? (
          <a
            href={certification.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-small font-medium text-accent-text underline underline-offset-2"
          >
            View credential
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">
              {" "}
              for {certification.name} (opens in a new tab)
            </span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
