import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ResumeManager } from "@/components/admin/resume-manager";

export const metadata: Metadata = {
  title: "Resume",
  robots: { index: false, follow: false },
};

const RESUME_PATH = "current-resume.pdf";

// Fixed-path upsert convention (backend-specification.md §5.2) — status comes
// straight from the storage file's own metadata, no database table.
export default async function AdminResumePage() {
  const supabase = await createClient();
  const { data } = await supabase.storage
    .from("resume-files")
    .list("", { search: RESUME_PATH });
  const file = data?.find((f) => f.name === RESUME_PATH);

  const {
    data: { publicUrl },
  } = supabase.storage.from("resume-files").getPublicUrl(RESUME_PATH);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h2 font-semibold text-text-primary">Resume</h1>
      <ResumeManager
        exists={!!file}
        updatedAt={file?.updated_at ?? null}
        publicUrl={publicUrl}
      />
    </div>
  );
}
