"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { getResendClient, RESEND_FROM_EMAIL } from "@/lib/resend";

const campaignSchema = z.object({
  subject: z.string().trim().min(1, "Betreff ist erforderlich."),
  body_html: z.string().trim().min(1, "Der Inhalt darf nicht leer sein."),
});

export type CampaignFormState = { error?: string };

export async function createCampaign(
  _prevState: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  const { supabase } = await requireAdmin();
  const parsed = campaignSchema.safeParse({
    subject: formData.get("subject"),
    body_html: formData.get("body_html"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error || !data) return { error: "Speichern fehlgeschlagen." };

  revalidatePath("/admin/newsletter");
  redirect(`/admin/newsletter/${data.id}`);
}

export async function updateCampaign(
  id: string,
  _prevState: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  const { supabase } = await requireAdmin();
  const parsed = campaignSchema.safeParse({
    subject: formData.get("subject"),
    body_html: formData.get("body_html"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { error } = await supabase
    .from("newsletter_campaigns")
    .update(parsed.data)
    .eq("id", id)
    .eq("status", "draft");

  if (error) return { error: "Speichern fehlgeschlagen." };

  revalidatePath(`/admin/newsletter/${id}`);
  return {};
}

export async function deleteCampaign(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("newsletter_campaigns").delete().eq("id", id).eq("status", "draft");
  revalidatePath("/admin/newsletter");
}

function withUnsubscribeFooter(bodyHtml: string, confirmToken: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${confirmToken}`;
  return `
    ${bodyHtml}
    <hr style="margin-top:32px;border:none;border-top:1px solid #e5e5e5;" />
    <p style="font-size:12px;color:#888;margin-top:12px;">
      Du erhältst diese E-Mail, weil du dich für den Conceptly-Newsletter angemeldet hast.
      <a href="${unsubscribeUrl}">Newsletter abbestellen</a>
    </p>
  `;
}

export type SendCampaignState = { error?: string; success?: boolean };

export async function sendCampaign(
  id: string,
  // useActionState always calls actions as (state, payload); unused here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: SendCampaignState,
): Promise<SendCampaignState> {
  const { supabase } = await requireAdmin();

  const { data: campaign } = await supabase
    .from("newsletter_campaigns")
    .select("*")
    .eq("id", id)
    .eq("status", "draft")
    .maybeSingle();

  if (!campaign) {
    return { error: "Kampagne wurde bereits versendet oder existiert nicht." };
  }

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("email, confirm_token")
    .eq("status", "confirmed");

  const recipients = (subscribers ?? []).filter((s) => s.confirm_token);
  if (recipients.length === 0) {
    return { error: "Keine bestätigten Abonnent:innen vorhanden." };
  }

  const resend = getResendClient();
  const BATCH_SIZE = 100;

  try {
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const chunk = recipients.slice(i, i + BATCH_SIZE);
      await resend.batch.send(
        chunk.map((subscriber) => ({
          from: RESEND_FROM_EMAIL,
          to: subscriber.email,
          subject: campaign.subject,
          html: withUnsubscribeFooter(campaign.body_html, subscriber.confirm_token!),
        })),
      );
    }
  } catch {
    return { error: "Versand fehlgeschlagen. Bitte später erneut versuchen." };
  }

  await supabase
    .from("newsletter_campaigns")
    .update({ status: "sent", sent_at: new Date().toISOString(), recipient_count: recipients.length })
    .eq("id", id);

  revalidatePath(`/admin/newsletter/${id}`);
  revalidatePath("/admin/newsletter");
  return { success: true };
}
