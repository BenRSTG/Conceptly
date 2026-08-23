import type { Metadata } from "next";
import { requireCustomer } from "@/lib/auth/customer";
import { createServiceClient } from "@/lib/supabase/service";
import { ProfileForm } from "./ProfileForm";
import { NewsletterToggle } from "./NewsletterToggle";

export const metadata: Metadata = { title: "Mein Profil" };

export default async function ProfilePage() {
  const { supabase, user } = await requireCustomer();
  const { data: customer } = await supabase
    .from("customers")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  // newsletter_subscribers ist nur für Admins per anon/session-Key lesbar
  // (siehe RLS) — hier bewusst der Service-Client, um dem Kunden den
  // eigenen Abo-Status zu zeigen.
  const service = createServiceClient();
  const { data: subscriber } = await service
    .from("newsletter_subscribers")
    .select("status")
    .eq("email", user.email ?? "")
    .maybeSingle();

  return (
    <div>
      <h1 className="font-script text-3xl text-anthracite">Mein Profil</h1>
      <p className="mt-1 text-sm text-anthracite-soft">{user.email}</p>

      <ProfileForm defaultValues={{ full_name: customer?.full_name ?? null, phone: customer?.phone ?? null }} />

      <div className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
          Newsletter
        </h2>
        <div className="mt-3">
          <NewsletterToggle email={user.email ?? ""} currentStatus={subscriber?.status ?? null} />
        </div>
      </div>
    </div>
  );
}
