import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripeClient() {
  if (!client) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY ist nicht gesetzt.");
    }
    client = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return client;
}
