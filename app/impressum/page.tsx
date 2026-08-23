import type { Metadata } from "next";
import { LegalPage, PlaceholderNotice } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <PlaceholderNotice />
      <p>Angaben gemäß § 5 TMG</p>
      <p>
        [Vorname Nachname / Firmenname]
        <br />
        [Straße Hausnummer]
        <br />
        [PLZ Ort]
        <br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: [Telefonnummer]
        <br />
        E-Mail: [kontakt@conceptly.example]
      </p>

      <h2>Umsatzsteuer-ID</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
        <br />
        [USt-IdNr.]
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>[Vorname Nachname, Anschrift wie oben]</p>

      <h2>EU-Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur
        Online-Streitbeilegung (OS) bereit:{" "}
        <a
          href="https://ec.europa.eu/consumers/odr/"
          className="underline"
        >
          https://ec.europa.eu/consumers/odr/
        </a>
        . Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht
        verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor
        einer Verbraucherschlichtungsstelle teilzunehmen.
      </p>
    </LegalPage>
  );
}
