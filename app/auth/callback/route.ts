import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Google OAuth redirects here with a `code` param after the admin approves
 * sign-in (technical-specification.md §7). Exchanges it for a session, then
 * sends the browser on to the admin dashboard.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL("/admin/posts", request.url));
}
