"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { createClient } from "@/lib/supabase/client";
import { deleteResume } from "@/app/admin/(dashboard)/resume/actions";

// backend-specification.md §5.2: 2MB max, PDF only — bucket-level limit is
// the real gate, this is fast client-side feedback before upload starts.
const MAX_BYTES = 2 * 1024 * 1024;
const RESUME_PATH = "current-resume.pdf";

export function ResumeManager({
  exists,
  updatedAt,
  publicUrl,
}: {
  exists: boolean;
  updatedAt: string | null;
  publicUrl: string;
}) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File must be 2MB or smaller.");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    // upsert:true — uploading always replaces the file at the fixed path,
    // there's no separate "replace" operation (backend-specification.md §5.2).
    const { error: uploadError } = await supabase.storage
      .from("resume-files")
      .upload(RESUME_PATH, file, {
        upsert: true,
        contentType: "application/pdf",
      });
    setIsUploading(false);

    if (uploadError) {
      setError("Upload failed. Please try again.");
      return;
    }

    router.refresh();
  };

  return (
    <div className="max-w-md rounded-md border border-border bg-surface p-6">
      <p className="text-small text-text-secondary">
        {exists && updatedAt
          ? `Current resume — last updated ${new Date(updatedAt).toLocaleString()}`
          : "No resume currently uploaded."}
      </p>

      {exists ? (
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-small text-accent-text underline underline-offset-2"
        >
          Preview current resume
        </a>
      ) : null}

      <div className="mt-4 flex flex-col gap-2">
        <Input
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          disabled={isUploading}
        />
        <p className="text-tiny text-text-secondary">Max 2MB — PDF only.</p>
        {isUploading ? (
          <p className="text-tiny text-text-secondary">Uploading…</p>
        ) : null}
        {error ? <p className="text-tiny text-destructive">{error}</p> : null}
      </div>

      {exists ? (
        <div className="mt-4">
          <ConfirmDeleteDialog
            triggerLabel="Delete Resume"
            title="Delete the current resume?"
            description="The public download link will show as unavailable until a new file is uploaded."
            confirmLabel="Delete Resume"
            onConfirm={async () => {
              await deleteResume();
              router.refresh();
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
