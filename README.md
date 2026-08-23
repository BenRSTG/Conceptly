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

Die im Build-Prompt vorgegebenen Farbwerte (`#2A2A2E` Anthrazit, `#C9AE87`
Sand) sind als CSS-Variablen in `app/globals.css` hinterlegt und über
Tailwind-Utilities (`bg-anthracite`, `text-sand-dark`, …) nutzbar. Die
Logo-Komponente (`components/Logo.tsx`) ist aus der Markenbeschreibung
nachgebaut (Script-Wordmark, Sand-Brush-Circle, dünner Rahmen, gesperrte
Tagline) — sobald `Conceptly_-_Final.pdf` als Datei vorliegt, den echten
Export unter `/public/logo/` ablegen und `Logo.tsx` auf ein `<Image>`
umstellen.

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
