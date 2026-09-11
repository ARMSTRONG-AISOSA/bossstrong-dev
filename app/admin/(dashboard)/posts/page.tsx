import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { PostList } from "@/components/admin/post-list";
import type { Post } from "@/types/post";
import type { Category } from "@/types/category";

export const metadata: Metadata = {
  title: "Posts",
  robots: { index: false, follow: false },
};

// blog-admin-specification.md §4.1: 20 per page, numbered pagination, only
// rendered once the count exceeds one page.
const PAGE_SIZE = 20;

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  const [{ data: postsData, count }, { data: categoriesData }] =
    await Promise.all([
      supabase
        .from("posts")
        .select("*", { count: "exact" })
        .order("updated_at", { ascending: false })
        .range(from, to),
      supabase.from("categories").select("*"),
    ]);

  const posts = (postsData ?? []) as Post[];
  const categories = (categoriesData ?? []) as Category[];
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 font-semibold text-text-primary">Posts</h1>
        <Link href="/admin/posts/new" className={buttonVariants({})}>
          New Post
        </Link>
      </div>
      <PostList
        posts={posts}
        categoryById={categoryById}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
