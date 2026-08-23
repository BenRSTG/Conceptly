"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  fullName: z.string().trim().min(1, "Bitte gib deinen Namen ein."),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  password: z.string().min(8, "Das Passwort muss mindestens 8 Zeichen haben."),
});

export type RegisterFormState = { error?: string; success?: boolean };

export async function registerCustomer(
  _prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const parsed = schema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { fullName, email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return {
      error: error.message.includes("already registered")
        ? "Für diese E-Mail existiert bereits ein Konto."
        : "Registrierung fehlgeschlagen. Bitte erneut versuchen.",
    };
  }

  // Falls die Bestätigungsmail deaktiviert ist, existiert direkt eine
  // Session — dann können wir die customers-Zeile sofort anlegen. Ist eine
  // Bestätigung nötig, übernimmt requireCustomer() das beim ersten Login.
  if (data.session && data.user) {
    await supabase
      .from("customers")
      .upsert({ id: data.user.id, email, full_name: fullName }, { onConflict: "id" });
    redirect("/account");
  }

  return { success: true };
}
