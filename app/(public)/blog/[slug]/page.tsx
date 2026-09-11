import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { estimateReadTime } from "@/lib/utils/read-time";
import type { Category } from "@/types/category";
import type { Post } from "@/types/post";

type PostWithCategory = Post & { categories: Category | null };

async function getPublishedPost(
  slug: string,
): Promise<PostWithCategory | null> {
  const supabase = await createClient();
  // Draft Visibility Rule (blog-admin-specification.md §5): the explicit
  // status filter here is a second, independent check on top of RLS — a
  // visitor can never load a draft by guessing its slug.
  const { data } = await supabase
    .from("posts")
    .select("*, categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return data as unknown as PostWithCategory | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  return { title: post?.title ?? "Article" };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) notFound();

  // published_at and updated_at are set from the same `now()` in the
  // publishing transaction (backend-specification.md §2.2), so a gap
  // between them means the post was edited after it went live.
  const wasEditedAfterPublish =
    post.published_at &&
    new Date(post.updated_at).getTime() -
      new Date(post.published_at).getTime() >
      1000;

  const supabase = await createClient();
  const { data: otherPostsData } = await supabase
    .from("posts")
    .select("slug, title")
    .eq("status", "published")
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(1);
  const otherPost = otherPostsData?.[0] as
    { slug: string; title: string } | undefined;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <article>
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 text-tiny text-text-secondary">
            {post.categories ? (
              <span className="rounded-full bg-surface-alt px-2.5 py-0.5">
                {post.categories.name}
              </span>
            ) : null}
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-h1 font-semibold text-text-primary">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-small text-text-secondary">
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
            {wasEditedAfterPublish ? (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Last updated{" "}
                  {new Date(post.updated_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </>
            ) : null}
          </div>

          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt ?? ""}
              width={800}
              height={420}
              className="mt-2 w-full rounded-lg border border-border object-cover"
            />
          ) : null}
        </header>

        <div className="mt-8">
          <MarkdownRenderer content={post.body} />
        </div>

        {/*
          Related Content (blog-admin-specification.md §3.2) — a card linking
          to a companion project when one exists. No schema field exists yet
          to store that relationship (backend-specification.md's posts table
          has no related-project column, and Projects aren't database-backed
          per the current specs), so this always resolves to "no related
          project" for now. Revisit once Phase 5.5 (Projects) exists and it's
          decided how the relationship should be modeled.
        */}

        <nav className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-6 text-small">
          <Link
            href="/blog"
            className="rounded-full border border-border px-4 py-2 font-medium text-text-primary transition-colors hover:bg-surface-alt"
          >
            Back to Blog
          </Link>
          {otherPost ? (
            <Link
              href={`/blog/${otherPost.slug}`}
              className="rounded-full border border-border px-4 py-2 font-medium text-text-primary transition-colors hover:bg-surface-alt"
            >
              Read: {otherPost.title}
            </Link>
          ) : null}
          <Link
            href="/contact"
            className="px-2 py-2 font-medium text-text-secondary underline underline-offset-2 hover:text-text-primary"
          >
            Get in touch
          </Link>
        </nav>
      </article>
    </main>
  );
}
