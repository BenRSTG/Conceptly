"use client";

import { useActionState, useTransition } from "react";
import { subscribeToNewsletter, type NewsletterSubscribeState } from "@/app/newsletter/actions";
import { unsubscribeFromNewsletterProfile } from "./actions";

const initialState: NewsletterSubscribeState = { status: "idle" };

export function NewsletterToggle({
  email,
  currentStatus,
}: {
  email: string;
  currentStatus: "pending" | "confirmed" | "unsubscribed" | null;
}) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);
  const [isPending, startTransition] = useTransition();

  if (state.status === "sent") {
    return (
      <p className="text-sm text-anthracite">
        Fast geschafft — bitte bestätige die Anmeldung über den Link in deinem Postfach.
      </p>
    );
  }

  if (currentStatus === "confirmed") {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-anthracite">Du bist für den Newsletter angemeldet.</p>
        <button
          disabled={isPending}
          onClick={() => startTransition(() => unsubscribeFromNewsletterProfile())}
          className="text-xs text-red-600 hover:underline"
        >
          Abmelden
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex items-center gap-3">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="source" value="profile" />
      <p className="text-sm text-anthracite-soft">
        {currentStatus === "pending"
          ? "Bestätigung ausstehend — Link im Postfach nutzen, oder erneut anfordern:"
          : "Du bist aktuell nicht angemeldet."}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-anthracite px-4 py-1.5 text-xs font-medium text-white hover:bg-anthracite-soft disabled:opacity-60"
      >
        {pending ? "…" : "Newsletter abonnieren"}
      </button>
    </form>
  );
}
