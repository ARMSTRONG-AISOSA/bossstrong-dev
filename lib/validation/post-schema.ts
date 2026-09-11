import { z } from "zod";

export const postSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers, and hyphens only",
      ),
    excerpt: z.string().min(1, "Excerpt is required"),
    body: z.string().min(1, "Body is required"),
    cover_image_url: z.string(),
    cover_image_alt: z.string(),
    category_id: z.string().min(1, "Category is required"),
    tags: z.array(z.string()),
    status: z.enum(["draft", "published"]),
  })
  .refine((data) => !data.cover_image_url || !!data.cover_image_alt.trim(), {
    // backend-specification.md §5 / seo-specification.md §8: alt text is
    // required whenever a cover image is present.
    message: "Alt text is required when a cover image is set",
    path: ["cover_image_alt"],
  });

export type PostValues = z.infer<typeof postSchema>;
