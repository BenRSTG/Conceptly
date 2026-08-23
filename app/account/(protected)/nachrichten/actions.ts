"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireCustomer } from "@/lib/auth/customer";
import { sendAdminNotificationEmail } from "@/lib/email/customerMessage";

const replySchema = z.object({
  body: z.string().trim().min(1, "Nachricht darf nicht leer sein."),
});

export type ReplyFormState = { error?: string };

export async function replyToAdmin(
  _prevState: ReplyFormState,
  formData: FormData,
): Promise<ReplyFormState> {
  const { supabase, user } = await requireCustomer();

  const parsed = replySchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { error } = await supabase.from("customer_messages").insert({
    customer_id: user.id,
    direction: "customer_to_admin",
    body: parsed.data.body,
  });
  if (error) return { error: "Senden fehlgeschlagen." };

  try {
    await sendAdminNotificationEmail(user.email ?? "", parsed.data.body);
  } catch {
    // Nachricht ist im Admin-Dashboard sichtbar, auch ohne E-Mail-Versand.
  }

  revalidatePath("/account/nachrichten");
  return {};
}

export async function markAdminMessagesRead() {
  const { supabase, user } = await requireCustomer();
  await supabase
    .from("customer_messages")
    .update({ read: true })
    .eq("customer_id", user.id)
    .eq("direction", "admin_to_customer")
    .eq("read", false);
}
