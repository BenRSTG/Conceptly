import type { Metadata } from "next";
import { LegalPage, PlaceholderNotice } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <PlaceholderNotice />

      <h2>1. Verantwortlicher</h2>
      <p>
        Conceptly, [Anschrift], [E-Mail-Adresse] — siehe{" "}
        <a href="/impressum" className="underline">
          Impressum
        </a>
        .
      </p>

      <h2>2. Erhebung und Verarbeitung von Daten beim Einkauf</h2>
      <p>
        Wenn Sie bei uns bestellen, erheben und verarbeiten wir
        personenbezogene Daten (Name, Anschrift, E-Mail, Zahlungsdaten) nur,
        soweit dies zur Erfüllung und Abwicklung Ihrer Bestellung sowie zur
        Bearbeitung Ihrer Anfragen erforderlich ist (Art. 6 Abs. 1 lit. b
        DSGVO).
      </p>

      <h2>3. Zahlungsdienstleister</h2>
      <p>
        Zur Zahlungsabwicklung nutzen wir Stripe und PayPal. Bei Auswahl
        dieser Zahlungsarten werden die für die Zahlungsabwicklung
        notwendigen Daten an den jeweiligen Anbieter übermittelt.
      </p>

      <h2>4. Hosting und Infrastruktur</h2>
      <p>
        Diese Website wird bei Vercel gehostet. Für Datenbank, Authentifizierung
        und Datei-Speicherung nutzen wir Supabase. Für den Versand
        transaktionsbezogener E-Mails und des Newsletters nutzen wir Resend.
      </p>

      <h2>5. Newsletter</h2>
      <p>
        Wenn Sie sich für unseren Newsletter anmelden, verwenden wir Ihre
        E-Mail-Adresse für eigene Werbezwecke, bis Sie sich vom Newsletter
        abmelden. Die Anmeldung erfolgt im sogenannten Double-Opt-In-
        Verfahren, d. h. Sie erhalten nach der Anmeldung eine E-Mail, in der
        Sie um Bestätigung Ihrer Anmeldung gebeten werden. Diese Bestätigung
        ist notwendig, damit sich niemand mit fremden E-Mail-Adressen
        anmelden kann. Die Anmeldungen zum Newsletter werden protokolliert,
        um den Anmeldeprozess entsprechend den rechtlichen Anforderungen
        nachweisen zu können. Hierzu gehört die Speicherung des
        Anmelde- und des Bestätigungszeitpunkts sowie der IP-Adresse. Jede
        Newsletter-E-Mail enthält einen Abmeldelink.
      </p>

      <h2>6. Ihre Rechte</h2>
      <p>
        Sie haben das Recht, Auskunft über Ihre bei uns gespeicherten
        personenbezogenen Daten zu erhalten sowie ggf. ein Recht auf
        Berichtigung, Sperrung oder Löschung dieser Daten. Wenden Sie sich
        hierzu bitte an die oben genannte Kontaktadresse.
      </p>
    </LegalPage>
  );
}
