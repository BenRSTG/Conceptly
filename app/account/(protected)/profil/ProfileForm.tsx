"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileFormState } from "./actions";

const initialState: ProfileFormState = {};

export function ProfileForm({
  defaultValues,
}: {
  defaultValues: { full_name: string | null; phone: string | null };
}) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="mt-4 max-w-sm space-y-4">
      <div>
        <label className="block text-xs font-medium text-anthracite-soft">Name</label>
        <input
          name="full_name"
          required
          defaultValue={defaultValues.full_name ?? ""}
          className="mt-1 w-full rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-anthracite-soft">Telefon</label>
        <input
          name="phone"
          defaultValue={defaultValues.phone ?? ""}
          className="mt-1 w-full rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-green-700">Gespeichert.</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-anthracite px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft disabled:opacity-60"
      >
        {pending ? "…" : "Speichern"}
      </button>
    </form>
  );
}
