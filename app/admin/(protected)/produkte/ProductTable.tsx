"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { bulkUpdateStatus, bulkDeleteProducts, deleteProduct } from "./actions";

type ProductRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  base_price: number;
  sale_price: number | null;
  currency: string;
  stock_quantity: number | null;
  low_stock_threshold: number;
  stock_tracking: boolean;
  category_id: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Entwurf",
  published: "Veröffentlicht",
  archived: "Archiviert",
};

export function ProductTable({
  products,
  categoryNameById,
}: {
  products: ProductRow[];
  categoryNameById: Record<string, string>;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const allSelected = products.length > 0 && selected.size === products.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(products.map((p) => p.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function runBulk(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
      setSelected(new Set());
    });
  }

  return (
    <div>
      {selected.size > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-cream px-4 py-2 text-sm">
          <span>{selected.size} ausgewählt</span>
          <button
            disabled={isPending}
            onClick={() => runBulk(() => bulkUpdateStatus([...selected], "published"))}
            className="text-anthracite underline hover:no-underline"
          >
            Veröffentlichen
          </button>
          <button
            disabled={isPending}
            onClick={() => runBulk(() => bulkUpdateStatus([...selected], "archived"))}
            className="text-anthracite underline hover:no-underline"
          >
            Archivieren
          </button>
          <button
            disabled={isPending}
            onClick={() => {
              if (confirm(`${selected.size} Produkt(e) wirklich löschen?`)) {
                runBulk(() => bulkDeleteProducts([...selected]));
              }
            }}
            className="text-red-600 underline hover:no-underline"
          >
            Löschen
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-anthracite/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs tracking-wide text-anthracite-soft uppercase">
            <tr>
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              <th className="px-4 py-3">Titel</th>
              <th className="px-4 py-3">Kategorie</th>
              <th className="px-4 py-3">Preis</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Lager</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-anthracite/10">
            {products.map((product) => {
              const lowStock =
                product.stock_tracking &&
                product.stock_quantity != null &&
                product.stock_quantity <= product.low_stock_threshold;

              return (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(product.id)}
                      onChange={() => toggleOne(product.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/produkte/${product.id}`}
                      className="font-medium text-anthracite hover:underline"
                    >
                      {product.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-anthracite-soft">
                    {product.category_id ? (categoryNameById[product.category_id] ?? "—") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {formatPrice(product.sale_price ?? product.base_price, product.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-anthracite">
                      {STATUS_LABELS[product.status] ?? product.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${lowStock ? "font-medium text-red-600" : "text-anthracite-soft"}`}>
                    {product.stock_tracking ? (product.stock_quantity ?? "—") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`„${product.title}" wirklich löschen?`)) {
                          runBulk(() => deleteProduct(product.id));
                        }
                      }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-anthracite-soft">
                  Keine Produkte gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
