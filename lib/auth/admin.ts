import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Verifies the current session belongs to an admin (via the `is_admin()` SQL
 * function, so it works regardless of RLS on `admin_users` itself) and
 * redirects to the login screen otherwise. Call at the top of every
 * `/admin/*` Server Component and Server Action that mutates data.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    redirect("/admin/login?error=forbidden");
  }

  return { supabase, user };
}
