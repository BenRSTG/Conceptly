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
locales/     Übersetzungsstrings (en.default.json + .schema.json).
             Deutsch kommt als de.default.json, sobald Header/Footer stehen.
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

Noch nicht final — kommt in Schritt 2 (Design-Tokens & Settings). Startwerte
stehen bereits fest (aus dem Original-Logo ausgelesen, siehe
`DECISIONS.md`): Anthrazit `#313139`, Sand `#E4D6BF` / `#D6C5AE`.

## Sections (wird laufend ergänzt)

| Section | Zweck | Status |
| --- | --- | --- |
| `hello-world` | Skeleton-Demo-Inhalt auf der Startseite | Platzhalter, wird in Schritt „Frontpage-Sections" ersetzt |
| `header` / `header-group` | Kopfzeile | Skeleton-Rohbau, wird in Schritt „Header & Footer" ausgebaut |
| `footer` / `footer-group` | Fußzeile | Skeleton-Rohbau, wird in Schritt „Header & Footer" ausgebaut |
| `product`, `collection`, `collections`, `cart`, `blog`, `article`, `page`, `search`, `password`, `404` | Seiten-Grundgerüste | Skeleton-Rohbau, unverändert |

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
