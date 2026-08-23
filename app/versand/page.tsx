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
        Ab einem Bestellwert von 60 € versenden wir versandkostenfrei.
        Darunter staffeln sich die Versandkosten nach Gewicht: 4,95 € bis
        1 kg, 6,95 € bis 5 kg, darüber 9,95 €. [Platzhalterwerte — mit den
        tatsächlichen Versandkonditionen abgleichen; siehe
        <code>lib/shipping.ts</code>.]
      </p>

      <h2>Lieferzeit</h2>
      <p>
        Die Lieferzeit beträgt in der Regel 2–5 Werktage nach Zahlungseingang,
        sofern die bestellte Ware nicht anders gekennzeichnet ist.
      </p>
    </LegalPage>
  );
}
