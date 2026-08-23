import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { AddToCartForm } from "@/components/shop/AddToCartForm";
import { ViewItemTracker } from "@/components/shop/ViewItemTracker";

async function getProduct(slug: string) {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!product) return null;

  const [{ data: images }, { data: variants }] = await Promise.all([
    supabase
      .from("product_images")
      .select("storage_path, alt_text, is_primary, sort_order")
      .eq("product_id", product.id)
      .order("sort_order"),
    supabase
      .from("product_variants")
      .select("id, variant_name, price_override, stock_quantity")
      .eq("product_id", product.id),
  ]);

  return { product, images: images ?? [], variants: variants ?? [] };
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return {};
  return {
    title: data.product.seo_title || data.product.title,
    description: data.product.seo_description || data.product.short_description || undefined,
  };
}

export default async function ProductDetailPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) notFound();

  const { product, images, variants } = data;
  const publicBaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images`;
  const galleryImages = images.map((img) => ({
    url: `${publicBaseUrl}/${img.storage_path}`,
    alt: img.alt_text,
  }));
  const primaryImageUrl = galleryImages[0]?.url ?? null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <ViewItemTracker productId={product.id} />
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={galleryImages} title={product.title} />

        <div>
          <h1 className="font-script text-4xl text-anthracite">{product.title}</h1>
          {product.short_description && (
            <p className="mt-3 text-anthracite-soft">{product.short_description}</p>
          )}

          <div className="mt-6">
            <AddToCartForm
              productId={product.id}
              slug={product.slug}
              title={product.title}
              basePrice={product.base_price}
              salePrice={product.sale_price}
              currency={product.currency}
              weightGrams={product.weight_grams}
              stockTracking={product.stock_tracking}
              stockQuantity={product.stock_quantity}
              imageUrl={primaryImageUrl}
              variants={variants}
            />
          </div>

          {product.description && (
            <div className="mt-10 border-t border-anthracite/10 pt-6 text-sm whitespace-pre-line text-anthracite-soft">
              {product.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
