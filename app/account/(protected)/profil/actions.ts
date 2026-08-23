"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireCustomer } from "@/lib/auth/customer";
import { createServiceClient } from "@/lib/supabase/service";

const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Bitte gib deinen Namen ein."),
  phone: z.string().trim().optional().nullable(),
});

export type ProfileFormState = { error?: string; success?: boolean };

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const { supabase, user } = await requireCustomer();
  const parsed = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone") || null,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { error } = await supabase.from("customers").update(parsed.data).eq("id", user.id);
  if (error) return { error: "Speichern fehlgeschlagen." };

  revalidatePath("/account/profil");
  return { success: true };
}

export async function unsubscribeFromNewsletterProfile() {
  const { supabase, user } = await requireCustomer();

  await supabase.from("customers").update({ newsletter_opt_in: false }).eq("id", user.id);

  const service = createServiceClient();
  await service
    .from("newsletter_subscribers")
    .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("email", user.email ?? "");

  revalidatePath("/account/profil");
}
