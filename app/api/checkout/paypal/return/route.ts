import { NextResponse, type NextRequest } from "next/server";
import { getPaypalOrdersController } from "@/lib/paypal";
import { markOrderPaid } from "@/lib/orders";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order_id");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  if (!orderId) {
    return NextResponse.redirect(`${siteUrl}/warenkorb`);
  }

  const supabase = createServiceClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, order_number, payment_reference")
    .eq("id", orderId)
    .maybeSingle();

  if (!order?.payment_reference) {
    return NextResponse.redirect(`${siteUrl}/warenkorb`);
  }

  try {
    const ordersController = getPaypalOrdersController();
    await ordersController.captureOrder({ id: order.payment_reference });
    await markOrderPaid(order.id);
  } catch {
    return NextResponse.redirect(`${siteUrl}/checkout/fehlgeschlagen`);
  }

  return NextResponse.redirect(`${siteUrl}/checkout/erfolg?order=${order.order_number}`);
}
