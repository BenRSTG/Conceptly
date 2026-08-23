"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireCustomer } from "@/lib/auth/customer";

const addressSchema = z.object({
  label: z.string().trim().optional().nullable(),
  street: z.string().trim().min(1, "Straße ist erforderlich."),
  house_number: z.string().trim().min(1, "Hausnummer ist erforderlich."),
  postal_code: z.string().trim().min(1, "PLZ ist erforderlich."),
  city: z.string().trim().min(1, "Stadt ist erforderlich."),
  country: z.string().trim().min(2, "Land ist erforderlich."),
  is_default: z.coerce.boolean().default(false),
});

export type AddressFormState = { error?: string };

async function clearDefaultIfNeeded(supabase: Awaited<ReturnType<typeof requireCustomer>>["supabase"], customerId: string, makeDefault: boolean) {
  if (makeDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("customer_id", customerId);
  }
}

export async function createAddress(
  _prevState: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const { supabase, user } = await requireCustomer();
  const parsed = addressSchema.safeParse({
    label: formData.get("label") || null,
    street: formData.get("street"),
    house_number: formData.get("house_number"),
    postal_code: formData.get("postal_code"),
    city: formData.get("city"),
    country: formData.get("country"),
    is_default: formData.get("is_default") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  await clearDefaultIfNeeded(supabase, user.id, parsed.data.is_default);

  const { error } = await supabase.from("addresses").insert({ ...parsed.data, customer_id: user.id });
  if (error) return { error: "Speichern fehlgeschlagen." };

  revalidatePath("/account/adressen");
  return {};
}

export async function updateAddress(
  addressId: string,
  _prevState: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const { supabase, user } = await requireCustomer();
  const parsed = addressSchema.safeParse({
    label: formData.get("label") || null,
    street: formData.get("street"),
    house_number: formData.get("house_number"),
    postal_code: formData.get("postal_code"),
    city: formData.get("city"),
    country: formData.get("country"),
    is_default: formData.get("is_default") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  await clearDefaultIfNeeded(supabase, user.id, parsed.data.is_default);

  const { error } = await supabase.from("addresses").update(parsed.data).eq("id", addressId);
  if (error) return { error: "Speichern fehlgeschlagen." };

  revalidatePath("/account/adressen");
  return {};
}

export async function deleteAddress(addressId: string) {
  const { supabase } = await requireCustomer();
  await supabase.from("addresses").delete().eq("id", addressId);
  revalidatePath("/account/adressen");
}
