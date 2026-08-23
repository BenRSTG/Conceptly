import { NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/lib/checkout/schema";
import { createPendingOrder, attachPaymentReference, CheckoutError } from "@/lib/orders";
import { getStripeClient } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const parsed = checkoutRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  try {
    const supabaseSession = await createClient();
    const {
      data: { user },
    } = await supabaseSession.auth.getUser();

    const { order, items } = await createPendingOrder(
      parsed.data.items,
      parsed.data.email,
      parsed.data.address,
      user?.id,
    );

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const stripe = getStripeClient();

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.product_title_snapshot },
        unit_amount: Math.round(item.unit_price * 100),
      },
      quantity: item.quantity,
    }));

    if (order.shipping_cost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Versand" },
          unit_amount: Math.round(order.shipping_cost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: parsed.data.email,
      success_url: `${siteUrl}/checkout/erfolg?order=${order.order_number}`,
      cancel_url: `${siteUrl}/warenkorb`,
      metadata: { order_id: order.id, order_number: order.order_number },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe-Session ohne URL." }, { status: 502 });
    }

    await attachPaymentReference(order.id, "stripe", session.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof CheckoutError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Checkout fehlgeschlagen." }, { status: 500 });
  }
}
