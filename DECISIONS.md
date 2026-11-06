# DECISIONS.md — Conceptly Shopify-Theme

Jede wichtige technische Entscheidung mit Datum, Begründung und verworfenen
Alternativen. Neueste zuerst.

---

## 2026-11-06 — Metafelder/Metaobjekte per Admin API statt manuellem Klicken

**Entscheidung:** Alle Produkt-Metafelder und Metaobjekt-Typen (Hersteller,
Lookbook, Lookbook-Hotspot) wurden per Shopify Admin GraphQL API angelegt,
nicht von Ben manuell über Einstellungen → Custom data.

**Begründung:** Ben gefragt (`AskUserQuestion`) — er wollte die schnellere,
fehlerfreiere Variante. Dafür hat er einmalig eine Custom App mit
Admin-API-Scopes erstellt (`read_products`, `write_products`,
`read_metaobject_definitions`, `write_metaobject_definitions`,
`read_metaobjects`, `write_metaobjects`) und mir den Zugriffstoken über ein
sicheres Formular gegeben (nie im Klartext im Chat). Zehn Definitionen
(7 Produkt-Metafelder + 3 Metaobjekt-Typen) wurden damit in Sekunden ohne
Tippfehler angelegt, alle mit `storefront: PUBLIC_READ`, die relevanten
Produkt-Felder zusätzlich angepinnt (erscheinen oben auf der
Produktbearbeitungsseite). Vollständige Liste in `docs/metafelder.md`.

**Verworfene Alternative:** Ben klickt alle Definitionen selbst über die
Custom-Data-Oberfläche an (ca. 20–30 Minuten, fehleranfälliger bei
Feldtypen/Validierungen) — die manuelle Variante war die andere angebotene
Option.

**Hinweis:** Die Custom App bleibt installiert (für spätere
Metafeld-Änderungen nützlich), wird vom Theme selbst zur Laufzeit aber
nicht gebraucht. Ben kann sie jederzeit im Admin deinstallieren.

---

## 2026-11-06 — Header-Suche: einfaches Formular statt Predictive Search (vorerst)

**Entscheidung:** Das Such-Icon im Header öffnet ein normales Formular zur
`/search`-Seite (`routes.search_url`), keine Live-Vorschläge per AJAX.

**Begründung:** Volle Predictive Search (Produkt-/Kollektions-/
Artikelvorschläge während des Tippens) ist in `PROJEKT.md` Abschnitt 4.D
vorgesehen, hängt technisch aber eng mit Filtern/Sortierung und der
Search & Discovery-App zusammen, die erst in Schritt 5
(„Produktseite + Kollektionsseiten") dazukommt. Sie jetzt isoliert zu bauen
hieße, Logik doppelt zu schreiben oder halbfertig zu lassen. Die einfache
Formular-Suche erfüllt die Kernanforderung (Ben braucht Code-frei nichts zu
tun, Kunden können suchen) vollständig, bis Schritt 5 sie durch Live-
Vorschläge ersetzt oder ergänzt.

**Verworfene Alternative:** Eigene AJAX-Predictive-Search jetzt selbst
bauen (höheres Risiko für halbfertige/fehleranfällige Logik, die in
Schritt 5 ohnehin überarbeitet werden müsste).

---

## 2026-11-06 — Schriftpaar: Playfair Display (Headlines) + Work Sans (Fließtext)

**Entscheidung:** `type_header_font` Default **Playfair Display**,
`type_body_font` Default **Work Sans**.

**Begründung:** Die Script-Wortmarke ist Logo, keine Fließtextschrift (siehe
`PROJEKT.md` Abschnitt 3). Für Headlines passt eine ruhige, elegante Serif
zur „editorial, ruhig" gewünschten Anmutung (Abschnitt 10) und zu
hochwertigen Concept-Store-/Interior-Magazin-Vorbildern, ohne mit der
Script-Logo-Schrift zu konkurrieren. Work Sans ist neutral, sehr gut lesbar
in kleinen Größen (Produktdaten, UI-Texte, Warenkorb) und deckt Deutsch mit
Umlauten/Eszett vollständig ab. Beide sind reguläre Google-Fonts-Einträge in
Shopifys eigener Font-Library (`font_picker`), werden also von Shopify
selbst gehostet (kein externes Google-Fonts-CDN, siehe Abschnitt 3
„Datenschutz").

**Verworfene Alternativen:** Die Script-Wortmarke selbst als Headline-Font
(verworfen laut Briefing); ein zweites Sans für Headlines (zu wenig
Kontrast/Eigenständigkeit für „hochwertig"); Systemschriften (wirken nicht
nach Concept Store).

**Offen:** Ben kann beide Fonts jederzeit im Theme-Editor unter
„Theme-Einstellungen → Typografie" austauschen.

---

## 2026-11-06 — Farbschema-Gruppe: drei Presets in `settings_data.json`, nicht in `settings_schema.json`

**Entscheidung:** Die drei Farbschemata (Hell/Sand/Anthrazit) sind in
`config/settings_data.json` unter `current.color_schemes` vorbelegt, nicht
über ein `"default"`-Array direkt im `color_scheme_group`-Setting in
`settings_schema.json`.

**Begründung:** `shopify theme check` hat ein `"default"`-Array auf
Gruppenebene als ungültig zurückgewiesen (`Property default is not
allowed`) — diese Shopify-API-Version erzeugt beim ersten Öffnen nur ein
einzelnes Schema aus den `definition`-Feld-Defaults. Drei benannte
Presets vorzubelegen geht nur über `settings_data.json`, genau wie Shopifys
eigenes Referenz-Theme Dawn es macht (dort ebenfalls mit realen
Start-Werten statt leer ausgeliefert). Zusätzlich verlangt die aktuelle
`color_scheme_group`-Validierung ein vollständiges `role`-Mapping
(u. a. `primary_button_border`, `on_primary_button`, `links`, `icons`) —
ohne diese Felder bricht `shopify theme check` mit „Missing property"-Fehlern
ab.

**Verworfene Alternative:** Nur ein Farbschema pflegen und Ben die übrigen
zwei händisch im Theme-Editor per „+ Schema hinzufügen" anlegen lassen —
verworfen, weil die Markenfarben dann nicht von Anfang an korrekt vorlägen.

**Korrektur (selbiger Tag, bei Schritt 3 gefunden) — `role`-Feld: Dawns
Namen `primary_button_text`/`secondary_button_text` existieren in der
aktuellen API nicht mehr, richtig heißt es `on_primary_button`/
`on_secondary_button`:** Beim Testen gegen den echten Dev-Shop
(`shopify theme dev`) wurde `primary_button_text` konsequent mit
„role: primary_button_text ist ungültig" abgelehnt — auch mit dem
vermeintlich „bewährten" Dawn-8-Felder-Set (vorheriger, mittlerweile
überholter Eintrag oben). Systematisch durchprobiert (Rollen einzeln
entfernt/umbenannt, Fehlermeldungen der Live-Validierung ausgewertet): Die
Plattform fordert exakt das von `shopify theme check` verlangte erweiterte
Rollen-Set, nur unter anderen Namen als Dawns älterer Konvention —
`on_primary_button`/`on_secondary_button` statt `primary_button_text`/
`secondary_button_text`, plus `primary_button_border`/
`secondary_button_border` (hier auf bereits vorhandene Definition-Felder
`button`/`secondary_button_label` gemappt statt eigener neuer Farbfelder,
um die Zahl der Theme-Editor-Einstellungen klein zu halten). Mit dieser
Benennung sind **sowohl** `shopify theme check` **als auch** der echte
Upload fehlerfrei — der scheinbare Linter-vs-Plattform-Konflikt war in
Wahrheit nur ein falscher Feldname, keine echte Versions-Diskrepanz. Der
vorherige Eintrag oben („Dawns bewährtes 8-Felder-Set") ist damit überholt;
er bleibt stehen, um die Fehlersuche nachvollziehbar zu halten.

---

## 2026-11-06 — Plattform-Wechsel: eigener Next.js-Webshop → Shopify-Theme

**Entscheidung:** Conceptly wird als eigenes Shopify-Theme (Online Store 2.0)
gebaut statt als selbstgebauter Next.js/Supabase/Stripe-Webshop.

**Begründung:** Kernanforderung ist, dass Ben (Marketing/Vertrieb, kein
Entwickler) Produkte, Bestellungen, Zahlungen und Inhalte selbst im
Admin/Theme-Editor pflegt. Ein selbstgebauter Shop bräuchte dafür ein
eigenes Admin-UI, eigene Zahlungsanbindung, eigenes Rechts-/
Datenschutz-Fundament und eigenes Hosting — Shopify bringt das alles fertig,
geprüft und wartungsarm mit.

**Verworfene Alternative:** Der bestehende Next.js-Stand (12 Module,
vollständig funktionsfähig) wurde nicht gelöscht, sondern in den Branch
`archive/nextjs-build` verschoben — für den Fall, dass einzelne Ideen
(Datenmodell-Gedanken, Rechtstexte-Platzhalter, Instagram-Post-Konzept)
später nochmal nützlich sind.

---

## 2026-11-06 — Theme-Basis: Skeleton-Theme `v1.0.0`, nicht `main`/`v2.0.0-rc`

**Entscheidung:** Startpunkt ist Shopifys offizielles
[`skeleton-theme`](https://github.com/Shopify/skeleton-theme), ausgecheckt
auf **Tag `v1.0.0`** — nicht der aktuelle `main`-Branch.

**Begründung:** Beim Klonen von `skeleton-theme` zeigte sich, dass `main`
inzwischen (Stand 11/2026) ein Release-Candidate für ein komplett neues
Architekturmodell ist ("block-first", Commit „Port rc-v2.0.0 with updated
block composition syntax"): keine `sections/`, keine JSON-Templates, keine
Section-`presets` mehr — Seiten werden stattdessen direkt in Liquid-Templates
aus global wiederverwendbaren Blocks zusammengesetzt. Das ist Teil eines neu
angekündigten „agentic editor"-Konzepts (ein `{% partial %}`-Tag, der nur
hinter dem Feature-Flag `shop.features.agentic_editor_enabled?` funktioniert)
und laut Shopifys eigener Doku-Lage noch nicht allgemein verfügbar — Quellen
bestätigen ausdrücklich, dass produktive Themes weiterhin auf
JSON-Templates, Sections und Theme-Blocks aufsetzen sollen und bestehende
Themes mit diesem Modell weiter funktionieren.

Das stünde im direkten Widerspruch zu Bens nicht verhandelbarer
Kernanforderung: „Alles, was ich als Händler ändern möchte, wird über den
Shopify-Admin bzw. den Theme-Editor gepflegt" inkl. Frontpage-Sections, die
er „im Theme-Editor anordnen, ein-/ausblenden und befüllen" kann — das
"block-first"-Modell ohne Sections unterstützt diese klassische
Drag-and-Drop-Bedienung im Theme-Editor nicht in der gewohnten Form.

**Verworfene Alternativen:**
- `shopify theme init` ohne Flags (lädt standardmäßig `main`, also das
  neue Preview-Modell) → verworfen aus obigem Grund.
- Dawn oder Horizon abspecken → verworfen, siehe nächster Eintrag.
- Eigenes Grundgerüst komplett von Hand schreiben → unnötig, `v1.0.0` ist
  exakt das offizielle, minimale, stabile Blank-Slate-Theme für genau
  diesen Zweck.

**Technische Konsequenz:** Wir nutzen trotzdem `blocks/` für
wiederverwendbare Theme-Blocks (z. B. ein USP-Badge-Block für Hero,
Vertrauensleiste und Produktseite) — das ist im `v1.0.0`-Modell voll
unterstützt und wird von Sections per `{% content_for 'blocks' %}`
eingebunden, ganz ohne das experimentelle `main`-Modell zu brauchen.

---

## 2026-11-06 — Referenz-Theme vs. Eigenbau

**Entscheidung:** Eigenbau auf Basis von `skeleton-theme` (s. o.), nicht
Dawn oder Horizon abspecken.

**Begründung:** Dawn (Shopifys ursprüngliches OS-2.0-Referenz-Theme) und
Horizon (seit 2025 Shopifys neue Standard-Grundlage, tiefere
Block-Verschachtelung) sind beide fertige, gestylte Verkaufs-Themes. Sie
als Startpunkt zu nehmen bedeutet, fremdes CSS/JS und fremde
Design-Entscheidungen erst mühsam herauszuschälen — das widerspricht Bens
Vorgabe „Das Ergebnis muss ein eigenständiges Conceptly-Theme sein, nicht
ein umgefärbtes Standard-Theme." `skeleton-theme` v1.0.0 ist dagegen
bewusst leer: minimale Ordnerstruktur, kaum vorbelegte Settings, keine
fremde Optik.

Dawns und Horizons offener Quellcode dient uns trotzdem als **Nachschlagewerk**
für einzelne technische Muster (Cart-Drawer-AJAX, Varianten-Picker,
Predictive-Search-Markup, Theme-Blocks-Syntax) — wir übernehmen daraus
gezielt Technik, nie Design oder CSS-Dateien im Ganzen.

**Verworfene Alternativen:** Dawn forken; Horizon forken; komplett ohne
Referenz-Theme von null beginnen.

---

## 2026-11-06 — Markenwerte: aus dem alten Next.js-Stand übernommen, nicht neu erfunden

**Entscheidung:** Farben und Logo-Dateien kommen 1:1 aus dem archivierten
Next.js-Stand, nicht neu erstellt.

**Begründung:** Im alten Next.js-Projekt wurden die Vektorpfade aus der
Original-Logo-PDF (`Conceptly_-_Final.pdf`) bereits einmal exakt
ausgelesen: Anthrazit `#313139`, Sand `#E4D6BF` (helle Fläche) / `#D6C5AE`
(dunklere Schattierung). Die PDF selbst liegt mir aktuell nicht mehr vor
(Umgebungs-Reset), aber die daraus exportierten PNGs
(`assets/logo-full.png`, `assets/logo-compact.png`,
`assets/brush-circle.png`, `assets/brush-circle-white.png`) und die Hex-Werte
sind bereits verbindlich im Next.js-Repo dokumentiert und werden 1:1
übernommen — kein Risiko, Markenfarben zu erfinden.

**Offen:** Falls Ben die Original-`.ai`/PDF-Datei erneut bereitstellt, können
bei Bedarf weitere Export-Formate (SVG, höhere Auflösungen) nachgezogen
werden. Nicht blockierend für den Theme-Bau.
