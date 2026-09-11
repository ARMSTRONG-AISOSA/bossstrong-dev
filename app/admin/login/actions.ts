"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginValues } from "@/lib/validation/login-schema";

export async function signInWithPassword(
  values: LoginValues,
): Promise<{ error: string } | void> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/admin/posts");
}
