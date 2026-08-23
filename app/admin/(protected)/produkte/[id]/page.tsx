import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { updateProduct } from "../actions";
import { ProductEditor } from "./ProductEditor";
import { ImageUploader } from "./ImageUploader";
import { VariantEditor } from "./VariantEditor";
import { InstagramGenerator } from "./InstagramGenerator";

export const metadata: Metadata = { title: "Produkt bearbeiten" };

export default async function EditProductPage({
  params,
}: PageProps<"/admin/produkte/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }, { data: images }, { data: variants }, { data: instagramAssets }] =
    await Promise.all([
      supabase.from("products").select("*").eq("id", id).maybeSingle(),
      supabase.from("categories").select("id, name").order("sort_order"),
      supabase
        .from("product_images")
        .select("id, storage_path, is_primary")
        .eq("product_id", id)
        .order("sort_order"),
      supabase
        .from("product_variants")
        .select("id, variant_name, sku, price_override, stock_quantity")
        .eq("product_id", id),
      supabase
        .from("instagram_post_assets")
        .select("id, image_storage_path, caption_text, hashtags, format, created_at")
        .eq("product_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (!product) notFound();

  const publicBaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images`;
  const primaryImage = images?.find((img) => img.is_primary) ?? images?.[0];

  return (
    <div>
      <h1 className="font-script text-3xl text-anthracite">{product.title}</h1>

      <div className="mt-8">
        <ProductEditor
          action={updateProduct.bind(null, id)}
          categories={categories ?? []}
          defaultValues={product}
          imageUrl={primaryImage ? `${publicBaseUrl}/${primaryImage.storage_path}` : null}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">Bilder</h2>
        <div className="mt-3">
          <ImageUploader productId={id} images={images ?? []} publicBaseUrl={publicBaseUrl} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">Varianten</h2>
        <div className="mt-3">
          <VariantEditor productId={id} variants={variants ?? []} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
          Instagram-Post
        </h2>
        <div className="mt-3">
          <InstagramGenerator
            productId={id}
            publicBaseUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/instagram-posts`}
            pastAssets={instagramAssets ?? []}
          />
        </div>
      </div>
    </div>
  );
}
