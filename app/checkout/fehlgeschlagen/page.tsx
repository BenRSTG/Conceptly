import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Zahlung fehlgeschlagen" };

export default function CheckoutFailedPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <h1 className="font-script text-4xl text-anthracite">Zahlung fehlgeschlagen</h1>
      <p className="mt-4 text-sm text-anthracite-soft">
        Bei der Zahlungsabwicklung ist etwas schiefgelaufen. Dein Warenkorb ist noch da — bitte
        versuche es erneut.
      </p>
      <Link
        href="/warenkorb"
        className="mt-8 inline-flex items-center rounded-full bg-anthracite px-6 py-3 text-sm font-medium text-white hover:bg-anthracite-soft"
      >
        Zurück zum Warenkorb
      </Link>
    </div>
  );
}
