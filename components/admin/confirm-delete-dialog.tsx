"use client";

import { type ReactNode, useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";

// Destructive-action confirmation pattern, locked in at
// ui-design-system-specification.md §8.3: confirm is color-destructive and
// specifically labeled, cancel is the lower-emphasis option, both Escape and
// backdrop click dismiss (no extra "type to confirm" friction).
export function ConfirmDeleteDialog({
  triggerLabel,
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  triggerLabel: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      try {
        await onConfirm();
        setOpen(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) setOpen(next);
      }}
    >
      <DialogTrigger
        className={buttonVariants({ variant: "destructive", size: "sm" })}
      >
        {triggerLabel}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        {error ? (
          <p role="alert" className="mt-3 text-small text-destructive">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-2">
          <DialogClose
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Cancel
          </DialogClose>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className={buttonVariants({ variant: "destructive", size: "sm" })}
          >
            {isPending ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
