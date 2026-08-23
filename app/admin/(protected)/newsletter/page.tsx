import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = { title: "Newsletter" };

const STATUS_LABELS: Record<string, string> = {
  draft: "Entwurf",
  scheduled: "Geplant",
  sent: "Versendet",
};

export default async function AdminNewsletterPage() {
  const { supabase } = await requireAdmin();

  const [{ data: campaigns }, { count: confirmedCount }] = await Promise.all([
    supabase
      .from("newsletter_campaigns")
      .select("id, subject, status, sent_at, recipient_count, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("status", "confirmed"),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-script text-3xl text-anthracite">Newsletter</h1>
        <Link
          href="/admin/newsletter/neu"
          className="rounded-full bg-anthracite px-4 py-2 text-sm font-medium text-white hover:bg-anthracite-soft"
        >
          + Neue Kampagne
        </Link>
      </div>

      <p className="mt-2 text-sm text-anthracite-soft">
        {confirmedCount ?? 0} bestätigte Abonnent:innen
      </p>

      <ul className="mt-6 divide-y divide-anthracite/10 rounded-2xl border border-anthracite/10">
        {(campaigns ?? []).map((campaign) => (
          <li key={campaign.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <Link
              href={`/admin/newsletter/${campaign.id}`}
              className="font-medium text-anthracite hover:underline"
            >
              {campaign.subject}
            </Link>
            <span className="text-anthracite-soft">
              {STATUS_LABELS[campaign.status] ?? campaign.status}
              {campaign.status === "sent" && ` · ${campaign.recipient_count ?? 0} Empfänger:innen`}
            </span>
          </li>
        ))}
        {(!campaigns || campaigns.length === 0) && (
          <li className="px-4 py-6 text-center text-sm text-anthracite-soft">
            Noch keine Kampagnen angelegt.
          </li>
        )}
      </ul>
    </div>
  );
}
