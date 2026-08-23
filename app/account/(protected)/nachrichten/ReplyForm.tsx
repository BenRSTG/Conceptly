"use client";

import { useActionState } from "react";
import { replyToAdmin, type ReplyFormState } from "./actions";

const initialState: ReplyFormState = {};

export function ReplyForm() {
  const [state, formAction, pending] = useActionState(replyToAdmin, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <textarea
        name="body"
        required
        rows={3}
        placeholder="Deine Nachricht an Conceptly…"
        className="w-full rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none"
      />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-anthracite px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft disabled:opacity-60"
      >
        {pending ? "Wird gesendet…" : "Senden"}
      </button>
    </form>
  );
}
