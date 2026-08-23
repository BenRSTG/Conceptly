import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Reporting" };

const REVENUE_STATUSES = ["paid", "processing", "shipped", "fulfilled"] as const;
const DAYS_BACK = 30;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default async function ReportingPage() {
  const { supabase } = await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - DAYS_BACK);
  const sinceIso = since.toISOString();

  const [
    { data: orders },
    { data: allPaidOrders },
    { data: events },
    { data: products },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total, status, customer_id, created_at")
      .in("status", REVENUE_STATUSES)
      .gte("created_at", sinceIso)
      .order("created_at"),
    supabase.from("orders").select("id, customer_id").in("status", REVENUE_STATUSES).not("customer_id", "is", null),
    supabase
      .from("shop_events")
      .select("event_type, product_id, metadata, created_at")
      .gte("created_at", sinceIso),
    supabase
      .from("products")
      .select("id, title, stock_quantity, low_stock_threshold, stock_tracking")
      .eq("stock_tracking", true)
      .order("stock_quantity", { ascending: true }),
  ]);

  const orderIds = (orders ?? []).map((o) => o.id);
  const { data: orderItems } = orderIds.length
    ? await supabase
        .from("order_items")
        .select("order_id, product_title_snapshot, quantity, unit_price")
        .in("order_id", orderIds)
    : { data: [] };

  // --- Umsatz über Zeit (Tage, letzte 30 Tage) ---
  const revenueByDay = new Map<string, number>();
  for (let i = 0; i < DAYS_BACK; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    revenueByDay.set(startOfDay(d).toISOString().slice(0, 10), 0);
  }
  for (const order of orders ?? []) {
    const key = startOfDay(new Date(order.created_at)).toISOString().slice(0, 10);
    revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + order.total);
  }
  const maxDailyRevenue = Math.max(1, ...revenueByDay.values());

  const orderCount = orders?.length ?? 0;
  const totalRevenue = (orders ?? []).reduce((sum, o) => sum + o.total, 0);
  const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

  // --- Top-Produkte ---
  const productStats = new Map<string, { revenue: number; quantity: number }>();
  for (const item of orderItems ?? []) {
    const entry = productStats.get(item.product_title_snapshot) ?? { revenue: 0, quantity: 0 };
    entry.revenue += item.unit_price * item.quantity;
    entry.quantity += item.quantity;
    productStats.set(item.product_title_snapshot, entry);
  }
  const topByRevenue = [...productStats.entries()].sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5);
  const topByQuantity = [...productStats.entries()].sort((a, b) => b[1].quantity - a[1].quantity).slice(0, 5);

  // --- Conversion-Funnel ---
  const funnelCounts = { view_item: 0, add_to_cart: 0, begin_checkout: 0, purchase: 0 };
  for (const event of events ?? []) {
    if (event.event_type in funnelCounts) {
      funnelCounts[event.event_type as keyof typeof funnelCounts] += 1;
    }
  }

  // --- Traffic-Quellen ---
  const trafficSources = new Map<string, number>();
  for (const event of events ?? []) {
    const source = (event.metadata as Record<string, string> | null)?.utm_source;
    if (source) trafficSources.set(source, (trafficSources.get(source) ?? 0) + 1);
  }

  // --- Wiederkaufsrate ---
  const ordersByCustomer = new Map<string, number>();
  for (const order of allPaidOrders ?? []) {
    if (!order.customer_id) continue;
    ordersByCustomer.set(order.customer_id, (ordersByCustomer.get(order.customer_id) ?? 0) + 1);
  }
  const totalCustomers = ordersByCustomer.size;
  const repeatCustomers = [...ordersByCustomer.values()].filter((n) => n >= 2).length;
  const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

  const lowStock = (products ?? []).filter(
    (p) => p.stock_quantity != null && p.stock_quantity <= p.low_stock_threshold,
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-script text-3xl text-anthracite">Reporting</h1>
        <div className="flex gap-2 text-xs">
          <a
            href="/api/admin/export/orders"
            className="rounded-full border border-anthracite/20 px-3 py-1.5 font-medium text-anthracite hover:bg-cream"
          >
            Bestellungen als CSV
          </a>
        </div>
      </div>
      <p className="mt-1 text-sm text-anthracite-soft">Letzte {DAYS_BACK} Tage</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-anthracite/10 p-5">
          <p className="text-2xl font-semibold text-anthracite">{formatPrice(totalRevenue)}</p>
          <p className="text-sm text-anthracite-soft">Umsatz</p>
        </div>
        <div className="rounded-2xl border border-anthracite/10 p-5">
          <p className="text-2xl font-semibold text-anthracite">{orderCount}</p>
          <p className="text-sm text-anthracite-soft">Bestellungen</p>
        </div>
        <div className="rounded-2xl border border-anthracite/10 p-5">
          <p className="text-2xl font-semibold text-anthracite">{formatPrice(averageOrderValue)}</p>
          <p className="text-sm text-anthracite-soft">Ø Bestellwert</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
          Umsatz pro Tag
        </h2>
        <div className="mt-3 flex h-32 items-end gap-1 rounded-2xl border border-anthracite/10 p-4">
          {[...revenueByDay.entries()].map(([day, revenue]) => (
            <div key={day} className="group relative flex-1">
              <div
                className="rounded-t bg-sand transition-colors group-hover:bg-sand-dark"
                style={{ height: `${Math.max(2, (revenue / maxDailyRevenue) * 100)}px` }}
              />
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 rounded bg-anthracite px-2 py-1 text-[10px] whitespace-nowrap text-white group-hover:block">
                {day}: {formatPrice(revenue)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
            Top-Produkte nach Umsatz
          </h2>
          <ul className="mt-3 divide-y divide-anthracite/10 rounded-2xl border border-anthracite/10">
            {topByRevenue.map(([title, stats]) => (
              <li key={title} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-anthracite">{title}</span>
                <span className="text-anthracite-soft">{formatPrice(stats.revenue)}</span>
              </li>
            ))}
            {topByRevenue.length === 0 && (
              <li className="px-4 py-4 text-center text-sm text-anthracite-soft">Keine Daten.</li>
            )}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
            Top-Produkte nach Stückzahl
          </h2>
          <ul className="mt-3 divide-y divide-anthracite/10 rounded-2xl border border-anthracite/10">
            {topByQuantity.map(([title, stats]) => (
              <li key={title} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-anthracite">{title}</span>
                <span className="text-anthracite-soft">{stats.quantity}×</span>
              </li>
            ))}
            {topByQuantity.length === 0 && (
              <li className="px-4 py-4 text-center text-sm text-anthracite-soft">Keine Daten.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
            Conversion-Funnel
          </h2>
          <ul className="mt-3 space-y-2">
            {(
              [
                ["view_item", "Produktansicht"],
                ["add_to_cart", "In den Warenkorb"],
                ["begin_checkout", "Checkout gestartet"],
                ["purchase", "Kauf abgeschlossen"],
              ] as const
            ).map(([key, label]) => (
              <li key={key} className="flex items-center justify-between text-sm">
                <span className="text-anthracite-soft">{label}</span>
                <span className="font-medium text-anthracite">{funnelCounts[key]}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
            Traffic-Quellen (UTM)
          </h2>
          {trafficSources.size > 0 ? (
            <ul className="mt-3 space-y-2">
              {[...trafficSources.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([source, count]) => (
                  <li key={source} className="flex items-center justify-between text-sm">
                    <span className="text-anthracite-soft">{source}</span>
                    <span className="font-medium text-anthracite">{count}</span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-anthracite-soft">
              Keine UTM-Parameter erfasst — Links mit ?utm_source=... teilen, um Quellen zu tracken.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
          Stammkund:innen
        </h2>
        <p className="mt-2 text-sm text-anthracite-soft">
          {repeatCustomers} von {totalCustomers} Kund:innen mit mehr als einer Bestellung (
          {repeatRate.toFixed(0)} % Wiederkaufsrate)
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
          Lagerbestand-Warnungen
        </h2>
        <ul className="mt-3 divide-y divide-anthracite/10 rounded-2xl border border-anthracite/10">
          {lowStock.map((p) => (
            <li key={p.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-anthracite">{p.title}</span>
              <span className="text-red-600">
                {p.stock_quantity} auf Lager (Schwelle {p.low_stock_threshold})
              </span>
            </li>
          ))}
          {lowStock.length === 0 && (
            <li className="px-4 py-4 text-center text-sm text-anthracite-soft">
              Kein Produkt unter der Warnschwelle.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
