import Link from "next/link";
import { signOutCustomer } from "@/app/account/login/actions";

const LINKS = [
  { href: "/account", label: "Übersicht" },
  { href: "/account/bestellungen", label: "Bestellungen" },
  { href: "/account/adressen", label: "Adressen" },
  { href: "/account/nachrichten", label: "Nachrichten" },
  { href: "/account/profil", label: "Profil" },
];

export function AccountNav() {
  return (
    <nav className="w-48 shrink-0 space-y-1 text-sm">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="block rounded-lg px-3 py-2 font-medium text-anthracite-soft transition-colors hover:bg-cream hover:text-anthracite"
        >
          {link.label}
        </Link>
      ))}
      <form action={signOutCustomer}>
        <button
          type="submit"
          className="block w-full rounded-lg px-3 py-2 text-left font-medium text-anthracite-soft transition-colors hover:bg-cream hover:text-anthracite"
        >
          Abmelden
        </button>
      </form>
    </nav>
  );
}
