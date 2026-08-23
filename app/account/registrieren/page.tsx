import Link from "next/link";
import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Registrieren" };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="font-script text-3xl text-anthracite">Konto erstellen</h1>
      <RegisterForm />
      <p className="mt-6 text-sm text-anthracite-soft">
        Schon ein Konto?{" "}
        <Link href="/account/login" className="text-anthracite underline">
          Anmelden
        </Link>
      </p>
    </div>
  );
}
