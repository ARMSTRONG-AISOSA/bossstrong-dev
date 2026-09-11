"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const RESUME_PATH = "current-resume.pdf";

export async function deleteResume(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.storage
    .from("resume-files")
    .remove([RESUME_PATH]);

  if (error) throw new Error("Could not delete resume.");
  revalidatePath("/admin/resume");
}
