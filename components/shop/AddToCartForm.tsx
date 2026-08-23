"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/utils";

type Variant = {
  id: string;
  variant_name: string;
  price_override: number | null;
  stock_quantity: number | null;
};

export function AddToCartForm({
  productId,
  slug,
  title,
  basePrice,
  salePrice,
  currency,
  weightGrams,
  stockTracking,
  stockQuantity,
  imageUrl,
  variants,
}: {
  productId: string;
  slug: string;
  title: string;
  basePrice: number;
  salePrice: number | null;
  currency: string;
  weightGrams: number | null;
  stockTracking: boolean;
  stockQuantity: number | null;
  imageUrl: string | null;
  variants: Variant[];
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [variantId, setVariantId] = useState<string | null>(variants[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const selectedVariant = variants.find((v) => v.id === variantId) ?? null;
  const unitPrice = selectedVariant?.price_override ?? salePrice ?? basePrice;
  const effectiveStock = selectedVariant ? selectedVariant.stock_quantity : stockQuantity;
  const outOfStock = stockTracking && effectiveStock != null && effectiveStock <= 0;

  const maxQuantity = useMemo(() => {
    if (!stockTracking || effectiveStock == null) return 99;
    return Math.max(1, effectiveStock);
  }, [stockTracking, effectiveStock]);

  function handleAdd() {
    addItem(
      {
        productId,
        variantId,
        slug,
        title,
        variantName: selectedVariant?.variant_name ?? null,
        unitPrice,
        currency,
        imageUrl,
        weightGrams: weightGrams ?? 0,
      },
      quantity,
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      <p className="text-2xl font-medium text-anthracite">{formatPrice(unitPrice, currency)}</p>

      {variants.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-anthracite-soft">Variante</label>
          <select
            value={variantId ?? ""}
            onChange={(e) => setVariantId(e.target.value)}
            className="mt-1 w-full max-w-xs rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.variant_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-anthracite-soft">Menge</label>
        <input
          type="number"
          min={1}
          max={maxQuantity}
          value={quantity}
          onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, Number(e.target.value))))}
          className="w-20 rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none"
        />
      </div>

      {outOfStock ? (
        <p className="text-sm text-red-600">Aktuell nicht auf Lager.</p>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            className="rounded-full bg-anthracite px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft"
          >
            {justAdded ? "Hinzugefügt ✓" : "In den Warenkorb"}
          </button>
          <button
            onClick={() => {
              handleAdd();
              router.push("/warenkorb");
            }}
            className="rounded-full border border-anthracite/20 px-6 py-3 text-sm font-medium text-anthracite hover:bg-cream"
          >
            Direkt kaufen
          </button>
        </div>
      )}
    </div>
  );
}
