import type { Metadata } from "next";
import { createCampaign } from "../actions";
import { CampaignForm } from "../CampaignForm";

export const metadata: Metadata = { title: "Neue Kampagne" };

export default function NewCampaignPage() {
  return (
    <div>
      <h1 className="font-script text-3xl text-anthracite">Neue Kampagne</h1>
      <div className="mt-8">
        <CampaignForm action={createCampaign} submitLabel="Als Entwurf speichern" />
      </div>
    </div>
  );
}
