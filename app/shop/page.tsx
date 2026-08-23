import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, slug, title, base_price, sale_price, currency")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-script text-4xl text-anthracite">Shop</h1>

      {products && products.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <a
              key={product.id}
              href={`/shop/${product.slug}`}
              className="group rounded-2xl border border-anthracite/10 p-4 transition-colors hover:border-sand-dark"
            >
              <div className="aspect-square rounded-xl bg-cream" />
              <p className="mt-3 text-sm font-medium text-anthracite">
                {product.title}
              </p>
              <p className="text-sm text-anthracite-soft">
                {formatPrice(
                  product.sale_price ?? product.base_price,
                  product.currency,
                )}
              </p>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-anthracite-soft">
          Unser Sortiment wird gerade kuratiert — die ersten Produkte
          erscheinen hier in Kürze.
        </p>
      )}
    </div>
  );
}
