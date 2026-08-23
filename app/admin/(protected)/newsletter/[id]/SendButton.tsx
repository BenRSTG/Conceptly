"use client";

import { useActionState } from "react";
import { sendCampaign, type SendCampaignState } from "../actions";

const initialState: SendCampaignState = {};

export function SendButton({ campaignId, confirmedCount }: { campaignId: string; confirmedCount: number }) {
  const [state, formAction, pending] = useActionState(sendCampaign.bind(null, campaignId), initialState);

  if (state.success) {
    return <p className="text-sm text-green-700">Kampagne wurde versendet.</p>;
  }

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm(`An ${confirmedCount} bestätigte Abonnent:innen versenden?`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        disabled={pending || confirmedCount === 0}
        className="rounded-full bg-anthracite px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft disabled:opacity-60"
      >
        {pending ? "Wird versendet…" : `An ${confirmedCount} Abonnent:innen versenden`}
      </button>
      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
