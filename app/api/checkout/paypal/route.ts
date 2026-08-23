import { NextResponse } from "next/server";
import {
  CheckoutPaymentIntent,
  PaypalExperienceUserAction,
  PaypalWalletContextShippingPreference,
} from "@paypal/paypal-server-sdk";
import { checkoutRequestSchema } from "@/lib/checkout/schema";
import { createPendingOrder, attachPaymentReference, CheckoutError } from "@/lib/orders";
import { getPaypalOrdersController } from "@/lib/paypal";
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
    const ordersController = getPaypalOrdersController();

    const { result } = await ordersController.createOrder({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            referenceId: order.order_number,
            customId: order.id,
            amount: {
              currencyCode: "EUR",
              value: order.total.toFixed(2),
              breakdown: {
                itemTotal: { currencyCode: "EUR", value: order.subtotal.toFixed(2) },
                shipping: { currencyCode: "EUR", value: order.shipping_cost.toFixed(2) },
              },
            },
            items: items.map((item) => ({
              name: item.product_title_snapshot.slice(0, 127),
              quantity: String(item.quantity),
              unitAmount: { currencyCode: "EUR", value: item.unit_price.toFixed(2) },
            })),
          },
        ],
        paymentSource: {
          paypal: {
            experienceContext: {
              returnUrl: `${siteUrl}/api/checkout/paypal/return?order_id=${order.id}`,
              cancelUrl: `${siteUrl}/warenkorb`,
              userAction: PaypalExperienceUserAction.PayNow,
              shippingPreference: PaypalWalletContextShippingPreference.NoShipping,
            },
          },
        },
      },
    });

    const approveLink = result.links?.find((link) => link.rel === "payer-action")?.href;
    if (!result.id || !approveLink) {
      return NextResponse.json({ error: "PayPal-Order ohne Freigabe-Link." }, { status: 502 });
    }

    await attachPaymentReference(order.id, "paypal", result.id);

    return NextResponse.json({ url: approveLink });
  } catch (err) {
    if (err instanceof CheckoutError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Checkout fehlgeschlagen." }, { status: 500 });
  }
}
