# Conceptly

Webshop für kuratierte Deko- und Lifestyle-Produkte. Next.js (App Router) ·
TypeScript · Tailwind CSS v4 · Supabase (Postgres, Auth, Storage) · Stripe +
PayPal · Resend.

**Aktueller Stand: Phase 0 (Fundament) + Modul 5 (Admin-Produktverwaltung) +
Modul 6 (Shop-Frontend & Checkout) abgeschlossen.** Next.js-Projekt steht, das vollständige Datenmodell aus der
Spec liegt als Supabase-Migration vor, das echte Conceptly-Branding ist
eingebunden (siehe unten), die Startseite und ein erster `/shop`-Grundgerüst
sind live, die DSGVO-konforme Newsletter-Anmeldung (Double-Opt-In via
Resend) funktioniert end-to-end, und alle rechtlichen Pflichtseiten sind als
Platzhalter angelegt.

Modul 5 ergänzt einen passwortgeschützten Admin-Bereich (`/admin`, Supabase-
Auth-Login + `admin_users`-Gate): Produktliste mit Such-/Status-/
Kategorie-Filtern und Mehrfachauswahl (veröffentlichen/archivieren/löschen
in einem Rutsch), einen Produkt-Editor mit Live-Vorschau, Drag-&-Drop-
Bilder-Upload nach Supabase Storage, einem Varianten-Editor und SEO-Feldern,
sowie eine einfache Kategorienverwaltung. Lagerbestand-Warnungen laufen über
`low_stock_threshold` und erscheinen auf dem Admin-Dashboard. Ein
Admin-Login und ein echtes Supabase-Projekt sind nötig, um den Bereich zu
testen — lokal ohne Zugangsdaten konnte nur das Auth-Gate selbst
(Redirect-Verhalten) geprüft werden, nicht die Formulare/Uploads dahinter.

Modul 6 ergänzt das Shop-Frontend & den Checkout: `/shop` mit Kategorie-/
Preis-/Verfügbarkeits-Filtern, Produktdetailseiten mit Bildergalerie und
Varianten-Auswahl, ein per `localStorage` persistierter Warenkorb (Gast-
Checkout, kein Login nötig), eine Versandkosten-Staffel nach Gewicht/
Bestellwert (`lib/shipping.ts`, Platzhalterwerte), sowie Stripe Checkout und
PayPal Orders v2 als Zahlungsarten. Der Checkout-Flow legt serverseitig eine
`pending`-Bestellung an (Preise werden aus der DB neu berechnet, nie vom
Client übernommen), leitet zum jeweiligen Zahlungsanbieter weiter und
verarbeitet `checkout.session.completed` (Stripe) bzw.
`CHECKOUT.ORDER.APPROVED`/`PAYMENT.CAPTURE.COMPLETED` (PayPal) idempotent
über `lib/orders.ts::markOrderPaid` — setzt den Bestellstatus, reduziert den
Lagerbestand und verschickt die Bestätigungsmail. Ohne echte Stripe-/
PayPal-/Supabase-Zugangsdaten ließ sich nur das Fehlerverhalten der Routen
(sauberes 400 statt Absturz) prüfen, nicht der komplette Zahlungsablauf.

Als Nächstes: Modul 7 (Kundenbereich mit Login, Bestellhistorie, Adressen).

## Setup

```bash
npm install
cp .env.example .env.local   # Werte eintragen (Supabase, Stripe, PayPal, Resend)
```

Supabase-Schema anlegen (Projekt-URL/Keys aus dem Supabase-Dashboard in
`.env.local` eintragen, dann Migration ausführen):

```bash
npx supabase db push   # oder: SQL aus supabase/migrations/0001_init.sql im SQL-Editor ausführen
```

Nach der ersten Migration einen Admin-Account markieren (im SQL-Editor, mit
der `auth.users`-ID des jeweiligen Accounts):

```sql
insert into admin_users (user_id) values ('<auth-user-uuid>');
```

Dev-Server starten:

```bash
npm run dev
```

## Branding

Echtes Logo aus `Conceptly_-_Final.pdf` eingebunden: die Vektorpfade wurden
ausgelesen und als PNGs unter `/public/logo/` exportiert (`conceptly-full`
mit Tagline, `conceptly-compact` ohne Tagline für den Header, `conceptly-mark`
als isolierter Brush-Circle für Icons/Favicon/Hero-Hintergrund).
`components/Logo.tsx` rendert diese Assets direkt per `next/image`. Die
Farbwerte in `app/globals.css` sind exakt aus den PDF-Vektorpfaden
ausgelesen (`#313139` Anthrazit, `#E4D6BF`/`#D6C5AE` Sand); `--color-sand-dark`
ist eine für Text-/Hover-Kontrast auf Weiß abgedunkelte Ableitung derselben
Farbfamilie (WCAG AA). Die Headline-Schrift ist Google Fonts „Yellowtail"
als bester Web-Font-Match für die brush-artige Script-Anmutung des Original-
Schriftzugs.

## Datenmodell & RLS

Vollständiges Schema in `supabase/migrations/0001_init.sql`: Produkte,
Kategorien, Varianten, Kunden, Adressen, Bestellungen, Lagerbewegungen,
Shop-Events (Funnel-Tracking), Newsletter, Kunden-Messaging,
Instagram-Post-Assets. Admin-Rolle über eine `admin_users`-Tabelle +
`is_admin()`-SQL-Funktion, referenziert in allen RLS-Policies.

## Env-Variablen

Siehe `.env.example`. `SUPABASE_SERVICE_ROLE_KEY` wird ausschließlich in
server-only Code (`lib/supabase/service.ts`) für Checkout/Webhooks/Newsletter
verwendet und darf nie an den Client gelangen.
