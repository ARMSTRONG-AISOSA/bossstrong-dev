import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "What information bossstrong-dev collects through its contact form, how it's used, and how long it's retained.",
  path: "/privacy",
});

// privacy-specification.md §3: plain-language copy, no legalese padding.
// The retention statement (3.3) is quoted verbatim — it must stay accurate
// to real practice (backend-specification.md §2.4: no automatic deletion,
// admin deletes manually once an inquiry is resolved).
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-h1 font-semibold text-text-primary">
        Privacy Policy
      </h1>

      <div className="mt-8 flex flex-col gap-8 text-body text-text-secondary">
        <section>
          <h2 className="text-h3 font-semibold text-text-primary">
            What data is collected
          </h2>
          <p className="mt-2">
            Only what the Contact form collects: your name, email address, and
            message content. This site does not use tracking cookies, analytics,
            or any form of behavioral profiling.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary">
            Why it&apos;s collected
          </h2>
          <p className="mt-2">
            Solely to respond to inquiries submitted through the Contact form,
            and any necessary follow-up correspondence. Your information is
            never used for marketing, added to a mailing list, or shared with
            third parties for their own purposes.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary">
            How long it&apos;s kept
          </h2>
          <p className="mt-2">
            Submitted messages are kept only for as long as relevant to
            responding to your inquiry and any follow-up. Once a conversation is
            resolved, the message is deleted.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary">
            Who has access
          </h2>
          <p className="mt-2">
            Only the site owner. No other person or automated system reads
            submission content, beyond the infrastructure providers named below.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary">
            Third-party services involved
          </h2>
          <ul className="mt-2 flex flex-col gap-1.5">
            <li>
              <strong className="text-text-primary">Supabase</strong> — stores
              submitted messages in a database.
            </li>
            <li>
              <strong className="text-text-primary">Resend</strong> — used to
              send an email notification when a new message is submitted; the
              message content passes through Resend&apos;s systems to deliver
              that email.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary">
            Contact for privacy questions
          </h2>
          <p className="mt-2">
            If you have a question about your data, want it deleted, or have any
            other privacy concern, reach out through the{" "}
            <Link
              href="/contact"
              className="text-accent-text underline underline-offset-2"
            >
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
