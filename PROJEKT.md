# PROJEKT.md – Conceptly Webshop (eigenes Shopify-Theme)

Startanweisung: Lies PROJEKT.md vollständig. Arbeite im Plan-Modus: Stell mir zuerst deine offenen Fragen, dann schlag mir einen Umsetzungsplan für Phase 1 vor. Schreib noch keinen Code, bevor ich den Plan freigegeben habe.

## 1. Deine Rolle

Du bist Senior-Shopify-Theme-Entwickler und E-Commerce-Designer in einer Person. Du baust mit mir ein eigenes Shopify-Theme (Online Store 2.0) für Conceptly: hochwertig, schnell und rechtssicher. Ich muss neue Produkte und Inhalte ohne Entwickler in wenigen Minuten anlegen können.

- Ich (Ben) bin kein Vollzeit-Entwickler, sondern komme aus Marketing und Vertrieb. Erkläre Entscheidungen kurz und verständlich (1–3 Sätze).
- Arbeite in kleinen, nachvollziehbaren Commits mit klaren Commit-Messages.
- Lege eine `CLAUDE.md` an und halte sie aktuell: Shopify-CLI-Befehle, Ordnerstruktur, Konventionen, Design-Tokens, Liste aller Sections und Metafelder.
- Führe eine `DECISIONS.md`: jede wichtige Entscheidung mit Datum, Begründung und verworfenen Alternativen.
- Falls es im Repo schon Conceptly-Code oder Markenassets gibt: Prüfe sie zuerst, fasse mir den Stand zusammen und übernimm vorhandene Design-Tokens, Komponenten und Assets. Code aus einem anderen Stack (z. B. Next.js) dient als Design-Vorlage und wird in Liquid übertragen.

Grundprinzip: Alles, was ich als Händler ändern möchte, wird über den Shopify-Admin bzw. den Theme-Editor gepflegt: Produkte, Kollektionen, Frontpage-Bereiche, Lookbooks, Blog, Texte und Bilder. Ich muss dafür niemals Code anfassen.

## 2. Produktvision

Conceptly ist eine eigenständige E-Commerce-Marke für physische Wohndeko- und Lifestyle-Produkte.

- Tagline: „Handpicked. Urban. You."
- Problem: Besondere Deko findet man entweder auf überladenen Marktplätzen oder in teuren Concept Stores. Es fehlt ein kuratierter Ort mit klarer Handschrift.
- Lösung: Ein ruhiger, hochwertiger Online-Concept-Store mit wenigen, ausgewählten Produkten, die stark inszeniert werden. Blog und Lookbooks erzählen die Geschichten dahinter. Das Einkaufen soll sich anfühlen wie in einem schönen Laden.
- Zielgruppe: Urbane Menschen (ca. 25–45), designaffin, die ihre Wohnung bewusst gestalten und lieber ein besonderes Stück kaufen als zehn beliebige.
- Tonalität: Ruhig, selbstbewusst, warm, kurz. Kein Marktschreier-Ton, keine Rabatt-Countdowns, keine künstliche Verknappung. Du-Ansprache.

## 3. Nicht verhandelbare Leitplanken

### Marke

- Basis ist das bestehende Conceptly-Design: Script-Wortmarke, Anthrazit als Primärfarbe, warmes Sand-Beige als Akzent.
- Exakte Farbwerte, Schriften und Logo-Dateien übernimmst du aus dem Repo bzw. aus `/brand`. Fehlt etwas, frag mich. Erfinde keine neuen Markenfarben oder Logos.
- Die Script-Wortmarke ist ein Logo, keine Fließtextschrift. Für Headlines und Text schlägst du ein ruhiges, hochwertiges Schriftpaar vor (z. B. elegante Serif für Headlines + klare Sans für Text) und begründest es.
- Farben und Schriften werden als Theme-Einstellungen (`settings_schema.json`) angelegt, damit ich sie im Theme-Editor sehe. Die Markenfarben sind dort voreingestellt.

### Recht (Deutschland/EU, B2C-Onlineshop)

Du baust die technischen Voraussetzungen ein. Die Texte selbst kommen von einem Rechtstexte-Dienst (z. B. Händlerbund oder IT-Recht Kanzlei, per Shopify-App angebunden) oder werden anwaltlich geprüft.

- Pflichtseiten: Impressum, Datenschutzerklärung, AGB, Widerrufsbelehrung + Muster-Widerrufsformular, Versand & Zahlung. Aus jeder Seite in max. 2 Klicks erreichbar (Footer). Nutze dafür die Shopify-Richtlinienseiten (Policies) und normale Seiten.
- Preise immer inkl. MwSt. mit Hinweis „inkl. MwSt., zzgl. Versand" (verlinkt), auf Produktkarten, Produktseite und im Warenkorb.
- Grundpreis: Shopify-Unit-Price-Felder im Theme ausgeben, wo gepflegt.
- Lieferzeit auf der Produktseite (Metafeld mit Standardwert aus den Theme-Einstellungen).
- Streichpreise (compare-at price) nur anzeigen, wenn ich sie pflege. Weise mich in der Anleitung auf die 30-Tage-Regel hin.
- Produktsicherheit (GPSR): Pro Produkt Metafelder für Hersteller/Importeur (Name, Anschrift, Kontakt) und ggf. Sicherheitshinweise. Sichtbar auf der Produktseite (aufklappbar). Zusätzlich Metaobjekt „Hersteller", damit ich Angaben einmal anlege und mehreren Produkten zuweise.
- Bestellbutton, Zusammenfassung vor dem Kauf und Checkboxen liegen im Shopify-Checkout. Prüfe und dokumentiere, welche Checkout-Einstellungen ich setzen muss (Sprache, Buttonbeschriftung, Pflicht-Checkbox für AGB/Widerruf falls nötig).
- Newsletter-Anmeldung mit Double-Opt-in (Shopify-Einstellung aktivieren, im Theme kein Vorab-Häkchen).
- Cookie-Consent über die Shopify Customer Privacy API / das Shopify-Cookie-Banner. Kein eigenes Tracking ohne Consent.

### Datenschutz

- Liste mir alle Apps und Dienste mit Datenverarbeitung auf, damit ich Datenschutzerklärung und AV-Verträge vervollständigen kann. Hinweis: Shopify verarbeitet Daten auch außerhalb der EU. Das muss in die Datenschutzerklärung (Vertragspartner und Grundlage für die Übermittlung).
- Schriften lokal im Theme (`/assets`) hosten oder Shopify-Font-Library nutzen, kein Google-Fonts-CDN.
- Keine eingebetteten Drittanbieter-Inhalte (YouTube, Instagram, Maps) ohne Zwei-Klick-Lösung bzw. Consent.

### Sicherheit

- Keine API-Tokens oder Secrets im Theme-Code oder Repo.
- Keine Apps installieren, ohne sie mir vorzuschlagen (Zweck, Kosten, Datenschutz).

## 4. Funktionsumfang in Phasen

### Phase 1 – MVP (bauen)

**A. Frontpage** (das Aushängeschild, hier muss es richtig gut werden)

Die Frontpage besteht komplett aus Sections mit Blocks, die ich im Theme-Editor anordnen, ein-/ausblenden und befüllen kann:

- Hero: großes Bild oder kurzes Loop-Video, Tagline, CTA („Kollektion entdecken"). Mobil und Desktop mit getrennten Bildern.
- Kuratierte Produktreihe: „Neu eingetroffen" bzw. „Lieblingsstücke" (Kollektion auswählbar).
- Kollektionskacheln: 2–3 große Kacheln, frei wählbar.
- Shoppable Lookbook-Teaser: Raumbild mit Hotspots (siehe C).
- Marken-Story: Bild + Text („Handpicked. Urban. You.").
- Journal-Teaser: neueste 3 Artikel.
- Vertrauensleiste: Versand, Rückgabe, Zahlungsarten, sichere Zahlung. Keine erfundenen Bewertungen oder Kundenzitate.
- Newsletter-Anmeldung.

**B. Produktseiten** (Template `product.json`)

- Große Bildergalerie (Zoom, Swipe mobil), optional Video/3D über Shopify-Medien.
- Titel, Preis (inkl. MwSt.-Hinweis), Varianten als Swatches (Farbe) bzw. Buttons, Verfügbarkeit, Lieferzeit.
- Kurzbeschreibung + aufklappbare Details aus Metafeldern: Material, Maße, Pflege, Story/Herkunft, Hersteller-/Sicherheitsangaben (GPSR).
- „In den Warenkorb" sticky auf Mobil.
- „Passt dazu" (Metafeld mit Produktliste, Fallback: Shopify Product Recommendations).
- Strukturierte Daten (schema.org Product) korrekt ausgeben.
- Alternative Produkt-Templates vorbereiten (z. B. `product.featured` für ein Hero-Produkt mit mehr Storytelling).

**C. Portfolio-/Kollektionsseiten**

- Kollektionen (nach Raum, Stil, Material, Anlass) als redaktionell gestaltete Landingpages: Hero, Einleitungstext, optionale Story-Sections, Produktraster. Ein alternatives Template `collection.editorial` für besonders inszenierte Kollektionen.
- Lookbooks / „Räume": Metaobjekt „Lookbook" (Titel, Raumbild, Text, Hotspots mit Produkt + X/Y-Position). Eigene Seite pro Lookbook mit klickbaren Hotspots (Produktname, Preis, „In den Warenkorb"). Übersichtsseite aller Lookbooks. Lookbooks lege ich im Admin an, nicht im Code.

**D. Shop-Grundfunktionen**

- Kollektionsseiten mit Filtern (Kategorie, Farbe, Material, Preis) und Sortierung über die Shopify Search & Discovery-App bzw. Storefront-Filter.
- Predictive Search mit Produkt-, Kollektions- und Artikelvorschlägen.
- Warenkorb als Slide-in-Drawer (Cart AJAX API) inkl. Versandkostenfrei-Fortschrittsbalken (Grenze als Theme-Einstellung, optional ausschaltbar).
- Shopify-Checkout im Conceptly-Branding (Logo, Farben, Schriften in den Checkout-Einstellungen. Schreib mir auf, was ich wo einstelle).
- Zahlungsarten: Shopify Payments (Kreditkarte, Apple Pay, Google Pay), PayPal, Klarna. Was davon ich einrichten muss, kommt in die Anleitung.
- Bestell- und Versand-E-Mails: Shopify-Benachrichtigungsvorlagen im Conceptly-Look anpassen (Logo, Farben, Ton).
- Merkliste (Wishlist) mit localStorage, ohne App, mit Herz-Icon auf Produktkarten und Produktseite.

**E. Journal (Blog)**

- Shopify-Blog „Journal": Übersicht, Kategorien über Tags, Artikelseiten mit großem Titelbild und angenehmer Lesetypografie.
- Produkte im Artikel: Metafeld „Produkte im Artikel" (Produktliste) → als kaufbare Produktkarten unter bzw. im Artikel.
- SEO-Basics: Meta-Titel, Beschreibung, Open-Graph-Bild, Autor, Datum, strukturierte Daten (Article).

**F. Produkte einfach und schnell pflegen** (Kernanforderung)

- Ziel: Ein neues Produkt ist in unter 5 Minuten online. Das geht im Shopify-Admin am Rechner oder in der Shopify-App am Handy.
- Lege alle Metafeld-Definitionen sauber an (Name, Beschreibung, Typ, im Admin sichtbar), damit ich beim Produkt nur Felder ausfülle. Dokumentiere sie in `docs/metafelder.md`.
- Das Theme muss mit fehlenden Angaben gut aussehen (leere Metafelder werden einfach ausgeblendet).
- Bilder: Shopify-CDN mit `image_url` + `srcset`, Lazy Loading, korrekte Seitenverhältnisse. Gib mir eine Empfehlung für Bildformate/-größen beim Fotografieren.
- Schreib mir die Anleitungen `docs/produkt-anlegen.md`, `docs/lookbook-anlegen.md`, `docs/artikel-schreiben.md` und `docs/frontpage-bearbeiten.md`: kurz, Schritt für Schritt, für Nicht-Entwickler.

**G. Rechtliches & Basis**

- Pflichtseiten (Inhalte als klar markierte Platzhalter, bis die Rechtstexte-App eingerichtet ist).
- 404-Seite im Markendesign.
- Sauberes SEO: Title/Meta über Shopify-Felder, Canonicals, Alt-Texte, Breadcrumbs.

### Phase 2 – später (nur vorbereiten, nicht bauen)

- Kundenkonto-Design (neue Shopify-Kundenkonten) und Merkliste im Konto speichern.
- Echte Produktbewertungen über eine App (nur verifizierte Käufe).
- Geschenkkarten und Rabattcodes (Shopify-Standard, nur Theme-Darstellung).
- Englische Version über Shopify Markets + Übersetzungen (alle Theme-Texte schon jetzt in `locales/de.default.json` statt hartcodiert).
- Newsletter-Automationen (Shopify Email/Klaviyo), DSGVO-konform.
- Pinterest-/Instagram-Anbindung.
- KI-Unterstützung für Produkttexte über Shopify Magic bzw. ein externes Skript.

## 5. Geschäftsmodell & Bezahlung

- Direktverkauf kuratierter physischer Produkte an Endkunden (B2C), zunächst Versand nach Deutschland, EU vorbereitet (Shopify Markets).
- Versandkosten, Versandkostenfrei-Grenze, Lieferzeiten, Steuern und Zahlungsarten werden im Shopify-Admin bzw. als Theme-Einstellung gepflegt, nicht im Code.
- Ich nenne dir Preise, Versandregeln und Zahlungsarten. Du erfindest keine.
- Shopify-Tarif: Nenne mir, welche Funktionen der Plan haben muss. Ich wähle den Tarif selbst und prüfe die aktuellen Preise.

## 6. Tech-Stack

Entscheidung: eigenes Shopify-Theme (Online Store 2.0), kein Headless-Frontend, kein WordPress.

- Basis: Prüfe Shopifys aktuelles Referenz-Theme (z. B. Dawn oder dessen Nachfolger) als Ausgangspunkt gegen einen schlanken Eigenbau. Empfiehl eine Variante und begründe sie in `DECISIONS.md`. Das Ergebnis muss ein eigenständiges Conceptly-Theme sein, nicht ein umgefärbtes Standard-Theme.
- Sprache: Liquid, JSON-Templates, Sections + Blocks (Theme Blocks, wo sinnvoll), modernes CSS (Custom Properties für Design-Tokens), Vanilla JavaScript bzw. Web Components. Kein schweres Framework, kein jQuery.
- Tooling: Shopify CLI (`shopify theme dev`, `shopify theme check`), Theme Check ohne Fehler, Git-Repo mit Shopify-GitHub-Integration (Branch `main` = Live-Theme, Arbeit in einem Entwicklungs-Theme).
- Datenmodell: Metafelder für Produkt-, Kollektions- und Artikeldaten, Metaobjekte für Lookbooks, Hersteller und ggf. Vertrauens-/USP-Elemente.
- Apps (nur so viele wie nötig, mit meiner Freigabe): Search & Discovery (Filter), Rechtstexte-App, ggf. PayPal und Klarna. Jede weitere App begründen (Zweck, Kosten, Datenschutz, Ladezeit).
- Analytics: Shopify Analytics, keine zusätzlichen Pixel ohne Freigabe.

## 7. KI im Produkt

In Phase 1 gibt es keine KI im Shop. Für Produkttexte nutze ich später ggf. Shopify Magic oder ein separates Skript. Bereite nichts vor, außer dass Metafelder gut strukturiert sind.

## 8. Konfiguration

- Alles, was sich ändern kann, ist eine Theme-Einstellung, ein Metafeld oder ein Shop-Wert im Admin: Versandkostenfrei-Grenze, Standard-Lieferzeit, Kontaktdaten, Social-Links, Ankündigungsleiste, Feature-Schalter (Wishlist, Fortschrittsbalken, Streichpreise).
- Standardwerte im Code kommentieren mit „Stand: …" und „Quelle: …".
- Wo ich noch keinen Wert geliefert habe: deutlich markierter Platzhalter (`TODO_BEN`), keine erfundenen Zahlen.

## 9. Seitenstruktur

Shopify gibt die URL-Präfixe vor (`/products`, `/collections`, `/blogs`, `/pages`). Die Handles (der hintere Teil der URL) setze ich deutsch.

```
/                                  Frontpage (index.json)
/collections/all                   Alle Produkte (Filter, Sortierung)
/collections/[handle]              Kategorie oder Kollektion (Standard oder Editorial-Template)
/collections                       Kollektionsübersicht
/pages/raeume                      Lookbook-Übersicht
/pages/raeume/[handle]             Einzelnes Lookbook (Metaobjekt-Seite)
/products/[handle]                 Produktseite
/blogs/journal                     Journal-Übersicht
/blogs/journal/[handle]            Artikel
/search                            Suche
/pages/merkliste                   Wishlist
/pages/ueber-uns                   Markenstory
/pages/kontakt                     Kontakt (Shopify-Kontaktformular)
/pages/faq                         Häufige Fragen (Metaobjekt oder Blocks)
/policies/...                      AGB, Widerruf, Datenschutz, Versand
/pages/impressum                   Impressum
Warenkorb                          Drawer + /cart als Fallback
Checkout                           Shopify-Checkout
```

Prüfe, ob Metaobjekt-Seiten für Lookbooks das sauberste URL-Muster ergeben, und schlag eine Alternative vor, falls nicht.

## 10. UX & Design

- Anmutung: Editorial, ruhig, viel Weißraum, große Bilder, wenig Elemente gleichzeitig. Orientiert an hochwertigen Concept Stores und Interior-Magazinen, aber eigenständig. Kein Kopieren fremder Shops oder Premium-Themes.
- Farben: Anthrazit (Text, Primär-Buttons), warmes Sand-Beige (Akzentflächen, Section-Hintergründe), viel Off-White. Akzent sparsam. Pro Section Farbschema wählbar (Hell / Sand / Anthrazit).
- Typografie: klare Hierarchie, großzügige Zeilenhöhe, Headlines groß und elegant.
- Mikrointeraktionen: dezente Hover- und Einblend-Animationen, zweites Produktbild beim Hover, weicher Warenkorb-Drawer. `prefers-reduced-motion` respektieren.
- Mobile first: daumenfreundliche Navigation, sticky „In den Warenkorb", schneller Weg zum Checkout.
- Barrierefreiheit: WCAG 2.2 AA (Kontraste, besonders Beige auf Weiß prüfen, Tastaturbedienung, Alt-Texte, Fokuszustände, Formular-Labels, Drawer/Modals mit Fokusfalle).
- Performance: Lighthouse mobil ≥ 90 (Performance, Accessibility, Best Practices, SEO) auf Frontpage, Kollektion und Produktseite. LCP < 2,5 s. Kein Render-Blocking-JS, Bilder konsequent optimiert, so wenig App-Skripte wie möglich.
- Design-System: Design-Tokens zentral als CSS Custom Properties aus den Theme-Einstellungen. Wiederverwendbare Snippets (Button, Produktkarte, Kollektionskachel, Section-Header, Badge, Preis). Eine versteckte Styleguide-Seite (`page.styleguide`), die alle Komponenten zeigt.

## 11. Sicherheit & Qualität

- `shopify theme check` ohne Fehler vor jedem Merge.
- Alle Ausgaben korrekt escapen, keine Inline-Skripte mit Nutzerdaten.
- Keine Secrets, Tokens oder privaten App-Schlüssel im Theme.
- Manuelle Testliste in `docs/testplan.md`: Produkt suchen → filtern → Produktseite → Variante wählen → in den Warenkorb → Checkout bis zur Zahlungsseite. Auf iPhone, Android und Desktop.
- Theme-Updates nur über Git/Entwicklungs-Theme, nie direkt am Live-Theme im Code-Editor.

## 12. Vorgehen & Lieferung

1. Bestehenden Stand im Repo und vorhandene Markenassets prüfen und zusammenfassen.
2. Offene Fragen an mich stellen.
3. Basis-Entscheidung (Referenz-Theme vs. Eigenbau) mit Empfehlung. Warte auf meine Freigabe.
4. Setup: Shopify CLI, Git-Repo, GitHub-Integration, Entwicklungs-Theme, `CLAUDE.md`, `DECISIONS.md`. Schreib mir eine Schritt-für-Schritt-Liste, was ich in Shopify einrichten muss (Account, Entwicklungs-Shop, Zugänge).
5. Design-Tokens, Theme-Einstellungen, Basis-Snippets, Styleguide-Seite.
6. Header (Logo, Navigation mit Mega-Menü, Suche, Merkliste, Warenkorb) und Footer (Rechtliches, Newsletter, Social).
7. Metafeld- und Metaobjekt-Definitionen anlegen und dokumentieren.
8. Produktseite + Kollektionsseiten mit Filtern.
9. Warenkorb-Drawer, Checkout-Branding-Anleitung, E-Mail-Vorlagen.
10. Lookbooks („Räume") mit Hotspots.
11. Frontpage-Sections.
12. Journal.
13. Rechtliche Seiten, SEO, strukturierte Daten.
14. Performance- und Barrierefreiheits-Durchgang.
15. Anleitungen in `/docs`, Übergabe und Checkliste für den Livegang.

Nach jedem Schritt lieferst du:

- Kurze Zusammenfassung, was gebaut wurde.
- Test-Anleitung (was klicke ich im Vorschau-Link, was sollte passieren).
- Offene TODOs und Punkte, die ich liefern oder im Admin einstellen muss.

## 13. Was du NICHT tun sollst

- Keine erfundenen Bewertungen, Testimonials, Verkaufszahlen, „Nur noch 2 auf Lager"-Hinweise oder Countdown-Timer.
- Keine erfundenen Preise, Versandkosten, Rechtstexte oder Unternehmensdaten. Verwende Platzhalter.
- Keine Dark Patterns (vorausgewählte Zusatzprodukte, versteckte Kosten, erzwungene Kontoerstellung).
- Keine Tracking-Pixel oder Retargeting ohne meine ausdrückliche Freigabe und ohne Consent.
- Keine neuen Markenfarben, Logos oder Taglines erfinden.
- Keine Apps ohne meine Freigabe installieren. Keine Funktion per App lösen, die sich mit wenig Code sauber im Theme bauen lässt.
- Keine Inhalte hartcodieren, die ich pflegen will. Texte gehören in Settings, Metafelder oder `locales`.
- Keine fremden Premium-Themes kopieren, keine Stock-Fotos mit erkennbaren Personen oder fremden Marken als finale Bilder. Platzhalterbilder klar kennzeichnen.
- Nicht ohne Rückfrage Phase-2-Funktionen bauen.
- Nie direkt am Live-Theme arbeiten.

## Annahmen (bitte korrigieren, falls falsch)

- Verkauf zunächst nur in Deutschland, B2C, Preise in Euro.
- Physische Produkte, Versand durch mich bzw. meinen Lieferanten.
- Ich habe noch keinen Shopify-Account. Du sagst mir, was ich anlegen muss (ggf. zuerst Entwicklungs-/Testshop).
- Produktfotos liefere ich, bis dahin Platzhalter.
