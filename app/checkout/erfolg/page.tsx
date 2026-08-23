import Link from "next/link";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/service";
import { formatPrice } from "@/lib/utils";
import { ClearCartOnMount } from "./ClearCartOnMount";

export const metadata: Metadata = { title: "Bestellung bestätigt" };

export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/erfolg">) {
  const { order: orderNumber } = await searchParams;
  const supabase = createServiceClient();

  const order =
    typeof orderNumber === "string"
      ? (
          await supabase
            .from("orders")
            .select("order_number, status, total, subtotal, shipping_cost")
            .eq("order_number", orderNumber)
            .maybeSingle()
        ).data
      : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <ClearCartOnMount />
      <h1 className="font-script text-4xl text-anthracite">Danke für deine Bestellung!</h1>
      {order ? (
        <div className="mt-6 space-y-1 text-sm text-anthracite-soft">
          <p>Bestellnummer: {order.order_number}</p>
          <p>
            Status:{" "}
            {order.status === "paid"
              ? "bezahlt — wir bereiten deine Bestellung vor"
              : "wird verarbeitet"}
          </p>
          <p className="font-medium text-anthracite">Gesamt: {formatPrice(order.total)}</p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-anthracite-soft">
          Eine Bestätigungsmail ist unterwegs.
        </p>
      )}
      <Link
        href="/shop"
        className="mt-10 inline-flex items-center rounded-full bg-anthracite px-6 py-3 text-sm font-medium text-white hover:bg-anthracite-soft"
      >
        Weiter shoppen
      </Link>
    </div>
  );
}
