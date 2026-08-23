"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import type { ProductStatus } from "@/lib/types/database";

const productSchema = z.object({
  title: z.string().trim().min(1, "Titel ist erforderlich."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug ist erforderlich.")
    .regex(/^[a-z0-9-]+$/, "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten."),
  short_description: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  category_id: z.string().uuid().optional().nullable().or(z.literal("")),
  base_price: z.coerce.number().min(0, "Preis darf nicht negativ sein."),
  sale_price: z.coerce.number().min(0).optional().nullable().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.coerce.boolean().default(false),
  weight_grams: z.coerce.number().int().min(0).optional().nullable().or(z.literal("")),
  stock_quantity: z.coerce.number().int().min(0).optional().nullable().or(z.literal("")),
  stock_tracking: z.coerce.boolean().default(true),
  low_stock_threshold: z.coerce.number().int().min(0).default(5),
  seo_title: z.string().trim().optional().nullable(),
  seo_description: z.string().trim().optional().nullable(),
});

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    short_description: formData.get("short_description") || null,
    description: formData.get("description") || null,
    category_id: formData.get("category_id") || null,
    base_price: formData.get("base_price"),
    sale_price: formData.get("sale_price") || null,
    status: formData.get("status"),
    featured: formData.get("featured") === "on",
    weight_grams: formData.get("weight_grams") || null,
    stock_quantity: formData.get("stock_quantity") || null,
    stock_tracking: formData.get("stock_tracking") === "on",
    low_stock_threshold: formData.get("low_stock_threshold") || 5,
    seo_title: formData.get("seo_title") || null,
    seo_description: formData.get("seo_description") || null,
  });
}

export type ProductFormState = { error?: string };

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const { supabase } = await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { category_id, sale_price, weight_grams, stock_quantity, ...rest } = parsed.data;

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...rest,
      category_id: category_id || null,
      sale_price: sale_price === "" || sale_price == null ? null : sale_price,
      weight_grams: weight_grams === "" || weight_grams == null ? null : weight_grams,
      stock_quantity: stock_quantity === "" || stock_quantity == null ? null : stock_quantity,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      error: error?.code === "23505" ? "Dieser Slug existiert bereits." : "Speichern fehlgeschlagen.",
    };
  }

  revalidatePath("/admin/produkte");
  redirect(`/admin/produkte/${data.id}`);
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const { supabase } = await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { category_id, sale_price, weight_grams, stock_quantity, ...rest } = parsed.data;

  const { error } = await supabase
    .from("products")
    .update({
      ...rest,
      category_id: category_id || null,
      sale_price: sale_price === "" || sale_price == null ? null : sale_price,
      weight_grams: weight_grams === "" || weight_grams == null ? null : weight_grams,
      stock_quantity: stock_quantity === "" || stock_quantity == null ? null : stock_quantity,
    })
    .eq("id", id);

  if (error) {
    return {
      error: error.code === "23505" ? "Dieser Slug existiert bereits." : "Speichern fehlgeschlagen.",
    };
  }

  revalidatePath("/admin/produkte");
  revalidatePath(`/admin/produkte/${id}`);
  return {};
}

export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/produkte");
}

export async function bulkUpdateStatus(ids: string[], status: ProductStatus) {
  const { supabase } = await requireAdmin();
  if (ids.length === 0) return;
  await supabase.from("products").update({ status }).in("id", ids);
  revalidatePath("/admin/produkte");
}

export async function bulkDeleteProducts(ids: string[]) {
  const { supabase } = await requireAdmin();
  if (ids.length === 0) return;
  await supabase.from("products").delete().in("id", ids);
  revalidatePath("/admin/produkte");
}

// --- Bilder -----------------------------------------------------------

export async function addProductImage(
  productId: string,
  storagePath: string,
  isPrimary: boolean,
) {
  const { supabase } = await requireAdmin();

  if (isPrimary) {
    await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId);
  }

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  await supabase.from("product_images").insert({
    product_id: productId,
    storage_path: storagePath,
    is_primary: isPrimary || count === 0,
    sort_order: count ?? 0,
  });

  revalidatePath(`/admin/produkte/${productId}`);
}

export async function deleteProductImage(productId: string, imageId: string, storagePath: string) {
  const { supabase } = await requireAdmin();
  await supabase.storage.from("product-images").remove([storagePath]);
  await supabase.from("product_images").delete().eq("id", imageId);
  revalidatePath(`/admin/produkte/${productId}`);
}

export async function setPrimaryImage(productId: string, imageId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId);
  await supabase.from("product_images").update({ is_primary: true }).eq("id", imageId);
  revalidatePath(`/admin/produkte/${productId}`);
}

// --- Varianten ----------------------------------------------------------

const variantSchema = z.object({
  variant_name: z.string().trim().min(1, "Variantenname ist erforderlich."),
  sku: z.string().trim().optional().nullable(),
  price_override: z.coerce.number().min(0).optional().nullable().or(z.literal("")),
  stock_quantity: z.coerce.number().int().min(0).optional().nullable().or(z.literal("")),
});

export type VariantFormState = { error?: string };

export async function addVariant(
  productId: string,
  _prevState: VariantFormState,
  formData: FormData,
): Promise<VariantFormState> {
  const { supabase } = await requireAdmin();
  const parsed = variantSchema.safeParse({
    variant_name: formData.get("variant_name"),
    sku: formData.get("sku") || null,
    price_override: formData.get("price_override") || null,
    stock_quantity: formData.get("stock_quantity") || null,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { variant_name, sku, price_override, stock_quantity } = parsed.data;
  const { error } = await supabase.from("product_variants").insert({
    product_id: productId,
    variant_name,
    sku: sku || null,
    price_override: price_override === "" || price_override == null ? null : price_override,
    stock_quantity: stock_quantity === "" || stock_quantity == null ? null : stock_quantity,
    attributes: {},
  });

  if (error) {
    return {
      error: error.code === "23505" ? "Diese SKU existiert bereits." : "Speichern fehlgeschlagen.",
    };
  }

  revalidatePath(`/admin/produkte/${productId}`);
  return {};
}

export async function deleteVariant(productId: string, variantId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("product_variants").delete().eq("id", variantId);
  revalidatePath(`/admin/produkte/${productId}`);
}
