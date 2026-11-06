# Shopify einrichten — Schritt für Schritt

Diese Anleitung ist für dich, Ben. Du brauchst dafür keine Programmierkenntnisse,
nur einen Browser und eine E-Mail-Adresse. Sie führt dich bis zu dem Punkt, an
dem ich (Claude) das Theme live in einem Vorschau-Shop zeigen kann.

## 1. Shopify-Partner-Account anlegen (kostenlos)

1. Öffne https://www.shopify.com/partners
2. Klick auf „Partner werden" / „Join Shopify Partners".
3. Formular ausfüllen (Name, E-Mail, Passwort). Bei der Frage nach deiner Rolle
   kannst du „Ich baue einen eigenen Shop" / „I'm building my own store" o. Ä.
   wählen — es gibt keine falsche Antwort, das ändert nur ein paar
   Willkommens-Tipps.
4. E-Mail bestätigen.

Ein Partner-Account kostet nichts und erlaubt dir, beliebig viele kostenlose
**Entwicklungs-Shops** (siehe Schritt 2) anzulegen, in denen man ohne
Zahlungspflicht bauen und testen kann.

## 2. Entwicklungs-Shop anlegen (kostenlos)

1. Im Partner-Dashboard: „Shops" → „Shop hinzufügen" / „Add store" →
   „Entwicklungs-Shop erstellen" / „Create development store".
2. Shop-Zweck: „Für einen Kunden testen" oder „Theme/App testen" auswählen
   (nicht „für den eigenen Einzelhandel" — das würde eine Testdaten-Variante
   mit Fake-Produkten anlegen, die wir nicht brauchen; wähle die leere
   Variante „Start from scratch" / „Von Grund auf neu").
3. Shop-Name vergeben, z. B. `conceptly-dev`. Daraus wird deine Domain:
   `conceptly-dev.myshopify.com` (der Teil vor `.myshopify.com` muss
   shopweit eindeutig sein — falls der Name vergeben ist, einfach eine Zahl
   anhängen).
4. Shop wird in ein bis zwei Minuten erstellt.

**Wichtig:** Dieser Shop ist zunächst nur für dich und mich zum Bauen/Testen.
Er kann keine echten Bestellungen/Zahlungen verarbeiten, bis er später
(kurz vor dem Livegang) auf einen echten Tarif umgestellt wird — dazu mehr in
Schritt 5.

## 3. Mir die Shop-Domain nennen

Schick mir einfach die Domain aus Schritt 2, z. B. `conceptly-dev.myshopify.com`.
Mehr brauche ich von dir nicht — kein Passwort, kein API-Schlüssel.

## 4. Verbindung herstellen (einmalig)

Sobald ich die Domain habe, starte ich auf meiner Seite die Shopify-CLI mit
diesem Befehl:

```bash
shopify theme dev --store=conceptly-dev.myshopify.com
```

Das öffnet einen Login-Link mit einem kurzen Code. **Du** bekommst von mir
diesen Link + Code, öffnest ihn in deinem eigenen Browser und bestätigst dort
mit deinem Shopify-Login, dass die Verbindung erlaubt ist — ich logge mich
nirgends mit deinen Zugangsdaten ein. Danach kann ich dir für jeden
Baustein einen Vorschau-Link schicken, den du anklicken kannst, um das
aktuelle Theme live im Browser zu sehen (auch auf dem Handy).

## 5. Erst kurz vor dem Livegang nötig (noch nicht jetzt)

Diese Schritte kommen erst, wenn das Theme inhaltlich fertig ist — ich sage dir
rechtzeitig Bescheid:

1. **Tarif wählen & Zahlungsarten aktivieren**: Entwicklungs-Shop auf einen
   echten Shopify-Tarif upgraden (oder direkt einen neuen Shop mit Tarif
   anlegen), damit echte Bestellungen/Zahlungen möglich sind. Zahlungsarten
   (Shopify Payments, PayPal, Klarna) richtest du im Admin unter
   „Einstellungen → Zahlungen" ein — ich dokumentiere dir die genauen
   Klickpfade, wenn wir bei diesem Schritt sind.
2. **GitHub-Integration verbinden**: Im Shopify-Admin unter
   „Onlineshop → Themes" → „Von GitHub hinzufügen" / „Add from GitHub" den
   Branch `main` dieses Repos (`BenRSTG/Conceptly`) verbinden. Danach wird
   jeder Push auf `main` automatisch mit dem verbundenen Theme
   synchronisiert.
3. **Eigene Domain verbinden** (z. B. `conceptly.de`), falls gewünscht.

## Offene Punkte

- TODO_BEN: Shop-Domain aus Schritt 3 an mich weitergeben, sobald angelegt.
- TODO_BEN: Entscheidung, welche Zahlungsarten aktiviert werden sollen
  (Shopify Payments ist Standard; PayPal und Klarna zusätzlich aktivierbar —
  beide sind im Briefing (`PROJEKT.md`, Abschnitt 6) bereits vorgesehen).
