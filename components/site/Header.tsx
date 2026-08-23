import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CartLink } from "@/components/site/CartLink";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/#kategorien", label: "Kategorien" },
  { href: "/#ueber-uns", label: "Über uns" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-anthracite/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Conceptly Startseite">
          <Logo variant="compact" className="w-28 sm:w-32" priority />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium tracking-wide text-anthracite sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-sand-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm font-medium text-anthracite">
          <Link href="/account" className="hover:text-sand-dark">
            Konto
          </Link>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
