import type { Metadata } from "next";

export const metadata: Metadata = { title: "Konto" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <h1 className="font-script text-4xl text-anthracite">Konto</h1>
      <p className="mt-4 text-sm text-anthracite-soft">
        Login, Registrierung und dein Kundenbereich sind bald verfügbar.
      </p>
    </div>
  );
}
