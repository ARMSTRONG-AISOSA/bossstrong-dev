export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  category_id: string;
  tags: string[];
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
