import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { formatPrice } from "@/lib/utils";
import { StatusForm } from "./StatusForm";

export const metadata: Metadata = { title: "Bestelldetails" };

export default async function AdminOrderDetailPage({
  params,
}: PageProps<"/admin/bestellungen/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order) notFound();

  const { data: items } = await supabase.from("order_items").select("*").eq("order_id", id);
  const shippingAddress = order.shipping_address as Record<string, string> | null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-script text-3xl text-anthracite">Bestellung {order.order_number}</h1>
        {order.customer_id && (
          <Link
            href={`/admin/kunden/${order.customer_id}?nachricht=1`}
            className="rounded-full border border-anthracite/20 px-4 py-2 text-sm font-medium text-anthracite hover:bg-cream"
          >
            Kunde anschreiben
          </Link>
        )}
      </div>
      <p className="mt-1 text-sm text-anthracite-soft">{order.customer_email}</p>

      <div className="mt-6">
        <StatusForm orderId={id} currentStatus={order.status} currentTrackingNumber={order.tracking_number} />
      </div>

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
