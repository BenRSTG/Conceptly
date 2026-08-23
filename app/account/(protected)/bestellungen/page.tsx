import Link from "next/link";
import type { Metadata } from "next";
import { requireCustomer } from "@/lib/auth/customer";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Meine Bestellungen" };

const STATUS_LABELS: Record<string, string> = {
  pending: "Ausstehend",
  paid: "Bezahlt",
  processing: "In Bearbeitung",
  shipped: "Versendet",
  fulfilled: "Abgeschlossen",
  cancelled: "Storniert",
  refunded: "Erstattet",
};

export default async function OrdersPage() {
  const { supabase, user } = await requireCustomer();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-script text-3xl text-anthracite">Meine Bestellungen</h1>

      {orders && orders.length > 0 ? (
        <ul className="mt-6 divide-y divide-anthracite/10 rounded-2xl border border-anthracite/10">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <Link
                  href={`/account/bestellungen/${order.id}`}
                  className="font-medium text-anthracite hover:underline"
                >
                  {order.order_number}
                </Link>
                <p className="text-xs text-anthracite-soft">
                  {new Date(order.created_at).toLocaleDateString("de-DE")}
                </p>
              </div>
              <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-anthracite">
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
              <span className="font-medium text-anthracite">{formatPrice(order.total)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-anthracite-soft">
          Noch keine Bestellungen.{" "}
          <Link href="/shop" className="underline">
            Jetzt shoppen
          </Link>
        </p>
      )}
    </div>
  );
}
