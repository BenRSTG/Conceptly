import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const { kategorie, min, max, verfuegbar } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, name")
    .order("sort_order");

  let query = supabase
    .from("products")
    .select("id, slug, title, base_price, sale_price, currency, stock_quantity, stock_tracking, category_id")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const selectedCategory =
    typeof kategorie === "string" ? (categories ?? []).find((c) => c.slug === kategorie) : undefined;
  if (selectedCategory) query = query.eq("category_id", selectedCategory.id);
  if (typeof min === "string" && min) query = query.gte("base_price", Number(min));
  if (typeof max === "string" && max) query = query.lte("base_price", Number(max));

  const { data: products } = await query;
  const availableOnly = verfuegbar === "1";
  const filteredProducts = (products ?? []).filter(
    (p) => !availableOnly || !p.stock_tracking || (p.stock_quantity ?? 0) > 0,
  );

  const publicBaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images`;
  const productIds = filteredProducts.map((p) => p.id);
  const { data: primaryImages } = productIds.length
    ? await supabase
        .from("product_images")
        .select("product_id, storage_path")
        .in("product_id", productIds)
        .eq("is_primary", true)
    : { data: [] };
  const imageByProduct = new Map((primaryImages ?? []).map((img) => [img.product_id, img.storage_path]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-script text-4xl text-anthracite">Shop</h1>

      <form className="mt-6 flex flex-wrap items-end gap-3 text-sm">
        <div>
          <label className="block text-xs font-medium text-anthracite-soft">Kategorie</label>
          <select
            name="kategorie"
            defaultValue={typeof kategorie === "string" ? kategorie : ""}
            className="mt-1 rounded-lg border border-anthracite/20 px-3 py-1.5"
          >
            <option value="">Alle</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-anthracite-soft">Preis von (€)</label>
          <input
            name="min"
            type="number"
            min={0}
            defaultValue={typeof min === "string" ? min : ""}
            className="mt-1 w-24 rounded-lg border border-anthracite/20 px-3 py-1.5"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-anthracite-soft">Preis bis (€)</label>
          <input
            name="max"
            type="number"
            min={0}
            defaultValue={typeof max === "string" ? max : ""}
            className="mt-1 w-24 rounded-lg border border-anthracite/20 px-3 py-1.5"
          />
        </div>
        <label className="flex items-center gap-2 pb-2 text-anthracite">
          <input type="checkbox" name="verfuegbar" value="1" defaultChecked={availableOnly} />
          Nur verfügbare
        </label>
        <button
          type="submit"
          className="rounded-lg border border-anthracite/20 px-3 py-1.5 hover:bg-cream"
        >
          Filtern
        </button>
      </form>

      {filteredProducts.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => {
            const storagePath = imageByProduct.get(product.id);
            return (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group rounded-2xl border border-anthracite/10 p-4 transition-colors hover:border-sand-dark"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-cream">
                  {storagePath && (
                    <Image
                      src={`${publicBaseUrl}/${storagePath}`}
                      alt=""
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="mt-3 text-sm font-medium text-anthracite">{product.title}</p>
                <p className="text-sm text-anthracite-soft">
                  {formatPrice(product.sale_price ?? product.base_price, product.currency)}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="mt-10 text-sm text-anthracite-soft">
          Keine Produkte gefunden — versuch es mit anderen Filtern.
        </p>
      )}
    </div>
  );
}
