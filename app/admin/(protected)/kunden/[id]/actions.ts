"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { sendCustomerMessageEmail } from "@/lib/email/customerMessage";

const messageSchema = z.object({
  subject: z.string().trim().optional().nullable(),
  body: z.string().trim().min(1, "Nachricht darf nicht leer sein."),
  order_id: z.string().uuid().optional().nullable().or(z.literal("")),
});

export type MessageFormState = { error?: string };

export async function sendMessageToCustomer(
  customerId: string,
  _prevState: MessageFormState,
  formData: FormData,
): Promise<MessageFormState> {
  const { supabase } = await requireAdmin();

  const parsed = messageSchema.safeParse({
    subject: formData.get("subject") || null,
    body: formData.get("body"),
    order_id: formData.get("order_id") || null,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("email")
    .eq("id", customerId)
    .maybeSingle();
  if (!customer) return { error: "Kunde nicht gefunden." };

  const { error } = await supabase.from("customer_messages").insert({
    customer_id: customerId,
    order_id: parsed.data.order_id || null,
    direction: "admin_to_customer",
    subject: parsed.data.subject,
    body: parsed.data.body,
  });
  if (error) return { error: "Nachricht konnte nicht gespeichert werden." };

  try {
    await sendCustomerMessageEmail(
      customer.email,
      parsed.data.subject || "Nachricht von Conceptly",
      parsed.data.body,
    );
  } catch {
    // Nachricht ist im Kundenbereich sichtbar, auch wenn der Mailversand
    // gerade fehlschlägt.
  }

  revalidatePath(`/admin/kunden/${customerId}`);
  return {};
}

export async function markCustomerRepliesRead(customerId: string) {
  const { supabase } = await requireAdmin();
  await supabase
    .from("customer_messages")
    .update({ read: true })
    .eq("customer_id", customerId)
    .eq("direction", "customer_to_admin")
    .eq("read", false);
  revalidatePath("/admin/kunden");
}
