import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Anmelden" };

export default function CustomerLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="font-script text-3xl text-anthracite">Anmelden</h1>
      <LoginForm />
      <p className="mt-6 text-sm text-anthracite-soft">
        Noch kein Konto?{" "}
        <Link href="/account/registrieren" className="text-anthracite underline">
          Jetzt registrieren
        </Link>
      </p>
    </div>
  );
}
