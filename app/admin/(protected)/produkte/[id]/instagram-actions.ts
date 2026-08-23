"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { renderInstagramPostImage, type InstagramFormat } from "@/lib/instagram/renderPostImage";
import { generateInstagramCaption } from "@/lib/instagram/generateCaption";

export type GenerateInstagramPostState = {
  error?: string;
  asset?: {
    imageUrl: string;
    captionText: string;
    hashtags: string[];
  };
};

export async function generateInstagramPost(
  productId: string,
  format: InstagramFormat,
): Promise<GenerateInstagramPostState> {
  const { supabase } = await requireAdmin();

  const { data: product } = await supabase.from("products").select("*").eq("id", productId).maybeSingle();
  if (!product) return { error: "Produkt nicht gefunden." };

  const [{ data: primaryImage }, { data: category }] = await Promise.all([
    supabase
      .from("product_images")
      .select("storage_path")
      .eq("product_id", productId)
      .eq("is_primary", true)
      .maybeSingle(),
    product.category_id
      ? supabase.from("categories").select("name").eq("id", product.category_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const productImageUrl = primaryImage
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${primaryImage.storage_path}`
    : null;

  let imageBuffer: Buffer;
  try {
    imageBuffer = await renderInstagramPostImage({
      format,
      title: product.title,
      price: product.base_price,
      salePrice: product.sale_price,
      currency: product.currency,
      imageUrl: productImageUrl,
    });
  } catch {
    return { error: "Bildgenerierung fehlgeschlagen." };
  }

  const { captionText, hashtags } = generateInstagramCaption({
    title: product.title,
    shortDescription: product.short_description,
    categoryName: category?.name ?? null,
  });

  const storagePath = `${productId}/${Date.now()}-${format}.png`;
  const { error: uploadError } = await supabase.storage
    .from("instagram-posts")
    .upload(storagePath, imageBuffer, { contentType: "image/png" });
  if (uploadError) return { error: "Upload fehlgeschlagen." };

  const { error: insertError } = await supabase.from("instagram_post_assets").insert({
    product_id: productId,
    image_storage_path: storagePath,
    caption_text: captionText,
    hashtags,
    format,
  });
  if (insertError) return { error: "Speichern fehlgeschlagen." };

  revalidatePath(`/admin/produkte/${productId}`);

  return {
    asset: {
      imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/instagram-posts/${storagePath}`,
      captionText,
      hashtags,
    },
  };
}
