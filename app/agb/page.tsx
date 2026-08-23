import type { Metadata } from "next";
import { LegalPage, PlaceholderNotice } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "AGB" };

export default function AgbPage() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <PlaceholderNotice />

      <h2>§ 1 Geltungsbereich</h2>
      <p>
        Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge über
        die Lieferung von Waren, die ein Verbraucher oder Unternehmer
        (nachfolgend „Kunde&rdquo;) mit Conceptly, [Anschrift] (nachfolgend
        „Verkäufer&rdquo;), über den Onlineshop conceptly.example schließt.
      </p>

      <h2>§ 2 Vertragsschluss</h2>
      <p>
        Die Darstellung der Produkte im Onlineshop stellt kein rechtlich
        bindendes Angebot, sondern einen unverbindlichen Online-Katalog dar.
        Mit Absenden der Bestellung im letzten Schritt des Bestellvorgangs
        gibt der Kunde ein verbindliches Angebot ab. Der Verkäufer bestätigt
        den Eingang der Bestellung per E-Mail; diese Bestätigung stellt noch
        keine Annahme des Vertrags dar. Der Kaufvertrag kommt erst mit der
        Versandbestätigung oder Lieferung der Ware zustande.
      </p>

      <h2>§ 3 Preise und Versandkosten</h2>
      <p>
        Alle Preise verstehen sich inklusive der gesetzlichen Umsatzsteuer.
        Zusätzlich anfallende Versandkosten werden im Bestellprozess
        gesondert ausgewiesen, siehe auch{" "}
        <a href="/versand" className="underline">
          Versand &amp; Lieferzeiten
        </a>
        .
      </p>

      <h2>§ 4 Zahlung</h2>
      <p>
        Die Zahlung erfolgt wahlweise per Kreditkarte oder sonstigen von
        Stripe angebotenen Zahlungsarten sowie über PayPal. [Weitere
        Zahlungsarten ergänzen, sobald final festgelegt.]
      </p>

      <h2>§ 5 Eigentumsvorbehalt</h2>
      <p>
        Die gelieferte Ware bleibt bis zur vollständigen Bezahlung Eigentum
        des Verkäufers.
      </p>

      <h2>§ 6 Widerrufsrecht</h2>
      <p>
        Verbrauchern steht ein Widerrufsrecht nach Maßgabe der{" "}
        <a href="/widerruf" className="underline">
          Widerrufsbelehrung
        </a>{" "}
        zu.
      </p>

      <h2>§ 7 Gewährleistung</h2>
      <p>
        Es gilt das gesetzliche Mängelhaftungsrecht.
      </p>

      <h2>§ 8 Schlussbestimmungen</h2>
      <p>
        Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss
        des UN-Kaufrechts. Zwingende Verbraucherschutzvorschriften des
        Staates, in dem der Kunde seinen gewöhnlichen Aufenthalt hat, bleiben
        unberührt.
      </p>
    </LegalPage>
  );
}
