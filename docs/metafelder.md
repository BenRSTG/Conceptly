# Metafelder & Metaobjekte

Diese Felder sind bereits in deinem Shop angelegt (über die Shopify Admin API
eingerichtet, einmalig — du musst hier nichts mehr konfigurieren). Diese
Seite erklärt dir nur, was es gibt und wofür es gedacht ist.

## Produkt-Metafelder

Beim Bearbeiten eines Produkts siehst du diese Felder oben auf der Seite
(angepinnt, kein Suchen im Metafelder-Bereich nötig):

| Feld | Typ | Beispiel | Hinweis |
| --- | --- | --- | --- |
| **Material** | Kurztext | „Eichenholz, Messing" | Frei formulierbar |
| **Maße** | Kurztext | „42 × 30 × 15 cm" | Frei formulierbar |
| **Pflege** | Mehrzeiliger Text | „Nur trocken abwischen…" | — |
| **Story / Herkunft** | Mehrzeiliger Text | „Handgefertigt in …" | — |
| **Lieferzeit (Override)** | Kurztext | „3–5 Werktage" | Nur ausfüllen, wenn abweichend von der Standard-Lieferzeit in den Theme-Einstellungen. Leer lassen = Standardwert gilt. |
| **Hersteller** | Verweis auf Metaobjekt | — | Hersteller-Eintrag auswählen (siehe unten). Pflicht für GPSR-Konformität. |
| **Passt dazu** | Liste von Produkten | — | Bis zu mehrere Produkte auswählen, die zu diesem Produkt passen. |

Leere Felder werden auf der Produktseite automatisch ausgeblendet — du musst
nicht alles ausfüllen, bevor ein Produkt online gehen kann.

## Metaobjekt „Hersteller"

Für die EU-Produktsicherheitsverordnung (GPSR) brauchst du pro Produkt
Hersteller-/Importeur-Angaben. Statt sie bei jedem Produkt neu zu tippen,
legst du jeden Hersteller/Lieferanten **einmal** als eigenen Eintrag an und
wählst ihn dann bei jedem passenden Produkt im Feld „Hersteller" aus.

**Anlegen:** Shopify-Admin → Inhalte → Metaobjekte → „Hersteller" → Eintrag
hinzufügen.

| Feld | Typ |
| --- | --- |
| Name | Kurztext |
| Anschrift | Mehrzeiliger Text |
| Kontakt (E-Mail/Telefon) | Kurztext |
| Sicherheitshinweise | Mehrzeiliger Text (optional) |

## Metaobjekt „Lookbook"

Für die „Räume"-Seiten (Schritt 7). Ein Lookbook ist ein Raumbild mit
anklickbaren Produkt-Hotspots.

**Anlegen:** Shopify-Admin → Inhalte → Metaobjekte → „Lookbook" → Eintrag
hinzufügen. Ausführliche Klick-Anleitung folgt in `docs/lookbook-anlegen.md`,
sobald die Lookbook-Seiten in Schritt 7 gebaut sind.

| Feld | Typ |
| --- | --- |
| Titel | Kurztext |
| Raumbild | Bild |
| Text | Mehrzeiliger Text |
| Hotspots | Liste von „Lookbook-Hotspot"-Einträgen |

### Metaobjekt „Lookbook-Hotspot" (Hilfs-Typ, nicht einzeln anlegen)

Ein Hotspot verknüpft ein Produkt mit einer Position im Raumbild. Du legst
Hotspots direkt beim Bearbeiten eines Lookbooks an (im Feld „Hotspots" →
„Neuer Eintrag"), nicht als eigenständige Liste.

| Feld | Typ | Hinweis |
| --- | --- | --- |
| Produkt | Verweis auf Produkt | — |
| X-Position (%) | Zahl, 0–100 | 0 = ganz links, 100 = ganz rechts im Bild |
| Y-Position (%) | Zahl, 0–100 | 0 = ganz oben, 100 = ganz unten im Bild |

Die X/Y-Werte ermittelst du am einfachsten, indem du das Raumbild in einem
Bildbearbeitungsprogramm öffnest und die Position der gewünschten Stelle als
Prozent der Bildbreite/-höhe abliest. Eine komfortablere Klick-zum-Setzen-
Variante ist für später denkbar, aber kein Phase-1-Ziel.

## Technische Details (für mich/Claude)

- Namespace aller Produkt-Metafelder: `conceptly` (z. B. `product.metafields.conceptly.material`).
- Alle Definitionen haben `storefront: PUBLIC_READ`, sind also im Theme per
  Liquid lesbar.
- Angelegt per Shopify Admin GraphQL API (`metaobjectDefinitionCreate`,
  `metafieldDefinitionCreate`, `metafieldDefinitionPin`) über eine
  Custom-App mit den Scopes `read_products`, `write_products`,
  `read_metaobject_definitions`, `write_metaobject_definitions`,
  `read_metaobjects`, `write_metaobjects`. Die Custom App kann nach diesem
  Schritt bestehen bleiben (für spätere Metafeld-Änderungen) oder von Ben
  im Admin deinstalliert werden — das Theme selbst braucht sie zur Laufzeit
  nicht.
