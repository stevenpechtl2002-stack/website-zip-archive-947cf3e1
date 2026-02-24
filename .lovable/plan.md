

# Landing Page: Exakte Anpassung an zentime.io

## Zusammenfassung

Die Landing Page wird farblich und inhaltlich exakt an www.zentime.io angepasst. Das bedeutet ein Purple/Violet-Farbschema (statt Neon-Tuerkis/Pink) und alle Texte/Slogans werden 1:1 von zentime.io uebernommen. Treatwell-Formulierungen werden komplett entfernt.

---

## Farbschema-Aenderung (zurueck zu Purple/Violet wie zentime.io)

| Element | Aktuell (Neon) | Neu (zentime.io) |
|---|---|---|
| Primary | Tuerkis `168 85% 45%` | Indigo/Violet `252 80% 60%` |
| Accent | Neon-Pink `340 90% 55%` | Pink/Magenta `330 85% 60%` |
| Hintergrund | Warmgrau `30 20% 97%` | Reines Weiss/Hellgrau `240 20% 98%` |
| Zen-Neon | Tuerkis | Violet `252 80% 60%` |
| Zen-Pink | Pink 340 | Magenta-Pink `330 85% 60%` |
| Zen-Emerald | bleibt Mint `160 60% 45%` | bleibt (fuer Schwebeelemente) |
| Glow-Pulse Animationen | Tuerkis/Pink Glow | Violet/Pink Glow |

---

## Text-/Slogan-Aenderungen (zentime.io-Original)

| Bereich | Aktuell (Treatwell-inspiriert) | Neu (zentime.io) |
|---|---|---|
| Promo Banner | "ZenTime Rewards - Sammle Punkte..." | "Ready for your glow? - Entdecke dein Wohlbefinden" |
| Hero Tagline | "Dein Beauty-Erlebnis wartet" | "READY FOR YOUR GLOW?" |
| Hero Headline | "Ueberspring den Stress. Buch das Treatment." | "Alles fuer dein Wohlbefinden." |
| Hero Subtext | "Finde und buche die besten Friseure..." | "Ueber 5.000 verifizierte Salons. Einfach buchen, entspannt geniessen." |
| CTA Button | "Auf ZenTime finden" | "Suchen" |
| Salons Headline | "Die besten Salons in deiner Naehe" | "Die besten Salons in deiner Naehe" (bleibt) |
| USP Headline | "Einfach schoener buchen" | Entfernen oder umformulieren zu "Warum ZenTime?" |
| USP Sub | "Warum ueber 2 Millionen Menschen ZenTime vertrauen" | anpassen |
| Inspiration | "Bereit fuer eine Veraenderung?" | "Bereit fuer eine Veraenderung?" (bleibt, ist von zentime.io) |
| Inspiration Sub | "Exzellenz in jedem Schnitt." | "Exzellenz in jedem Schnitt." (bleibt) |
| Business Headline | "Sie haben einen Salon? Bringen Sie ihn online." | "Wachstum als Standard." |
| Business Sub | "Die leistungsstaerkste Suite..." | "Die leistungsstaerkste Suite fuer moderne Salons. Praesentiere deine Produkte und Services." |
| Business CTA | "Jetzt Partner werden" | "Jetzt starten" + "Demo anfordern" |
| Footer Brand | "ZenTime Beauty" | "ZenTime Beauty" (bleibt) |

---

## Suchformular-Aenderung

zentime.io hat nur **2 Suchfelder** (nicht 3):
- "Welche Behandlung?" (mit Such-Icon)
- "In welcher Stadt?" (mit MapPin-Icon)
- Button: "SUCHEN" (purple/primary)

Das dritte Feld "Beliebiges Datum" wird entfernt.

---

## Technische Details

### Geaenderte Dateien

| Datei | Aenderung |
|---|---|
| `src/index.css` | Alle CSS-Variablen: Primary zu Violet `252 80% 60%`, Accent zu Pink `330 85% 60%`, Hintergrund heller, Glow-Animationen auf Violet/Pink, zen-neon und zen-pink Variablen anpassen |
| `src/components/zenbook/LandingPage.tsx` | Alle Texte/Slogans ersetzen, Suchformular auf 2 Felder reduzieren, CTA-Texte aendern, Business-Section umformulieren |
| `src/components/zenbook/Logo.tsx` | Farbanpassung an neues Purple-Schema (Logo-Icon Gradient von Violet zu Pink) |

### Keine neuen Abhaengigkeiten

