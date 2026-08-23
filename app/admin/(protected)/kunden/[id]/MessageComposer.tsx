"use client";

import { useActionState } from "react";
import { sendMessageToCustomer, type MessageFormState } from "./actions";

const initialState: MessageFormState = {};

export function MessageComposer({
  customerId,
  orders,
}: {
  customerId: string;
  orders: { id: string; order_number: string }[];
}) {
  const [state, formAction, pending] = useActionState(
    sendMessageToCustomer.bind(null, customerId),
    initialState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-anthracite-soft">Betreff (optional)</label>
          <input
            name="subject"
            className="mt-1 w-full rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none"
          />
        </div>
        {orders.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-anthracite-soft">
              Bezug zu Bestellung (optional)
            </label>
            <select
              name="order_id"
              className="mt-1 w-full rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none"
            >
              <option value="">Keine</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.order_number}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div>
        <label className="block text-xs font-medium text-anthracite-soft">Nachricht</label>
        <textarea
          name="body"
          required
          rows={4}
          className="mt-1 w-full rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-anthracite px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft disabled:opacity-60"
      >
        {pending ? "Wird gesendet…" : "Nachricht senden"}
      </button>
    </form>
  );
}
