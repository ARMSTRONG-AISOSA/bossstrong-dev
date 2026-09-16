import Link from "next/link";
import type { Category } from "@/types/category";

// blog-admin-specification.md §3.1: multi-select pills, OR logic, category
// only (no tags), plus a way to clear all filters. Only categories with
// >=1 published post are ever passed in (backend-specification.md note in
// §3.4) — pure navigation, filtering happens server-side against the
// already-published set, so no client state is needed here.
export function CategoryFilter({
  categories,
  selectedSlugs,
}: {
  categories: Category[];
  selectedSlugs: string[];
}) {
  const isAllSelected = selectedSlugs.length === 0;

  const hrefFor = (nextSlugs: string[]) =>
    nextSlugs.length === 0 ? "/blog" : `/blog?category=${nextSlugs.join(",")}`;

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="flex flex-wrap items-center gap-2"
    >
      <Link
        href="/blog"
        aria-pressed={isAllSelected}
        className={`inline-flex min-h-11 items-center rounded-full border px-4 text-small font-medium transition-colors ${
          isAllSelected
            ? "border-accent bg-accent/10 text-accent-text"
            : "border-border text-text-secondary hover:bg-surface-alt"
        }`}
      >
        All
      </Link>
      {categories.map((category) => {
        const isSelected = selectedSlugs.includes(category.slug);
        const nextSlugs = isSelected
          ? selectedSlugs.filter((slug) => slug !== category.slug)
          : [...selectedSlugs, category.slug];

        return (
          <Link
            key={category.id}
            href={hrefFor(nextSlugs)}
            aria-pressed={isSelected}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-small font-medium transition-colors ${
              isSelected
                ? "border-accent bg-accent/10 text-accent-text"
                : "border-border text-text-secondary hover:bg-surface-alt"
            }`}
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}
