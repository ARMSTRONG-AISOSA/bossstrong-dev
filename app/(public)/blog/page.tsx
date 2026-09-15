import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CategoryFilter } from "@/components/blog/category-filter";
import { ArticleList } from "@/components/blog/article-list";
import type { Category } from "@/types/category";
import type { Post } from "@/types/post";
import { buildMetadata } from "@/lib/seo";

// seo-specification.md §3: category filter states (?category=...) always
// canonicalize to this same static /blog metadata — there is no
// generateMetadata reading searchParams here, so this never drifts.
export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Technical writing from Armstrong Omoregie — architecture decisions, debugging write-ups, and how real features got built.",
  path: "/blog",
});

type PostWithCategory = Post & { categories: Category | null };

// blog-admin-specification.md §3.1. Category selection lives entirely in the
// URL (?category=slug,slug) — pure navigation, no client state — and the
// published-only filter is applied at the query level (Draft Visibility
// Rule, §5), never client-side.
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selectedSlugs = category ? category.split(",").filter(Boolean) : [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, categories(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const posts = (data ?? []) as unknown as PostWithCategory[];

  const categoryMap = new Map<string, Category>();
  for (const post of posts) {
    if (post.categories) categoryMap.set(post.categories.slug, post.categories);
  }
  const availableCategories = Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const filteredPosts =
    selectedSlugs.length === 0
      ? posts
      : posts.filter(
          (post) =>
            post.categories && selectedSlugs.includes(post.categories.slug),
        );

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="max-w-xl">
        <h1 className="text-h1 font-semibold text-text-primary">Blog</h1>
        <p className="mt-3 text-body-lg text-text-secondary">
          Notes on what I&apos;ve actually built and debugged — technical
          writing, not career commentary.
        </p>
      </div>

      {availableCategories.length > 0 ? (
        <div className="mt-8">
          <CategoryFilter
            categories={availableCategories}
            selectedSlugs={selectedSlugs}
          />
        </div>
      ) : null}

      <div className="mt-8">
        <ArticleList posts={filteredPosts} hasAnyPosts={posts.length > 0} />
      </div>
    </main>
  );
}
