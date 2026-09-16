"use client";

import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { CoverImageField } from "@/components/admin/cover-image-field";
import { postSchema, type PostValues } from "@/lib/validation/post-schema";
import { slugify } from "@/lib/utils/slugify";
import { createPost, updatePost } from "@/app/admin/(dashboard)/posts/actions";
import { projects } from "@/lib/data/projects";
import type { Category } from "@/types/category";
import type { Post } from "@/types/post";

export function PostEditor({
  categories,
  post,
}: {
  categories: Category[];
  post?: Post;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          body: post.body,
          cover_image_url: post.cover_image_url ?? "",
          cover_image_alt: post.cover_image_alt ?? "",
          category_id: post.category_id,
          tags: post.tags,
          related_project_slug: post.related_project_slug ?? "",
          status: post.status,
        }
      : {
          title: "",
          slug: "",
          excerpt: "",
          body: "",
          cover_image_url: "",
          cover_image_alt: "",
          category_id: categories[0]?.id ?? "",
          tags: [],
          related_project_slug: "",
          status: "draft",
        },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const title = watch("title");
  const body = watch("body");
  const tags = watch("tags");

  const onTitleChange = (value: string) => {
    setValue("title", value);
    if (!slugTouched) {
      setValue("slug", slugify(value));
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setValue("tags", [...tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tag),
    );
  };

  const onSubmit = (values: PostValues) => {
    setFormError(null);
    startTransition(async () => {
      const result = post
        ? await updatePost(post.id, values)
        : await createPost(values);
      if (result?.error) {
        setFormError(result.error);
      } else {
        router.push("/admin/posts");
      }
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                aria-invalid={!!errors.title}
              />
              {errors.title ? (
                <p className="text-tiny text-destructive">
                  {errors.title.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                aria-invalid={!!errors.slug}
                {...register("slug", {
                  onChange: () => setSlugTouched(true),
                })}
              />
              {errors.slug ? (
                <p className="text-tiny text-destructive">
                  {errors.slug.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                rows={3}
                aria-invalid={!!errors.excerpt}
                {...register("excerpt")}
              />
              {errors.excerpt ? (
                <p className="text-tiny text-destructive">
                  {errors.excerpt.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select id="category" {...register("category_id")}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              {errors.category_id ? (
                <p className="text-tiny text-destructive">
                  {errors.category_id.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="related-project">Related Project</Label>
              <Select
                id="related-project"
                {...register("related_project_slug")}
              >
                <option value="">None</option>
                {projects.map((project) => (
                  <option key={project.slug} value={project.slug}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag and press Enter"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              {tags.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-surface-alt px-2.5 py-1 text-tiny text-text-secondary"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        aria-label={`Remove ${tag}`}
                        className="text-text-secondary hover:text-text-primary"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <CoverImageField />

            <div className="flex items-center gap-3">
              <Label htmlFor="status">Status</Label>
              <Select id="status" className="w-auto" {...register("status")}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="body">Body (Markdown)</Label>
            <Textarea
              id="body"
              rows={20}
              className="font-mono text-small"
              aria-invalid={!!errors.body}
              {...register("body")}
            />
            {errors.body ? (
              <p className="text-tiny text-destructive">
                {errors.body.message}
              </p>
            ) : null}
            <div className="mt-2">
              <p className="mb-2 text-small font-medium text-text-secondary">
                Preview
              </p>
              <div className="rounded-md border border-border bg-surface p-4">
                <MarkdownRenderer
                  content={body || "*Nothing to preview yet.*"}
                />
              </div>
            </div>
          </div>
        </div>

        {formError ? (
          <p role="alert" className="text-small text-destructive">
            {formError}
          </p>
        ) : null}

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : post ? "Save Changes" : "Create Post"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
