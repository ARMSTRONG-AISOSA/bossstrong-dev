import Link from "next/link";
import { estimateReadTime } from "@/lib/utils/read-time";
import type { Category } from "@/types/category";
import type { Post } from "@/types/post";

// blog-admin-specification.md §3.1: title, excerpt, publish date, category,
// read time, link — never full bodies or draft posts. Two distinct empty
// states: nothing published yet vs. a filter with no matches.
export function ArticleList({
  posts,
  hasAnyPosts,
}: {
  posts: (Post & { categories: Category | null })[];
  hasAnyPosts: boolean;
}) {
  if (posts.length === 0) {
    return (
      <p className="rounded-md border border-border bg-surface px-6 py-12 text-center text-body text-text-secondary">
        {hasAnyPosts
          ? "No articles match the selected categories."
          : "No articles published yet — check back soon."}
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {posts.map((post) => (
        <li key={post.id} className="py-6 first:pt-0">
          <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-2"
          >
            <div className="flex flex-wrap items-center gap-2 text-tiny text-text-secondary">
              <span className="rounded-full bg-surface-alt px-2.5 py-0.5">
                {post.categories?.name ?? "Uncategorized"}
              </span>
              <span aria-hidden="true">·</span>
              {post.published_at ? (
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              ) : null}
              <span aria-hidden="true">·</span>
              <span>{estimateReadTime(post.body)} min read</span>
            </div>
            <h2 className="text-h3 font-semibold text-text-primary transition-colors group-hover:text-accent">
              {post.title}
            </h2>
            <p className="text-body text-text-secondary">{post.excerpt}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
