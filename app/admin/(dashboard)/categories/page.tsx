import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CategoryList } from "@/components/admin/category-list";
import type { Category } from "@/types/category";

export const metadata: Metadata = {
  title: "Categories",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");

  const categories = (data ?? []) as Category[];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-semibold text-text-primary">Categories</h1>
        <p className="mt-1 text-small text-text-secondary">
          Deleting a category reassigns its posts to Uncategorized.
        </p>
      </div>
      <CategoryList categories={categories} />
    </div>
  );
}
