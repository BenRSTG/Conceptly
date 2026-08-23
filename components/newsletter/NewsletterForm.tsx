"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterSubscribeState } from "@/app/newsletter/actions";
import { cn } from "@/lib/utils";

const initialState: NewsletterSubscribeState = { status: "idle" };

export function NewsletterForm({
  source = "footer",
  className,
}: {
  source?: "footer" | "checkout" | "popup" | "profile";
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    initialState,
  );

  if (state.status === "sent") {
    return (
      <p className={cn("text-sm text-anthracite", className)}>
        Fast geschafft — bitte bestätige die Anmeldung über den Link in
        deinem Postfach.
      </p>
    );
  }

  if (state.status === "already_confirmed") {
    return (
      <p className={cn("text-sm text-anthracite", className)}>
        Du bist bereits angemeldet — schön, dass du da bist.
      </p>
    );
  }

  return (
    <form action={formAction} className={cn("space-y-2", className)}>
      <input type="hidden" name="source" value={source} />
      {/* Honeypot field — hidden from real visitors via CSS, not `hidden`
          so basic bots that skip hidden inputs still fill it in. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="deine@email.de"
          className="w-full rounded-full border border-anthracite/20 bg-white px-4 py-2 text-sm text-anthracite placeholder:text-anthracite-soft/60 focus:border-sand-dark focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full bg-anthracite px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft disabled:opacity-60"
        >
          {pending ? "…" : "Anmelden"}
        </button>
      </div>
      {state.status === "error" && (
        <p className="text-xs text-red-600">{state.message}</p>
      )}
    </form>
  );
}
