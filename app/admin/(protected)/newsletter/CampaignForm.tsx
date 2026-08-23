"use client";

import { useActionState, useState } from "react";
import type { CampaignFormState } from "./actions";

const initialState: CampaignFormState = {};

export function CampaignForm({
  action,
  defaultValues,
  submitLabel,
  readOnly,
}: {
  action: (state: CampaignFormState, formData: FormData) => Promise<CampaignFormState>;
  defaultValues?: { subject: string; body_html: string };
  submitLabel: string;
  readOnly?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [bodyHtml, setBodyHtml] = useState(defaultValues?.body_html ?? "");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-anthracite-soft">Betreff</label>
          <input
            name="subject"
            required
            disabled={readOnly}
            defaultValue={defaultValues?.subject}
            className="mt-1 w-full rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none disabled:bg-cream"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-anthracite-soft">
            Inhalt (HTML)
          </label>
          <textarea
            name="body_html"
            required
            disabled={readOnly}
            rows={16}
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            className="mt-1 w-full rounded-lg border border-anthracite/20 px-3 py-2 font-mono text-xs focus:border-sand-dark focus:outline-none disabled:bg-cream"
          />
          <p className="mt-1 text-xs text-anthracite-soft">
            Der Abmelde-Link wird beim Versand automatisch ergänzt.
          </p>
        </div>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        {!readOnly && (
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-anthracite px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft disabled:opacity-60"
          >
            {pending ? "…" : submitLabel}
          </button>
        )}
      </form>

      <div>
        <p className="text-xs font-medium text-anthracite-soft">Vorschau</p>
        <div
          className="mt-1 h-full max-h-[420px] overflow-y-auto rounded-lg border border-anthracite/20 p-4 text-sm"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </div>
    </div>
  );
}
