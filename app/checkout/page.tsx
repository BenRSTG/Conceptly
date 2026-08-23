"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { calculateShipping } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "mt-1 w-full rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none";
const labelClass = "block text-xs font-medium text-anthracite-soft";

export default function CheckoutPage() {
  const { items, subtotal, totalWeightGrams } = useCart();
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "DE",
  });
  const [pending, setPending] = useState<"stripe" | "paypal" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Für eingeloggte Kunden E-Mail + Standardadresse vorausfüllen — rein
    // komfortbedingt, der Checkout funktioniert unverändert als Gast.
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setEmail((current) => current || user.email || "");

      const { data: customer } = await supabase
        .from("customers")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      const { data: defaultAddress } = await supabase
        .from("addresses")
        .select("street, house_number, postal_code, city, country")
        .eq("customer_id", user.id)
        .eq("is_default", true)
        .maybeSingle();

      if (customer || defaultAddress) {
        setAddress((current) => ({
          fullName: current.fullName || customer?.full_name || "",
          street: current.street || defaultAddress?.street || "",
          houseNumber: current.houseNumber || defaultAddress?.house_number || "",
          postalCode: current.postalCode || defaultAddress?.postal_code || "",
          city: current.city || defaultAddress?.city || "",
          country: defaultAddress?.country || current.country,
        }));
      }
    });
  }, []);

  const shipping = items.length > 0 ? calculateShipping(subtotal, totalWeightGrams) : 0;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <h1 className="font-script text-4xl text-anthracite">Kasse</h1>
        <p className="mt-4 text-sm text-anthracite-soft">Dein Warenkorb ist leer.</p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center rounded-full bg-anthracite px-6 py-3 text-sm font-medium text-white hover:bg-anthracite-soft"
        >
          Shop entdecken
        </Link>
      </div>
    );
  }

  async function startCheckout(provider: "stripe" | "paypal") {
    setError(null);

    if (!email || !address.fullName || !address.street || !address.houseNumber || !address.postalCode || !address.city) {
      setError("Bitte alle Pflichtfelder ausfüllen.");
      return;
    }

    setPending(provider);
    try {
      const res = await fetch(`/api/checkout/${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          email,
          address,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Checkout fehlgeschlagen.");
        setPending(null);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Checkout fehlgeschlagen. Bitte erneut versuchen.");
      setPending(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-script text-4xl text-anthracite">Kasse</h1>
      <p className="mt-2 text-sm text-anthracite-soft">
        Kein Konto nötig — mit{" "}
        <Link href="/account/login" className="underline">
          Login
        </Link>{" "}
        findest du deine Bestellungen später im Kundenbereich wieder und E-Mail/Adresse werden
        vorausgefüllt.
      </p>

      <div className="mt-8 space-y-4">
        <div>
          <label className={labelClass}>E-Mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Name</label>
          <input
            required
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className={labelClass}>Straße</label>
            <input
              required
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Hausnr.</label>
            <input
              required
              value={address.houseNumber}
              onChange={(e) => setAddress({ ...address, houseNumber: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>PLZ</label>
            <input
              required
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Stadt</label>
            <input
              required
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Land</label>
          <select
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            className={inputClass}
          >
            <option value="DE">Deutschland</option>
            <option value="AT">Österreich</option>
            <option value="CH">Schweiz</option>
          </select>
        </div>
      </div>

      <div className="mt-8 space-y-1 text-right text-sm text-anthracite">
        <p>Zwischensumme: {formatPrice(subtotal)}</p>
        <p className="text-anthracite-soft">
          {shipping === 0 ? "Versand: kostenlos" : `Versand: ${formatPrice(shipping)}`}
        </p>
        <p className="text-lg font-medium">Gesamt: {formatPrice(subtotal + shipping)}</p>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => startCheckout("stripe")}
          disabled={pending !== null}
          className="flex-1 rounded-full bg-anthracite px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft disabled:opacity-60"
        >
          {pending === "stripe" ? "Weiterleitung…" : "Mit Karte bezahlen (Stripe)"}
        </button>
        <button
          onClick={() => startCheckout("paypal")}
          disabled={pending !== null}
          className="flex-1 rounded-full border border-anthracite/20 px-6 py-3 text-sm font-medium text-anthracite transition-colors hover:bg-cream disabled:opacity-60"
        >
          {pending === "paypal" ? "Weiterleitung…" : "Mit PayPal bezahlen"}
        </button>
      </div>

      <p className="mt-8 text-xs text-anthracite-soft">
        Mit dem Kauf akzeptierst du unsere{" "}
        <Link href="/agb" className="underline">
          AGB
        </Link>{" "}
        und{" "}
        <Link href="/widerruf" className="underline">
          Widerrufsbelehrung
        </Link>
        .
      </p>
    </div>
  );
}
