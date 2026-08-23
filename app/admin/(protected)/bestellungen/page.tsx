import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Bestellungen" };

const STATUS_LABELS: Record<string, string> = {
  pending: "Ausstehend",
  paid: "Bezahlt",
  processing: "In Bearbeitung",
  shipped: "Versendet",
  fulfilled: "Abgeschlossen",
  cancelled: "Storniert",
  refunded: "Erstattet",
};

export default async function AdminOrdersPage({
  searchParams,
}: PageProps<"/admin/bestellungen">) {
  const { status } = await searchParams;
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("orders")
    .select("id, order_number, customer_email, status, total, created_at")
    .order("created_at", { ascending: false });

  if (typeof status === "string" && status) {
    query = query.eq(
      "status",
      status as "pending" | "paid" | "processing" | "shipped" | "fulfilled" | "cancelled" | "refunded",
    );
  }

  const { data: orders } = await query;

  return (
    <div>
      <h1 className="font-script text-3xl text-anthracite">Bestellungen</h1>

      <form className="mt-4 flex gap-3">
        <select
          name="status"
          defaultValue={typeof status === "string" ? status : ""}
          className="rounded-lg border border-anthracite/20 px-3 py-1.5 text-sm"
        >
          <option value="">Alle Status</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg border border-anthracite/20 px-3 py-1.5 text-sm hover:bg-cream"
        >
          Filtern
        </button>
      </form>

      <ul className="mt-4 divide-y divide-anthracite/10 rounded-2xl border border-anthracite/10">
        {(orders ?? []).map((order) => (
          <li key={order.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <Link href={`/admin/bestellungen/${order.id}`} className="font-medium text-anthracite hover:underline">
              {order.order_number}
            </Link>
            <span className="text-anthracite-soft">{order.customer_email}</span>
            <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-anthracite">
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
            <span className="font-medium text-anthracite">{formatPrice(order.total)}</span>
          </li>
        ))}
        {(!orders || orders.length === 0) && (
          <li className="px-4 py-6 text-center text-sm text-anthracite-soft">
            Noch keine Bestellungen.
          </li>
        )}
      </ul>
    </div>
  );
}
