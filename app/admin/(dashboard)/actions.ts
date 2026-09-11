"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// blog-admin-specification.md §4.0: clears the session and returns to the
// public homepage, not back to /admin/login.
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
