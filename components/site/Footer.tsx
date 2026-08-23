import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

const LEGAL_LINKS = [
  { href: "/impressum", label: "Impressum" },
  { href: "/agb", label: "AGB" },
  { href: "/widerruf", label: "Widerrufsbelehrung" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/versand", label: "Versand & Lieferzeiten" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-anthracite/10 bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 sm:grid-cols-3">
          <div>
            <Logo variant="full" className="items-start" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-anthracite-soft">
              Kuratierte Deko- und Lifestyle-Produkte für ein urbanes
              Zuhause mit Charakter.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
              Rechtliches
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-anthracite-soft">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-anthracite">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-anthracite-soft">
              Neue Stücke, kuratierte Empfehlungen — kein Spam.
            </p>
            <NewsletterForm source="footer" className="mt-4" />
          </div>
        </div>

        <p className="mt-16 text-xs text-anthracite-soft">
          © {new Date().getFullYear()} Conceptly. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
