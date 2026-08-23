"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addVariant, deleteVariant, type VariantFormState } from "../actions";
import { formatPrice } from "@/lib/utils";

type Variant = {
  id: string;
  variant_name: string;
  sku: string | null;
  price_override: number | null;
  stock_quantity: number | null;
};

const initialState: VariantFormState = {};

export function VariantEditor({ productId, variants }: { productId: string; variants: Variant[] }) {
  const boundAdd = addVariant.bind(null, productId);
  const [state, formAction, pending] = useActionState(boundAdd, initialState);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div>
      {variants.length > 0 && (
        <ul className="divide-y divide-anthracite/10 rounded-2xl border border-anthracite/10">
          {variants.map((variant) => (
            <li key={variant.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-anthracite">{variant.variant_name}</p>
                <p className="text-xs text-anthracite-soft">
                  {variant.sku && `SKU ${variant.sku} · `}
                  {variant.price_override != null && `${formatPrice(variant.price_override)} · `}
                  Lager: {variant.stock_quantity ?? "—"}
                </p>
              </div>
              <button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteVariant(productId, variant.id);
                    router.refresh();
                  })
                }
                className="text-xs text-red-600 hover:underline"
              >
                Entfernen
              </button>
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-anthracite-soft">
            Variante (z. B. „Farbe: Terrakotta&rdquo;)
          </label>
          <input
            name="variant_name"
            required
            className="mt-1 rounded-lg border border-anthracite/20 px-3 py-1.5 text-sm focus:border-sand-dark focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-anthracite-soft">SKU</label>
          <input
            name="sku"
            className="mt-1 w-28 rounded-lg border border-anthracite/20 px-3 py-1.5 text-sm focus:border-sand-dark focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-anthracite-soft">Preis-Override (€)</label>
          <input
            name="price_override"
            type="number"
            step="0.01"
            min="0"
            className="mt-1 w-28 rounded-lg border border-anthracite/20 px-3 py-1.5 text-sm focus:border-sand-dark focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-anthracite-soft">Lager</label>
          <input
            name="stock_quantity"
            type="number"
            min="0"
            className="mt-1 w-20 rounded-lg border border-anthracite/20 px-3 py-1.5 text-sm focus:border-sand-dark focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-anthracite px-4 py-1.5 text-sm font-medium text-white hover:bg-anthracite-soft disabled:opacity-60"
        >
          {pending ? "…" : "Hinzufügen"}
        </button>
        {state.error && <p className="w-full text-xs text-red-600">{state.error}</p>}
      </form>
    </div>
  );
}
