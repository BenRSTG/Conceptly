import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";

/**
 * Server-side Supabase client (Server Components, Server Actions, Route
 * Handlers). Uses the anon key + the caller's session cookie, so RLS applies
 * as if the request came from the browser.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component without a mutable cookie jar
            // (e.g. during static rendering). Session refresh happens in
            // middleware instead, so this is safe to ignore.
          }
        },
      },
    },
  );
}
