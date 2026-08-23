import { NextResponse } from "next/server";
import { paypalApiBaseUrl } from "@/lib/paypal";
import { markOrderPaid } from "@/lib/orders";

async function getPaypalAccessToken() {
  const basicAuth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch(`${paypalApiBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token as string;
}

export async function POST(request: Request) {
  if (!process.env.PAYPAL_WEBHOOK_ID) {
    return NextResponse.json({ error: "Webhook nicht konfiguriert." }, { status: 400 });
  }

  const rawBody = await request.text();
  const event = JSON.parse(rawBody);

  const accessToken = await getPaypalAccessToken();
  const verifyRes = await fetch(`${paypalApiBaseUrl()}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_algo: request.headers.get("paypal-auth-algo"),
      cert_url: request.headers.get("paypal-cert-url"),
      transmission_id: request.headers.get("paypal-transmission-id"),
      transmission_sig: request.headers.get("paypal-transmission-sig"),
      transmission_time: request.headers.get("paypal-transmission-time"),
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: event,
    }),
  });
  const verifyData = await verifyRes.json();

  if (verifyData.verification_status !== "SUCCESS") {
    return NextResponse.json({ error: "Ungültige Signatur." }, { status: 400 });
  }

  if (event.event_type === "CHECKOUT.ORDER.APPROVED" || event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const customId =
      event.resource?.custom_id ?? event.resource?.purchase_units?.[0]?.custom_id ?? null;
    if (customId) await markOrderPaid(customId);
  }

  return NextResponse.json({ received: true });
}
