"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// No automatic deletion (backend-specification.md §2.4, CLAUDE.md rule 16) —
// the admin deletes manually once an inquiry is resolved. This is that
// manual action; RLS ("Admin can delete contact submissions") is the real
// enforcement point.
export async function deleteMessage(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id);

  if (error) throw new Error("Could not delete message.");
  revalidatePath("/admin/messages");
}
