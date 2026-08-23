# Conceptly

Webshop für kuratierte Deko- und Lifestyle-Produkte. Next.js (App Router) ·
TypeScript · Tailwind CSS v4 · Supabase (Postgres, Auth, Storage) · Stripe +
PayPal · Resend.

**Aktueller Stand: Phase 0 (Fundament) abgeschlossen.** Next.js-Projekt
steht, das vollständige Datenmodell aus der Spec liegt als Supabase-Migration
vor, das Conceptly-Branding (Anthrazit/Sand/Weiß, Script-Wordmark,
Brush-Circle-Motiv) ist als Design-System + Grundlayout (Header/Footer)
umgesetzt, die Startseite und ein erster `/shop`-Grundgerüst sind live, die
DSGVO-konforme Newsletter-Anmeldung (Double-Opt-In via Resend, Bestätigung/
Abmeldung) funktioniert end-to-end, und alle rechtlichen Pflichtseiten
(Impressum, AGB, Widerrufsbelehrung inkl. Muster-Formular, Datenschutz,
Versand) sind als geprüft zu befüllende Platzhalter angelegt.

Als Nächstes: Modul 5 (Admin-Produktverwaltung) als Grundlage für Shop-
Frontend, Checkout, Instagram-Generator und Reporting.

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
