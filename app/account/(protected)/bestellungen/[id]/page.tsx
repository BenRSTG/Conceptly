import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireCustomer } from "@/lib/auth/customer";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Bestelldetails" };

const STATUS_LABELS: Record<string, string> = {
  pending: "Ausstehend",
  paid: "Bezahlt",
  processing: "In Bearbeitung",
  shipped: "Versendet",
  fulfilled: "Abgeschlossen",
  cancelled: "Storniert",
  refunded: "Erstattet",
};

const STATUS_STEPS = ["paid", "processing", "shipped", "fulfilled"];

export default async function OrderDetailPage({
  params,
}: PageProps<"/account/bestellungen/[id]">) {
  const { id } = await params;
  const { supabase } = await requireCustomer();

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order) notFound();

  const { data: items } = await supabase.from("order_items").select("*").eq("order_id", id);
  const shippingAddress = order.shipping_address as Record<string, string> | null;
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div>
      <h1 className="font-script text-3xl text-anthracite">Bestellung {order.order_number}</h1>
      <p className="mt-1 text-sm text-anthracite-soft">
        {new Date(order.created_at).toLocaleDateString("de-DE")}
      </p>

      {currentStepIndex >= 0 && (
        <div className="mt-6 flex items-center gap-2 text-xs">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 font-medium ${
                  i <= currentStepIndex ? "bg-anthracite text-white" : "bg-cream text-anthracite-soft"
                }`}
              >
                {STATUS_LABELS[step]}
              </span>
              {i < STATUS_STEPS.length - 1 && <span className="text-anthracite-soft">→</span>}
            </div>
          ))}
        </div>
      )}
      {currentStepIndex < 0 && (
        <span className="mt-6 inline-block rounded-full bg-cream px-3 py-1 text-xs font-medium text-anthracite">
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      )}

      {order.tracking_number && (
        <p className="mt-4 text-sm text-anthracite">
          Sendungsnummer: <span className="font-medium">{order.tracking_number}</span>
        </p>
      )}

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
            Positionen
          </h2>
          <ul className="mt-3 divide-y divide-anthracite/10 rounded-2xl border border-anthracite/10">
            {(items ?? []).map((item) => (
              <li key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-anthracite">
                  {item.quantity}× {item.product_title_snapshot}
                </span>
                <span className="text-anthracite-soft">
                  {formatPrice(item.unit_price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 text-right text-sm text-anthracite">
            <p>Zwischensumme: {formatPrice(order.subtotal)}</p>
            <p>Versand: {formatPrice(order.shipping_cost)}</p>
            <p className="font-medium">Gesamt: {formatPrice(order.total)}</p>
          </div>
        </div>

        {shippingAddress && (
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
              Lieferadresse
            </h2>
            <p className="mt-3 text-sm text-anthracite-soft">
              {shippingAddress.full_name}
              <br />
              {shippingAddress.street} {shippingAddress.house_number}
              <br />
              {shippingAddress.postal_code} {shippingAddress.city}
              <br />
              {shippingAddress.country}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
