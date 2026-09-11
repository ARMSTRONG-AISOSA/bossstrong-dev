"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";

// Postgres unique_violation.
const UNIQUE_VIOLATION = "23505";

export async function createCategory(
  name: string,
): Promise<{ error?: string } | void> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .insert({ name: trimmed, slug: slugify(trimmed) });

  if (error) {
    return {
      error:
        error.code === UNIQUE_VIOLATION
          ? "A category with that name already exists."
          : "Could not create category.",
    };
  }

  revalidatePath("/admin/categories");
}

export async function renameCategory(
  id: string,
  name: string,
): Promise<{ error?: string } | void> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name: trimmed, slug: slugify(trimmed) })
    .eq("id", id);

  if (error) {
    return {
      error:
        error.code === UNIQUE_VIOLATION
          ? "A category with that name already exists."
          : "Could not rename category.",
    };
  }

  revalidatePath("/admin/categories");
}

// Reassignment to Uncategorized happens automatically via the posts.category_id
// FK's ON DELETE SET DEFAULT (backend-specification.md §3.3) — this is a plain
// delete, no application-level reassignment logic needed. The Uncategorized
// row itself is protected by a DB trigger, so a delete attempt on it fails here.
export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    throw new Error("Could not delete category.");
  }

  revalidatePath("/admin/categories");
}
