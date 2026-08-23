import "server-only";
import crypto from "node:crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { calculateShipping } from "@/lib/shipping";
import { sendOrderConfirmationEmail } from "@/lib/email/orderConfirmation";
import type { PaymentProvider } from "@/lib/types/database";

export type CartItemInput = {
  productId: string;
  variantId: string | null;
  quantity: number;
};

export type CheckoutAddress = {
  fullName: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
};

export class CheckoutError extends Error {}

function generateOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `CO-${date}-${random}`;
}

/**
 * Re-prices the cart server-side from the database (never trusts client-sent
 * prices), validates stock, and creates a `pending` order + order_items.
 * Called before redirecting to Stripe/PayPal.
 */
export async function createPendingOrder(
  items: CartItemInput[],
  customerEmail: string,
  shippingAddress: CheckoutAddress,
) {
  if (items.length === 0) {
    throw new CheckoutError("Der Warenkorb ist leer.");
  }

  const supabase = createServiceClient();
  const productIds = [...new Set(items.map((i) => i.productId))];
  const variantIds = [...new Set(items.map((i) => i.variantId).filter((id): id is string => Boolean(id)))];

  const [{ data: products, error: productsError }, { data: variants, error: variantsError }] =
    await Promise.all([
      supabase.from("products").select("*").in("id", productIds),
      variantIds.length
        ? supabase.from("product_variants").select("*").in("id", variantIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

  if (productsError || variantsError || !products) {
    throw new CheckoutError("Produkte konnten nicht geladen werden.");
  }

  const productById = new Map(products.map((p) => [p.id, p]));
  const variantById = new Map((variants ?? []).map((v) => [v.id, v]));

  let subtotal = 0;
  let totalWeightGrams = 0;
  const orderItems: {
    product_id: string;
    variant_id: string | null;
    product_title_snapshot: string;
    quantity: number;
    unit_price: number;
  }[] = [];

  for (const line of items) {
    const product = productById.get(line.productId);
    if (!product || product.status !== "published") {
      throw new CheckoutError("Ein Produkt im Warenkorb ist nicht mehr verfügbar.");
    }

    const variant = line.variantId ? variantById.get(line.variantId) : null;
    if (line.variantId && !variant) {
      throw new CheckoutError("Eine gewählte Variante ist nicht mehr verfügbar.");
    }

    const stockQuantity = variant ? variant.stock_quantity : product.stock_quantity;
    if (product.stock_tracking && stockQuantity != null && stockQuantity < line.quantity) {
      throw new CheckoutError(`„${product.title}" ist nicht in ausreichender Menge auf Lager.`);
    }

    const unitPrice = variant?.price_override ?? product.sale_price ?? product.base_price;
    const title = variant ? `${product.title} – ${variant.variant_name}` : product.title;

    subtotal += unitPrice * line.quantity;
    totalWeightGrams += (product.weight_grams ?? 0) * line.quantity;

    orderItems.push({
      product_id: product.id,
      variant_id: variant?.id ?? null,
      product_title_snapshot: title,
      quantity: line.quantity,
      unit_price: unitPrice,
    });
  }

  const shippingCost = calculateShipping(subtotal, totalWeightGrams);
  const total = subtotal + shippingCost;
  // Deutsche Bruttopreise: 19% USt. sind bereits in subtotal enthalten,
  // tax_amount ist der ausgewiesene Anteil (informativ, keine Aufschlagung).
  const taxAmount = Math.round(((subtotal * 19) / 119) * 100) / 100;

  const addressJson = {
    full_name: shippingAddress.fullName,
    street: shippingAddress.street,
    house_number: shippingAddress.houseNumber,
    postal_code: shippingAddress.postalCode,
    city: shippingAddress.city,
    country: shippingAddress.country,
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: generateOrderNumber(),
      customer_email: customerEmail,
      subtotal: Math.round(subtotal * 100) / 100,
      shipping_cost: shippingCost,
      tax_amount: taxAmount,
      total: Math.round(total * 100) / 100,
      shipping_address: addressJson,
      billing_address: addressJson,
    })
    .select("*")
    .single();

  if (orderError || !order) {
    throw new CheckoutError("Bestellung konnte nicht angelegt werden.");
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    throw new CheckoutError("Bestellpositionen konnten nicht angelegt werden.");
  }

  return { order, items: orderItems };
}

export async function attachPaymentReference(
  orderId: string,
  provider: PaymentProvider,
  reference: string,
) {
  const supabase = createServiceClient();
  await supabase
    .from("orders")
    .update({ payment_provider: provider, payment_reference: reference })
    .eq("id", orderId);
}

/**
 * Idempotently marks an order as paid: skips if already paid, otherwise
 * reduces stock, logs stock_movements, and sends the confirmation email.
 * Called from both the payment-provider webhook and (for PayPal) the
 * synchronous return-redirect, whichever arrives first.
 */
export async function markOrderPaid(orderId: string) {
  const supabase = createServiceClient();

  const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) return;
  if (order.status !== "pending") return; // already processed — idempotent no-op

  const { data: items } = await supabase.from("order_items").select("*").eq("order_id", orderId);

  await supabase.from("orders").update({ status: "paid" }).eq("id", orderId);

  for (const item of items ?? []) {
    if (item.variant_id) {
      const { data: variant } = await supabase
        .from("product_variants")
        .select("stock_quantity")
        .eq("id", item.variant_id)
        .maybeSingle();
      if (variant?.stock_quantity != null) {
        await supabase
          .from("product_variants")
          .update({ stock_quantity: Math.max(0, variant.stock_quantity - item.quantity) })
          .eq("id", item.variant_id);
      }
    } else if (item.product_id) {
      const { data: product } = await supabase
        .from("products")
        .select("stock_quantity, stock_tracking")
        .eq("id", item.product_id)
        .maybeSingle();
      if (product?.stock_tracking && product.stock_quantity != null) {
        await supabase
          .from("products")
          .update({ stock_quantity: Math.max(0, product.stock_quantity - item.quantity) })
          .eq("id", item.product_id);
      }
    }

    await supabase.from("stock_movements").insert({
      product_id: item.product_id,
      variant_id: item.variant_id,
      change_amount: -item.quantity,
      reason: "order",
      order_id: orderId,
    });
  }

  try {
    await sendOrderConfirmationEmail(order, items ?? []);
  } catch {
    // Order is paid and stock is reduced either way — a failed confirmation
    // email shouldn't roll back the purchase. Ben can resend manually.
  }
}
