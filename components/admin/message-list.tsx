"use client";

import { buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { deleteMessage } from "@/app/admin/(dashboard)/messages/actions";
import type { ContactSubmission } from "@/types/contact-submission";
import Link from "next/link";

export function MessageList({
  messages,
  currentPage,
  totalPages,
}: {
  messages: ContactSubmission[];
  currentPage: number;
  totalPages: number;
}) {
  if (messages.length === 0) {
    return (
      <p className="rounded-md border border-border bg-surface px-4 py-6 text-center text-small text-text-secondary">
        No messages yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {messages.map((message) => (
          <MessageRow key={message.id} message={message} />
        ))}
      </ul>

      {totalPages > 1 ? (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      ) : null}
    </div>
  );
}

function MessageRow({ message }: { message: ContactSubmission }) {
  return (
    <li className="rounded-md border border-border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-small font-medium text-text-primary">
            {message.name}{" "}
            <span className="font-normal text-text-secondary">
              &lt;{message.email}&gt;
            </span>
          </p>
          {message.subject ? (
            <p className="mt-0.5 text-small text-text-secondary">
              {message.subject}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-tiny text-text-secondary">
            {new Date(message.created_at).toLocaleString()}
          </span>
          <ConfirmDeleteDialog
            triggerLabel="Delete"
            title="Delete this message?"
            description="This permanently removes the message. This can't be undone."
            confirmLabel="Delete Message"
            onConfirm={() => deleteMessage(message.id)}
          />
        </div>
      </div>
      <p className="mt-3 text-small whitespace-pre-wrap text-text-secondary">
        {message.message}
      </p>
    </li>
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
      aria-label="Messages pagination"
      className="flex items-center justify-center gap-1"
    >
      <Link
        href={`/admin/messages?page=${Math.max(1, currentPage - 1)}`}
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
          href={`/admin/messages?page=${p}`}
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
        href={`/admin/messages?page=${Math.min(totalPages, currentPage + 1)}`}
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
