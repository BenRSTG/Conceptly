"use server";

import { z } from "zod";
import crypto from "node:crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { getResendClient, RESEND_FROM_EMAIL } from "@/lib/resend";

const subscribeSchema = z.object({
  email: z.string().trim().email(),
  source: z.enum(["footer", "checkout", "popup", "profile"]).default("footer"),
  // Honeypot: real users never fill this hidden field, bots often do.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type NewsletterSubscribeState = {
  status: "idle" | "sent" | "already_confirmed" | "error";
  message?: string;
};

export async function subscribeToNewsletter(
  _prevState: NewsletterSubscribeState,
  formData: FormData,
): Promise<NewsletterSubscribeState> {
  const parsed = subscribeSchema.safeParse({
    email: formData.get("email"),
    source: formData.get("source") ?? "footer",
    company: formData.get("company") ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: "Bitte gib eine gültige E-Mail-Adresse ein." };
  }

  // Honeypot tripped — pretend success, do nothing.
  if (parsed.data.company) {
    return { status: "sent" };
  }

  const { email, source } = parsed.data;
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  if (existing?.status === "confirmed") {
    return { status: "already_confirmed" };
  }

  const confirmToken = crypto.randomUUID();

  const { error: upsertError } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      {
        email,
        status: "pending",
        confirm_token: confirmToken,
        confirmed_at: null,
        unsubscribed_at: null,
        source,
      },
      { onConflict: "email" },
    );

  if (upsertError) {
    return { status: "error", message: "Anmeldung fehlgeschlagen. Bitte versuche es erneut." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const confirmUrl = `${siteUrl}/newsletter/confirm?token=${confirmToken}`;

  try {
    await getResendClient().emails.send({
      from: RESEND_FROM_EMAIL,
      to: email,
      subject: "Bitte bestätige dein Conceptly-Newsletter-Abo",
      html: `
        <p>Hallo,</p>
        <p>schön, dass du kuratierte Empfehlungen von Conceptly erhalten möchtest.
        Bitte bestätige deine Anmeldung mit einem Klick:</p>
        <p><a href="${confirmUrl}">Newsletter-Anmeldung bestätigen</a></p>
        <p>Falls du dich nicht angemeldet hast, ignoriere diese E-Mail einfach.</p>
      `,
    });
  } catch {
    // Subscriber row exists as "pending" either way; the confirm link still
    // works if the user requests it again. Don't fail the whole signup over
    // a transient email-provider error.
    return {
      status: "error",
      message: "Anmeldung gespeichert, aber die Bestätigungsmail konnte gerade nicht verschickt werden.",
    };
  }

  return { status: "sent" };
}
