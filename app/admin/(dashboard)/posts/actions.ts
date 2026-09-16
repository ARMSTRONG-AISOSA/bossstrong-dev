"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { postSchema, type PostValues } from "@/lib/validation/post-schema";
import { extractPostImagePaths } from "@/lib/utils/extract-post-image-paths";
import type { PostStatus } from "@/types/post";

const UNIQUE_VIOLATION = "23505";

function toRow(values: PostValues) {
  return {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt,
    body: values.body,
    cover_image_url: values.cover_image_url || null,
    cover_image_alt: values.cover_image_alt || null,
    category_id: values.category_id,
    tags: values.tags,
    related_project_slug: values.related_project_slug || null,
    status: values.status,
  };
}

export async function createPost(
  values: PostValues,
): Promise<{ error?: string } | void> {
  const parsed = postSchema.safeParse(values);
  if (!parsed.success) return { error: "Check the highlighted fields." };

  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert(toRow(parsed.data));

  if (error) {
    return {
      error:
        error.code === UNIQUE_VIOLATION
          ? "A post with that slug already exists."
          : "Could not create post.",
    };
  }

  revalidatePath("/admin/posts");
}

// published_at / unpublish behavior (backend-specification.md §2.2) is
// enforced entirely by DB triggers based on the status transition — this
// action just writes the row, it never touches published_at itself.
export async function updatePost(
  id: string,
  values: PostValues,
): Promise<{ error?: string } | void> {
  const parsed = postSchema.safeParse(values);
  if (!parsed.success) return { error: "Check the highlighted fields." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update(toRow(parsed.data))
    .eq("id", id);

  if (error) {
    return {
      error:
        error.code === UNIQUE_VIOLATION
          ? "A post with that slug already exists."
          : "Could not save post.",
    };
  }

  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}/edit`);
}

export async function setPostStatus(
  id: string,
  status: PostStatus,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error("Could not update status.");
  revalidatePath("/admin/posts");
}

// Storage cleanup happens before the row delete, not after (CLAUDE.md rule 5 /
// backend-specification.md §5) — if cleanup fails, the row is left intact
// rather than deleting it and orphaning the images.
export async function deletePost(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("cover_image_url, body")
    .eq("id", id)
    .single();

  if (fetchError || !post) throw new Error("Could not find post.");

  const paths = extractPostImagePaths(post);
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("post-images")
      .remove(paths);
    if (storageError) throw new Error("Could not remove post images.");
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error("Could not delete post.");

  revalidatePath("/admin/posts");
}
