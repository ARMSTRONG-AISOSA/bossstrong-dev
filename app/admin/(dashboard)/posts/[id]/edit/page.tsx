import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/post-editor";
import type { Category } from "@/types/category";
import type { Post } from "@/types/post";

export const metadata: Metadata = {
  title: "Edit Post",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: post }, { data: categoriesData }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("name"),
  ]);

  if (!post) notFound();

  const categories = (categoriesData ?? []) as Category[];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h2 font-semibold text-text-primary">Edit Post</h1>
      <PostEditor categories={categories} post={post as Post} />
    </div>
  );
}
