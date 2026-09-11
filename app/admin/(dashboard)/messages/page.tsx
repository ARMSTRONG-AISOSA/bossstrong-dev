import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MessageList } from "@/components/admin/message-list";
import type { ContactSubmission } from "@/types/contact-submission";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

// Not defined in any spec's admin nav, but backend-specification.md's RLS
// ("Admin can read/delete contact submissions") and retention policy ("the
// admin manually deletes resolved submissions") both assume this exists —
// added 2026-09-11 to close that gap, per the owner's direction. Same
// 20-per-page pattern as /admin/posts.
const PAGE_SIZE = 20;

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  const { data, count } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const messages = (data ?? []) as ContactSubmission[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-semibold text-text-primary">Messages</h1>
        <p className="mt-1 text-small text-text-secondary">
          Contact form submissions. Delete once an inquiry is resolved —
          there&apos;s no automatic expiry.
        </p>
      </div>
      <MessageList
        messages={messages}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
