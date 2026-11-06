# Conceptly — Shopify-Theme

Eigenständiges Shopify-Theme (Online Store 2.0) für **Conceptly**, einen
kuratierten Deko-/Lifestyle-Webshop. Tagline: „Handpicked. Urban. You."

Der frühere Next.js/Supabase/Stripe-Webshop ist archiviert im Branch
[`archive/nextjs-build`](https://github.com/BenRSTG/Conceptly/tree/archive/nextjs-build)
— siehe `DECISIONS.md` für den Hintergrund des Plattformwechsels.

## Einstieg

- **`PROJEKT.md`** — das vollständige Briefing (Zielgruppe, Funktionsumfang,
  Leitplanken, Phasen).
- **`CLAUDE.md`** — technische Doku: CLI-Befehle, Ordnerstruktur,
  Konventionen, Design-Tokens, Sections, Metafelder.
- **`DECISIONS.md`** — alle wichtigen technischen Entscheidungen mit
  Begründung.
- **`docs/shopify-setup.md`** — Shopify-Partner-Account & Entwicklungs-Shop
  einrichten (Start hier, wenn du noch keinen Shopify-Zugang hast).
- **`docs/`** — weitere Anleitungen für den täglichen Betrieb (Produkte
  anlegen, Lookbooks, Artikel schreiben, Frontpage bearbeiten), entstehen
  mit dem jeweiligen Baustein.

## Basis

Shopifys offizielles [`skeleton-theme`](https://github.com/Shopify/skeleton-theme),
Tag `v1.0.0` (klassisches Sections-/JSON-Template-Modell) — Begründung in
`DECISIONS.md`.

```bash
shopify theme dev --store=<dein-shop>.myshopify.com
shopify theme check
```
