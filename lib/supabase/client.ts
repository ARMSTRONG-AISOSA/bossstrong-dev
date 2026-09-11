import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components (e.g. the admin image-upload widget
 * uploading directly to Storage). Uses the public anon key — safe by design,
 * protected by RLS. (technical-specification.md §7)
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
