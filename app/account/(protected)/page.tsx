import Link from "next/link";
import type { Metadata } from "next";
import { requireCustomer } from "@/lib/auth/customer";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Mein Konto" };

const STATUS_LABELS: Record<string, string> = {
  pending: "Ausstehend",
  paid: "Bezahlt",
  processing: "In Bearbeitung",
  shipped: "Versendet",
  fulfilled: "Abgeschlossen",
  cancelled: "Storniert",
  refunded: "Erstattet",
};

export default async function AccountOverviewPage() {
  const { supabase, user } = await requireCustomer();

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div>
      <h1 className="font-script text-3xl text-anthracite">Willkommen zurück</h1>
      <p className="mt-2 text-sm text-anthracite-soft">{user.email}</p>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
            Letzte Bestellungen
          </h2>
          <Link href="/account/bestellungen" className="text-xs text-anthracite underline">
            Alle ansehen
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <ul className="mt-3 divide-y divide-anthracite/10 rounded-2xl border border-anthracite/10">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <Link href={`/account/bestellungen/${order.id}`} className="text-anthracite hover:underline">
                  {order.order_number}
                </Link>
                <span className="text-anthracite-soft">{STATUS_LABELS[order.status] ?? order.status}</span>
                <span className="font-medium text-anthracite">{formatPrice(order.total)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-anthracite-soft">Noch keine Bestellungen.</p>
        )}
      </div>
    </div>
  );
}
