import { createClient } from "@/lib/supabase/server";

const RESUME_PATH = "current-resume.pdf";

// Fixed-path upsert convention (backend-specification.md §5.2) — existence
// is read straight from Storage, no database table. Used by the site nav
// (and, later, the About page's resume link) to render an honest empty
// state when nothing has been uploaded yet.
export async function getResumeUrl(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.storage
    .from("resume-files")
    .list("", { search: RESUME_PATH });

  const exists = data?.some((file) => file.name === RESUME_PATH) ?? false;
  if (!exists) return null;

  const {
    data: { publicUrl },
  } = supabase.storage.from("resume-files").getPublicUrl(RESUME_PATH);

  return publicUrl;
}
