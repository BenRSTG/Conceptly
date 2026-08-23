"use client";

import { useActionState } from "react";
import { registerCustomer, type RegisterFormState } from "./actions";

const initialState: RegisterFormState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerCustomer, initialState);

  if (state.success) {
    return (
      <p className="mt-6 text-sm text-anthracite">
        Fast geschafft — bitte bestätige dein Konto über den Link in deinem Postfach.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-anthracite" htmlFor="fullName">
          Name
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          className="mt-1 w-full rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-anthracite" htmlFor="email">
          E-Mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-anthracite" htmlFor="password">
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-1 w-full rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-anthracite px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft disabled:opacity-60"
      >
        {pending ? "Registrieren…" : "Konto erstellen"}
      </button>
    </form>
  );
}
