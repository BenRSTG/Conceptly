"use client";

import { useActionState } from "react";
import type { AddressFormState } from "./actions";

const initialState: AddressFormState = {};
const inputClass =
  "mt-1 w-full rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none";
const labelClass = "block text-xs font-medium text-anthracite-soft";

export function AddressForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (state: AddressFormState, formData: FormData) => Promise<AddressFormState>;
  defaultValues?: {
    label?: string | null;
    street: string;
    house_number: string;
    postal_code: string;
    city: string;
    country: string;
    is_default: boolean;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label className={labelClass}>Label (z. B. „Zuhause&rdquo;)</label>
        <input name="label" defaultValue={defaultValues?.label ?? ""} className={inputClass} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className={labelClass}>Straße</label>
          <input name="street" required defaultValue={defaultValues?.street} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Hausnr.</label>
          <input
            name="house_number"
            required
            defaultValue={defaultValues?.house_number}
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>PLZ</label>
          <input
            name="postal_code"
            required
            defaultValue={defaultValues?.postal_code}
            className={inputClass}
          />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Stadt</label>
          <input name="city" required defaultValue={defaultValues?.city} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Land</label>
        <select name="country" defaultValue={defaultValues?.country ?? "DE"} className={inputClass}>
          <option value="DE">Deutschland</option>
          <option value="AT">Österreich</option>
          <option value="CH">Schweiz</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-anthracite">
        <input type="checkbox" name="is_default" defaultChecked={defaultValues?.is_default} />
        Als Standardadresse festlegen
      </label>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-anthracite px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft disabled:opacity-60"
      >
        {pending ? "…" : submitLabel}
      </button>
    </form>
  );
}
