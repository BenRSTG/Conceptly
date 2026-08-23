"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";

const categorySchema = z.object({
  name: z.string().trim().min(1, "Name ist erforderlich."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug ist erforderlich.")
    .regex(/^[a-z0-9-]+$/, "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten."),
  sort_order: z.coerce.number().int().default(0),
});

export type CategoryFormState = { error?: string };

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const { supabase } = await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    sort_order: formData.get("sort_order") || 0,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { error } = await supabase.from("categories").insert(parsed.data);
  if (error) {
    return {
      error: error.code === "23505" ? "Dieser Slug existiert bereits." : "Speichern fehlgeschlagen.",
    };
  }

  revalidatePath("/admin/kategorien");
  return {};
}

export async function updateCategory(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const { supabase } = await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    sort_order: formData.get("sort_order") || 0,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { error } = await supabase.from("categories").update(parsed.data).eq("id", id);
  if (error) {
    return {
      error: error.code === "23505" ? "Dieser Slug existiert bereits." : "Speichern fehlgeschlagen.",
    };
  }

  revalidatePath("/admin/kategorien");
  return {};
}

export async function deleteCategory(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/kategorien");
}
