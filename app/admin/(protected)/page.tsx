import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin-Übersicht" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: publishedCount }, { count: draftCount }, { data: lowStock }] =
    await Promise.all([
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("status", "draft"),
      supabase
        .from("products")
        .select("id, title, stock_quantity, low_stock_threshold")
        .eq("stock_tracking", true)
        .not("stock_quantity", "is", null)
        .order("stock_quantity", { ascending: true })
        .limit(20),
    ]);

  const lowStockProducts = (lowStock ?? []).filter(
    (p) => (p.stock_quantity ?? 0) <= p.low_stock_threshold,
  );

  return (
    <div>
      <h1 className="font-script text-3xl text-anthracite">Übersicht</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-anthracite/10 p-5">
          <p className="text-2xl font-semibold text-anthracite">
            {publishedCount ?? 0}
          </p>
          <p className="text-sm text-anthracite-soft">Veröffentlicht</p>
        </div>
        <div className="rounded-2xl border border-anthracite/10 p-5">
          <p className="text-2xl font-semibold text-anthracite">{draftCount ?? 0}</p>
          <p className="text-sm text-anthracite-soft">Entwürfe</p>
        </div>
        <div className="rounded-2xl border border-anthracite/10 p-5">
          <p className="text-2xl font-semibold text-anthracite">
            {lowStockProducts.length}
          </p>
          <p className="text-sm text-anthracite-soft">Niedriger Lagerbestand</p>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
            Lagerbestand-Warnungen
          </h2>
          <ul className="mt-3 divide-y divide-anthracite/10 rounded-2xl border border-anthracite/10">
            {lowStockProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <Link href={`/admin/produkte/${p.id}`} className="text-anthracite hover:underline">
                  {p.title}
                </Link>
                <span className="text-red-600">
                  {p.stock_quantity} auf Lager (Schwelle: {p.low_stock_threshold})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
