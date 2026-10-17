"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CertificationCard } from "@/components/about/certification-card";
import type { Certification } from "@/lib/data/certifications";

const INITIAL_COUNT = 6;

// about-specification.md §4.7: first 6 cards, the rest behind a "Show all"
// toggle. The toggle is only rendered when there's something to reveal.
export function CertificationGrid({
  certifications,
}: {
  certifications: Certification[];
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = certifications.length > INITIAL_COUNT;
  const visible = expanded
    ? certifications
    : certifications.slice(0, INITIAL_COUNT);

  return (
    <>
      <div id="certification-grid" className="mt-3 grid gap-4 sm:grid-cols-2">
        {visible.map((certification) => (
          <CertificationCard
            key={certification.name}
            certification={certification}
          />
        ))}
      </div>
      {hasMore ? (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="certification-grid"
          onClick={() => setExpanded((value) => !value)}
          className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border px-4 text-small font-medium text-text-primary transition-colors hover:bg-surface-alt"
        >
          {expanded ? "Show fewer" : `Show all (${certifications.length})`}
          {expanded ? (
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      ) : null}
    </>
  );
}
