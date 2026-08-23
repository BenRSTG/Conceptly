import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

/** Lazily constructed so a missing RESEND_API_KEY doesn't crash the build. */
export function getResendClient() {
  if (!client) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY ist nicht gesetzt.");
    }
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

export const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Conceptly <bestellung@conceptly.example>";
