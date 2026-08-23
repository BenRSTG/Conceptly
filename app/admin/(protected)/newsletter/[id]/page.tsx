import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { updateCampaign, deleteCampaign } from "../actions";
import { CampaignForm } from "../CampaignForm";
import { SendButton } from "./SendButton";

export const metadata: Metadata = { title: "Kampagne" };

const STATUS_LABELS: Record<string, string> = {
  draft: "Entwurf",
  scheduled: "Geplant",
  sent: "Versendet",
};

export default async function CampaignDetailPage({
  params,
}: PageProps<"/admin/newsletter/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: campaign } = await supabase
    .from("newsletter_campaigns")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!campaign) notFound();

  const { count: confirmedCount } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true })
    .eq("status", "confirmed");

  const isDraft = campaign.status === "draft";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-script text-3xl text-anthracite">{campaign.subject}</h1>
        <span className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-anthracite">
          {STATUS_LABELS[campaign.status] ?? campaign.status}
        </span>
      </div>
      {campaign.status === "sent" && (
        <p className="mt-1 text-sm text-anthracite-soft">
          Versendet am {new Date(campaign.sent_at!).toLocaleDateString("de-DE")} an{" "}
          {campaign.recipient_count} Empfänger:innen.
        </p>
      )}

      <div className="mt-8">
        <CampaignForm
          action={updateCampaign.bind(null, id)}
          defaultValues={campaign}
          submitLabel="Speichern"
          readOnly={!isDraft}
        />
      </div>

      {isDraft && (
        <div className="mt-8 flex items-center gap-4 border-t border-anthracite/10 pt-6">
          <SendButton campaignId={id} confirmedCount={confirmedCount ?? 0} />
          <form action={deleteCampaign.bind(null, id)}>
            <button type="submit" className="text-xs text-red-600 hover:underline">
              Entwurf löschen
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
