import type { Metadata } from "next";
import { LegalPage, PlaceholderNotice } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Versand & Lieferzeiten" };

export default function VersandPage() {
  return (
    <LegalPage title="Versand & Lieferzeiten">
      <PlaceholderNotice />

      <h2>Liefergebiet</h2>
      <p>Wir versenden aktuell innerhalb Deutschlands. [Ggf. EU-Versand ergänzen.]</p>

      <h2>Versandkosten</h2>
      <p>
        Die Versandkosten staffeln sich nach Gewicht und Bestellwert und
        werden im Checkout vor Kaufabschluss angezeigt. [Konkrete
        Staffelpreise ergänzen, z. B. ab 60 € versandkostenfrei.]
      </p>

      <h2>Lieferzeit</h2>
      <p>
        Die Lieferzeit beträgt in der Regel 2–5 Werktage nach Zahlungseingang,
        sofern die bestellte Ware nicht anders gekennzeichnet ist.
      </p>
    </LegalPage>
  );
}
