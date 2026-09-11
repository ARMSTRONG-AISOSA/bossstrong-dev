"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import {
  deletePost,
  setPostStatus,
} from "@/app/admin/(dashboard)/posts/actions";
import type { Post } from "@/types/post";
import type { Category } from "@/types/category";

export function PostList({
  posts,
  categoryById,
  currentPage,
  totalPages,
}: {
  posts: Post[];
  categoryById: Map<string, Category>;
  currentPage: number;
  totalPages: number;
}) {
  if (posts.length === 0) {
    return (
      <p className="rounded-md border border-border bg-surface px-4 py-6 text-center text-small text-text-secondary">
        No posts yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-md border border-border bg-surface">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-border text-tiny text-text-secondary">
              <th className="px-4 py-2 font-medium">Title</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Last Updated</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <PostRow
                key={post.id}
                post={post}
                category={categoryById.get(post.category_id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      ) : null}
    </div>
  );
}

function PostRow({ post, category }: { post: Post; category?: Category }) {
  const [isPending, startTransition] = useTransition();

  const toggleStatus = () => {
    startTransition(async () => {
      await setPostStatus(
        post.id,
        post.status === "published" ? "draft" : "published",
      );
    });
  };

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-2 text-text-primary">{post.title}</td>
      <td className="px-4 py-2">
        <StatusBadge status={post.status} />
      </td>
      <td className="px-4 py-2 text-text-secondary">{category?.name ?? "—"}</td>
      <td className="px-4 py-2 text-text-secondary">
        {new Date(post.updated_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/posts/${post.id}/edit`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Edit
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={toggleStatus}
          >
            {post.status === "published" ? "Unpublish" : "Publish"}
          </Button>
          <ConfirmDeleteDialog
            triggerLabel="Delete"
            title={`Delete "${post.title}"?`}
            description="This removes the post and its images. This can't be undone."
            confirmLabel="Delete Post"
            onConfirm={() => deletePost(post.id)}
          />
        </div>
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: Post["status"] }) {
  const isPublished = status === "published";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-tiny font-medium ${
        isPublished
          ? "bg-success/10 text-success"
          : "bg-warning/10 text-warning"
      }`}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Posts pagination"
      className="flex items-center justify-center gap-1"
    >
      <Link
        href={`/admin/posts?page=${Math.max(1, currentPage - 1)}`}
        aria-disabled={currentPage === 1}
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className: currentPage === 1 ? "pointer-events-none opacity-50" : "",
        })}
      >
        Prev
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={`/admin/posts?page=${p}`}
          aria-current={p === currentPage ? "page" : undefined}
          className={buttonVariants({
            variant: p === currentPage ? "default" : "ghost",
            size: "sm",
          })}
        >
          {p}
        </Link>
      ))}
      <Link
        href={`/admin/posts?page=${Math.min(totalPages, currentPage + 1)}`}
        aria-disabled={currentPage === totalPages}
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className:
            currentPage === totalPages ? "pointer-events-none opacity-50" : "",
        })}
      >
        Next
      </Link>
    </nav>
  );
}
