# CLAUDE.md — Conceptly Shopify-Theme

Interne Doku für mich (Claude) und jeden, der hier weiterarbeitet. Wird nach
jedem Baustein aktualisiert — siehe `PROJEKT.md` für das vollständige
Briefing und `DECISIONS.md` für Begründungen wichtiger Entscheidungen.

## Was ist das hier

Eigenständiges Shopify-Theme (Online Store 2.0) für Conceptly, einen
kuratierten Deko-/Lifestyle-Webshop. Kein Headless-Frontend, kein
Next.js/Supabase mehr — der frühere Next.js-Stand liegt archiviert im Branch
[`archive/nextjs-build`](https://github.com/BenRSTG/Conceptly/tree/archive/nextjs-build).

Basis: Shopifys offizielles `skeleton-theme`, **Tag `v1.0.0`** (klassisches
Online-Store-2.0-Modell: JSON-Templates + Sections + wiederverwendbare
Theme-Blocks). **Nicht** `main`/`v2.0.0-rc` dieses Repos — das ist ein noch
nicht allgemein verfügbares „agentic editor"-Preview-Modell ohne Sections,
das sich nicht im klassischen Theme-Editor per Drag-and-Drop bedienen lässt.
Siehe `DECISIONS.md` für die ausführliche Begründung.

## Shopify-CLI-Befehle

```bash
shopify theme dev --store=<dein-shop>.myshopify.com   # Lokale Vorschau mit Live-Reload
shopify theme check                                   # Linting — muss vor jedem Merge fehlerfrei sein
shopify theme push --store=<dein-shop>.myshopify.com   # Auf ein Theme im Store hochladen
shopify theme pull --store=<dein-shop>.myshopify.com   # Änderungen aus dem Theme-Editor zurückholen
```

Setup-Anleitung (Partner-Account, Entwicklungs-Shop, erste Verbindung):
siehe `docs/shopify-setup.md`.

## Ordnerstruktur

```
assets/      CSS, JS, Bilder (Logo-Dateien liegen hier: logo-full.png,
             logo-compact.png, brush-circle.png/-white.png)
blocks/      Wiederverwendbare Theme-Blocks (in Sections per
             {% content_for 'blocks' %} eingebunden)
config/      settings_schema.json (Theme-Einstellungen, im Editor sichtbar)
             + settings_data.json (aktuell gespeicherte Werte, vom
             Theme-Editor verwaltet — nicht von Hand editieren)
layout/      theme.liquid (Dokument-Grundgerüst), password.liquid
locales/     Übersetzungsstrings. de.default.json/.schema.json ist die
             einzige Sprache (Shop ist vorerst D-only, Phase 2: Englisch
             über Shopify Markets, siehe PROJEKT.md).
sections/    Seiten-Bausteine, inkl. header-group.json/footer-group.json
             (Section-Groups) für Header/Footer
snippets/    Kleine wiederverwendbare Liquid-Fragmente
templates/   JSON-Templates (eine Datei pro Seitentyp, verweist auf Sections)
docs/        Anleitungen für Ben (siehe unten)
```

## Konventionen

- **Nichts hartcodieren, was Ben pflegen will.** Texte/Werte gehören in
  `settings_schema.json` (Theme-Einstellungen), Metafelder/Metaobjekte oder
  `locales/*.json` — nie fest im Liquid-Code.
- **Keine erfundenen Werte.** Preise, Versandkosten, Rechtstexte,
  Firmendaten: wenn Ben sie noch nicht geliefert hat, ein klar markierter
  `TODO_BEN`-Kommentar im Code statt einer Annahme.
- **`shopify theme check` muss vor jedem Commit fehlerfrei durchlaufen**
  (`.theme-check.yml` ist Shopifys `recommended`-Preset, keine Ausnahmen).
- Standardwerte im Code werden kommentiert mit „Stand: …" und „Quelle: …".
- Jede Sektion/jeder Block bekommt sinnvolle `presets`, damit Ben sie im
  Theme-Editor per Klick hinzufügen kann.
- Mobile-first, `prefers-reduced-motion` respektieren, WCAG 2.2 AA.
- Keine Apps, keine Tracking-Pixel, keine neuen Markenfarben/Logos ohne
  Rückfrage bei Ben.

## Design-Tokens

Definiert in `config/settings_schema.json`, ausgegeben als CSS Custom
Properties in `snippets/css-variables.liquid`.

- **Farben:** Eine Farbschema-Gruppe (`color_schemes`) mit drei vorbelegten
  Schemata (in `config/settings_data.json`, Reihenfolge wie im
  Theme-Editor unter „Theme-Einstellungen → Farben"):
  1. **Hell** — Off-White `#FAF8F5` Hintergrund, Anthrazit `#313139` Text/Buttons.
  2. **Sand** — Sand-Beige `#E4D6BF` Hintergrund, Anthrazit Text/Buttons.
  3. **Anthrazit** — Anthrazit `#313139` Hintergrund, Off-White Text, Sand-Buttons.

  Jede Section kann später per `color_scheme`-Einstellung eines dieser drei
  Schemata wählen (CSS-Klasse `.color-scheme-N`, siehe `css-variables.liquid`).
  Die Schema-Namen „Hell/Sand/Anthrazit" sind nur in `settings_data.json`
  hinterlegt — der Theme-Editor zeigt zunächst „Scheme 1/2/3"; Ben kann sie
  dort einmalig umbenennen (optional, rein kosmetisch).
- **Schriftpaar:** Serif-Headlines (`type_header_font`, Default **Playfair
  Display**) + Sans-Fließtext (`type_body_font`, Default **Work Sans**).
  Begründung in `DECISIONS.md`. Die Script-Wortmarke bleibt dem Logo
  vorbehalten (nie als Fließtext/UI-Schrift).
- **Logo:** `settings.logo` (Upload im Theme-Editor) + `settings.logo_width`.
  Bis Ben ein Logo hochlädt, muss die Header-Section (Schritt 3) auf die
  gebündelten Dateien in `assets/` zurückfallen.
- **Feature-Schalter:** `enable_wishlist`, `enable_free_shipping_bar`,
  `free_shipping_threshold` (Platzhalterwert 50, `TODO_BEN`),
  `show_compare_at_price`.
- **Styleguide:** `sections/styleguide.liquid` + `templates/page.styleguide.json`
  zeigen alle Komponenten. Ben muss dafür einmalig eine Seite mit dem
  Theme-Template „page.styleguide" anlegen (siehe Test-Anleitung im
  Commit-Report).

## Sections (wird laufend ergänzt)

| Section | Zweck | Status |
| --- | --- | --- |
| `hello-world` | Skeleton-Demo-Inhalt auf der Startseite | Platzhalter, wird in Schritt „Frontpage-Sections" ersetzt |
| `header` / `header-group` | Kopfzeile: Logo, Navigation (mit Dropdown für Untermenüs), Suche, Merkliste, Konto, Warenkorb | Fertig |
| `footer` / `footer-group` | Fußzeile: Newsletter, Social-Links, Rechtliches (automatisch aus `shop.policies` + `pages.impressum`), Zahlungssymbole | Fertig |
| `styleguide` | Interne Komponenten-Übersicht (`page.styleguide`) | Fertig |
| `product`, `collection`, `collections`, `cart`, `blog`, `article`, `page`, `search`, `password`, `404` | Seiten-Grundgerüste | Skeleton-Rohbau, unverändert |

## Basis-Snippets

| Snippet | Zweck |
| --- | --- |
| `button` | Primär-/Sekundär-Button (Link oder `<button>`) |
| `badge` | Kleines Label (Neutral/Sand/Anthrazit) |
| `price` | Preis inkl. „inkl. MwSt."-Hinweis + verlinktem Versandhinweis, optionaler Streichpreis |

## Header & Footer (Schritt 3)

- **Navigation:** `section.settings.menu` (Link-Liste, Default-Handle
  `main-menu`) — Ben pflegt sie unter Onlineshop → Navigation. Menüpunkte
  mit Untermenüs bekommen automatisch ein Dropdown (`<details>`), ein- bis
  zweistufig. Eine echte "Mega-Menü"-Rasterdarstellung (Bilder/Spalten im
  Dropdown) ist noch nicht gebaut — bei Bedarf späteres Polish-Item.
- **Suche:** Bewusst auf eine einfache Formular-Suche (`routes.search_url`,
  nutzt die vorhandene `sections/search.liquid`) begrenzt, keine
  Live-Vorschläge/AJAX. Volle Predictive Search mit Produktvorschlägen
  kommt zusammen mit der Search & Discovery-App-Integration in Schritt 5
  (Kollektions-Filter) — siehe `DECISIONS.md`.
- **Merkliste:** Herz-Icon zeigt die Anzahl aus `assets/wishlist.js`
  (`localStorage`, Key `conceptly:wishlist`). Verlinkt auf `/pages/merkliste`,
  sobald Ben diese Seite anlegt (vorher Platzhalter-Link). Add/Remove-Buttons
  auf Produktkarten/-seiten folgen in Schritt 5.
- **Mobile Navigation:** Button+Klasse-Toggle (`assets/header.js`), kein
  `<details>`, damit sich das Verhalten per Media Query zuverlässig auf
  Desktop-Breite umschalten lässt.
- **Social-Links & Newsletter:** Globale Theme-Einstellungen
  `settings.social_*_url` (nur sichtbar, wenn befüllt) und ein
  `{% form 'customer' %}`-Formular mit `contact[tags]=newsletter` — Ben muss
  in den Shopify-Kundeneinstellungen „Double-Opt-in" aktivieren (siehe
  `docs/shopify-setup.md`-Ergänzung/Launch-Checkliste).
- **Rechtliches im Footer:** Läuft automatisch über `shop.policies`
  (zeigt nur Richtlinien, die Ben im Admin ausgefüllt hat) plus einen
  Link auf `/pages/impressum`, sobald diese Seite existiert — kein
  erfundener/toter Link vorher.

## Metafelder & Metaobjekte

Noch keine angelegt — kommt in Schritt „Metafeld-/Metaobjekt-Definitionen",
dokumentiert dann ausführlich in `docs/metafelder.md`.

## Docs für Ben

- `docs/shopify-setup.md` — Partner-Account & Entwicklungs-Shop einrichten ✅
- `docs/metafelder.md` — folgt
- `docs/produkt-anlegen.md` — folgt
- `docs/lookbook-anlegen.md` — folgt
- `docs/artikel-schreiben.md` — folgt
- `docs/frontpage-bearbeiten.md` — folgt
- `docs/testplan.md` — manuelle Testliste, wächst mit jedem Schritt
