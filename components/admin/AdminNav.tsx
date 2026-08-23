import Link from "next/link";

const LINKS = [
  { href: "/admin", label: "Übersicht" },
  { href: "/admin/produkte", label: "Produkte" },
  { href: "/admin/kategorien", label: "Kategorien" },
  { href: "/admin/bestellungen", label: "Bestellungen" },
  { href: "/admin/kunden", label: "Kunden" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/reporting", label: "Reporting" },
];

export function AdminNav() {
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
    </nav>
  );
}
