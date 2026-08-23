"use client";

import { useActionState } from "react";
import { updateOrder, type OrderUpdateState } from "../actions";

const initialState: OrderUpdateState = {};

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "pending", label: "Ausstehend" },
  { value: "paid", label: "Bezahlt" },
  { value: "processing", label: "In Bearbeitung" },
  { value: "shipped", label: "Versendet" },
  { value: "fulfilled", label: "Abgeschlossen" },
  { value: "cancelled", label: "Storniert" },
  { value: "refunded", label: "Erstattet" },
];

export function StatusForm({
  orderId,
  currentStatus,
  currentTrackingNumber,
}: {
  orderId: string;
  currentStatus: string;
  currentTrackingNumber: string | null;
}) {
  const [state, formAction, pending] = useActionState(updateOrder.bind(null, orderId), initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-xs font-medium text-anthracite-soft">Status</label>
        <select
          name="status"
          defaultValue={currentStatus}
          className="mt-1 rounded-lg border border-anthracite/20 px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-anthracite-soft">Sendungsnummer</label>
        <input
          name="tracking_number"
          defaultValue={currentTrackingNumber ?? ""}
          className="mt-1 rounded-lg border border-anthracite/20 px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-anthracite px-5 py-2 text-sm font-medium text-white hover:bg-anthracite-soft disabled:opacity-60"
      >
        {pending ? "…" : "Speichern"}
      </button>
      {state.success && <p className="text-sm text-green-700">Gespeichert.</p>}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
