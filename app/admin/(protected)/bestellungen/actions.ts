"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";

const updateSchema = z.object({
  status: z.enum([
    "pending",
    "paid",
    "processing",
    "shipped",
    "fulfilled",
    "cancelled",
    "refunded",
  ]),
  tracking_number: z.string().trim().optional().nullable(),
});

export type OrderUpdateState = { error?: string; success?: boolean };

export async function updateOrder(
  orderId: string,
  _prevState: OrderUpdateState,
  formData: FormData,
): Promise<OrderUpdateState> {
  const { supabase } = await requireAdmin();

  const parsed = updateSchema.safeParse({
    status: formData.get("status"),
    tracking_number: formData.get("tracking_number") || null,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status: parsed.data.status,
      tracking_number: parsed.data.tracking_number,
    })
    .eq("id", orderId);

  if (error) return { error: "Speichern fehlgeschlagen." };

  revalidatePath(`/admin/bestellungen/${orderId}`);
  revalidatePath("/admin/bestellungen");
  return { success: true };
}
