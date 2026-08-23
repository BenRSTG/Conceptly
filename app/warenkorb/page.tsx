import type { Metadata } from "next";

export const metadata: Metadata = { title: "Warenkorb" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <h1 className="font-script text-4xl text-anthracite">Warenkorb</h1>
      <p className="mt-4 text-sm text-anthracite-soft">
        Dein Warenkorb ist noch leer — der Checkout folgt in Kürze.
      </p>
    </div>
  );
}
