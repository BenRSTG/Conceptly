import "server-only";
import { getResendClient, RESEND_FROM_EMAIL } from "@/lib/resend";

export async function sendCustomerMessageEmail(toEmail: string, subject: string, body: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await getResendClient().emails.send({
    from: RESEND_FROM_EMAIL,
    to: toEmail,
    subject: subject || "Nachricht von Conceptly",
    html: `
      <p>${body.replace(/\n/g, "<br />")}</p>
      <p style="margin-top:24px;font-size:13px;color:#888;">
        Du kannst direkt in deinem
        <a href="${siteUrl}/account/nachrichten">Conceptly-Kundenbereich</a> antworten.
      </p>
    `,
  });
}

export async function sendAdminNotificationEmail(fromCustomerEmail: string, body: string) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return; // kein Admin-Postfach hinterlegt — Nachricht bleibt im Dashboard sichtbar

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await getResendClient().emails.send({
    from: RESEND_FROM_EMAIL,
    to: adminEmail,
    subject: `Neue Kundennachricht von ${fromCustomerEmail}`,
    html: `
      <p>${body.replace(/\n/g, "<br />")}</p>
      <p style="margin-top:24px;font-size:13px;color:#888;">
        <a href="${siteUrl}/admin/kunden">Im Admin-Bereich beantworten</a>
      </p>
    `,
  });
}
