"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Check, Pencil, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import {
  createCategory,
  deleteCategory,
  renameCategory,
} from "@/app/admin/(dashboard)/categories/actions";
import type { Category } from "@/types/category";

export function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <div className="flex flex-col gap-4">
      <AddCategoryForm />
      <ul className="divide-y divide-border rounded-md border border-border bg-surface">
        {categories.length === 0 ? (
          <li className="px-4 py-6 text-center text-small text-text-secondary">
            No categories yet.
          </li>
        ) : (
          categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))
        )}
      </ul>
    </div>
  );
}

function AddCategoryForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createCategory(name);
      if (result?.error) {
        setError(result.error);
      } else {
        setName("");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex items-start gap-2">
      <div className="flex-1">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New category name"
          aria-label="New category name"
        />
        {error ? (
          <p className="mt-1 text-tiny text-destructive">{error}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={isPending || !name.trim()}>
        {isPending ? "Adding…" : "Add"}
      </Button>
    </form>
  );
}

function CategoryRow({ category }: { category: Category }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isUncategorized = category.slug === "uncategorized";

  const onSave = () => {
    setError(null);
    startTransition(async () => {
      const result = await renameCategory(category.id, name);
      if (result?.error) {
        setError(result.error);
      } else {
        setIsEditing(false);
      }
    });
  };

  if (isEditing) {
    return (
      <li className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="max-w-xs"
            autoFocus
          />
          {error ? (
            <p className="mt-1 text-tiny text-destructive">{error}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={isPending}
            onClick={onSave}
            aria-label="Save"
          >
            <Check size={16} aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => {
              setIsEditing(false);
              setName(category.name);
              setError(null);
            }}
            aria-label="Cancel"
          >
            <XIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span className="text-body text-text-primary">{category.name}</span>
      <span className="text-tiny text-text-secondary">/{category.slug}</span>
      <div className="ml-auto flex items-center gap-1">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          aria-label={`Rename ${category.name}`}
        >
          <Pencil size={14} aria-hidden="true" />
        </Button>
        {!isUncategorized ? (
          <ConfirmDeleteDialog
            triggerLabel="Delete"
            title={`Delete "${category.name}"?`}
            description="Posts in this category will be reassigned to Uncategorized. This can't be undone."
            confirmLabel="Delete Category"
            onConfirm={() => deleteCategory(category.id)}
          />
        ) : null}
      </div>
    </li>
  );
}
