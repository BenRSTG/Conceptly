import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Verifies a logged-in customer session and lazily creates the matching
 * `customers` row on first visit (covers signups that completed via email
 * confirmation, where no session existed yet at signUp() time). Call at the
 * top of every `/account/*` Server Component and Server Action.
 */
export async function requireCustomer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    const fullName =
      typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null;
    await supabase
      .from("customers")
      .insert({ id: user.id, email: user.email ?? "", full_name: fullName });
  }

  return { supabase, user };
}
