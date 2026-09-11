import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/post-editor";
import type { Category } from "@/types/category";

export const metadata: Metadata = {
  title: "New Post",
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  const categories = (data ?? []) as Category[];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h2 font-semibold text-text-primary">New Post</h1>
      <PostEditor categories={categories} />
    </div>
  );
}
