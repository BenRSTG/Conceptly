"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart/CartContext";
import { calculateShipping } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalWeightGrams } = useCart();
  const shipping = items.length > 0 ? calculateShipping(subtotal, totalWeightGrams) : 0;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <h1 className="font-script text-4xl text-anthracite">Warenkorb</h1>
        <p className="mt-4 text-sm text-anthracite-soft">Dein Warenkorb ist noch leer.</p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center rounded-full bg-anthracite px-6 py-3 text-sm font-medium text-white hover:bg-anthracite-soft"
        >
          Shop entdecken
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-script text-4xl text-anthracite">Warenkorb</h1>

      <div className="mt-8 divide-y divide-anthracite/10 rounded-2xl border border-anthracite/10">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-4 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt="" fill sizes="80px" className="object-cover" />
              )}
            </div>
            <div className="flex-1">
              <Link href={`/shop/${item.slug}`} className="text-sm font-medium text-anthracite hover:underline">
                {item.title}
              </Link>
              {item.variantName && <p className="text-xs text-anthracite-soft">{item.variantName}</p>}
              <p className="text-sm text-anthracite-soft">{formatPrice(item.unitPrice, item.currency)}</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.productId, item.variantId, Math.max(1, Number(e.target.value)))
              }
              className="w-16 rounded-lg border border-anthracite/20 px-2 py-1 text-center text-sm"
            />
            <p className="w-20 text-right text-sm font-medium text-anthracite">
              {formatPrice(item.unitPrice * item.quantity, item.currency)}
            </p>
            <button
              onClick={() => removeItem(item.productId, item.variantId)}
              className="text-xs text-red-600 hover:underline"
            >
              Entfernen
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-1 text-right text-sm text-anthracite">
        <p>Zwischensumme: {formatPrice(subtotal)}</p>
        <p className="text-anthracite-soft">
          {shipping === 0 ? "Versand: kostenlos" : `Versand (Schätzung): ${formatPrice(shipping)}`}
        </p>
        <p className="text-lg font-medium">Gesamt: {formatPrice(subtotal + shipping)}</p>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href="/checkout"
          className="rounded-full bg-anthracite px-8 py-3 text-sm font-medium text-white hover:bg-anthracite-soft"
        >
          Zur Kasse
        </Link>
      </div>
    </div>
  );
}
