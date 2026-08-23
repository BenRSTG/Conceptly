import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProductTable } from "./ProductTable";
import type { ProductStatus } from "@/lib/types/database";

const STATUS_VALUES: ProductStatus[] = ["draft", "published", "archived"];

export const metadata: Metadata = { title: "Produkte" };

export default async function AdminProductsPage({
  searchParams,
}: PageProps<"/admin/produkte">) {
  const { status, category, q } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order");

  let query = supabase
    .from("products")
    .select(
      "id, title, slug, status, base_price, sale_price, currency, stock_quantity, low_stock_threshold, stock_tracking, category_id",
    )
    .order("created_at", { ascending: false });

  if (typeof status === "string" && STATUS_VALUES.includes(status as ProductStatus)) {
    query = query.eq("status", status as ProductStatus);
  }
  if (typeof category === "string" && category) query = query.eq("category_id", category);
  if (typeof q === "string" && q) query = query.ilike("title", `%${q}%`);

  const { data: products } = await query;
  const categoryNameById = new Map((categories ?? []).map((c) => [c.id, c.name]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-script text-3xl text-anthracite">Produkte</h1>
        <Link
          href="/admin/produkte/neu"
          className="rounded-full bg-anthracite px-4 py-2 text-sm font-medium text-white hover:bg-anthracite-soft"
        >
          + Neues Produkt
        </Link>
      </div>

      <form className="mt-6 flex flex-wrap gap-3 text-sm">
        <input
          type="text"
          name="q"
          defaultValue={typeof q === "string" ? q : ""}
          placeholder="Suche nach Titel…"
          className="rounded-lg border border-anthracite/20 px-3 py-1.5 focus:border-sand-dark focus:outline-none"
        />
        <select
          name="status"
          defaultValue={typeof status === "string" ? status : ""}
          className="rounded-lg border border-anthracite/20 px-3 py-1.5"
        >
          <option value="">Alle Status</option>
          <option value="draft">Entwurf</option>
          <option value="published">Veröffentlicht</option>
          <option value="archived">Archiviert</option>
        </select>
        <select
          name="category"
          defaultValue={typeof category === "string" ? category : ""}
          className="rounded-lg border border-anthracite/20 px-3 py-1.5"
        >
          <option value="">Alle Kategorien</option>
          {(categories ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg border border-anthracite/20 px-3 py-1.5 hover:bg-cream"
        >
          Filtern
        </button>
      </form>

      <div className="mt-6">
        <ProductTable
          products={products ?? []}
          categoryNameById={Object.fromEntries(categoryNameById)}
        />
      </div>
    </div>
  );
}
