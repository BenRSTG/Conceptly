import "server-only";
import { Client, Environment, OrdersController } from "@paypal/paypal-server-sdk";

export function getPaypalOrdersController() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error("PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET sind nicht gesetzt.");
  }

  const client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: process.env.PAYPAL_CLIENT_ID,
      oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    },
    environment: process.env.PAYPAL_ENV === "production" ? Environment.Production : Environment.Sandbox,
  });

  return new OrdersController(client);
}

export function paypalApiBaseUrl() {
  return process.env.PAYPAL_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}
