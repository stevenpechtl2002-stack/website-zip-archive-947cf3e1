

# Landing Page Redesign: Treatwell-inspiriert + Moderne 3D-Elemente

## Zusammenfassung

Die Landing Page wird komplett umgebaut mit dem Umfang und der Struktur von Treatwell.de, aber in einem moderneren Look mit 3D-Hover-Effekten, Glassmorphism und Framer-Motion-Animationen. Die Farbwelt wird warm und einladend (Treatwell-inspiriert), waehrend die Interaktionen futuristisch bleiben.

---

## Farbschema

| Element | Aktuell | Neu |
|---|---|---|
| Primaer | Indigo `239 84% 67%` | Dunkles Petrol `195 80% 28%` |
| Akzent/CTA | Violet Gradient | Warmes Korall `16 85% 58%` |
| Hintergrund | Blau-Grau mit Gradienten | Sauberes Weiss/Warmgrau |
| Text | Slate | Dunkles Navy |
| Sekundaer | Pink | Warmes Gruen `160 60% 45%` fuer Erfolg/Badges |

---

## Neue Sektionen und Struktur

### 1. Promo-Banner (NEU)
- Schmaler Gradient-Banner oben: "ZenBook Rewards - Sammle Punkte bei jeder Buchung"
- Schliessen-Button, weiche Animation beim Einblenden

### 2. Header (ueberarbeitet)
- Glassmorphism-Header mit Backdrop-Blur
- Kategorie-Navigation darunter: Friseur | Naegel | Kosmetik | Massage | Maenner | Sale %
- Jede Kategorie mit Icon, 3D-Hover (leichtes `translateY(-4px)` + Schatten)

### 3. Hero Section (ueberarbeitet)
- Grosses Hintergrundbild rechts, Suchformular als schwebende Glasskarte links
- 3 Suchfelder: Behandlung, Postleitzahl, Datum
- CTA-Button in Korall mit 3D-Press-Effekt (`scale(0.95)` on tap, `translateY(-3px)` on hover)
- Schwebende 3D-Glasskarten im Hintergrund mit `perspective` und `rotateX/Y`
- Tagline: "Ueberspring den Stress. Buch das Treatment."

### 4. Kategorie-Kacheln (NEU)
- Horizontales Scroll-Grid mit 6-8 Behandlungskategorien
- Jede Kachel: Rundes Bild + Name, 3D-Hover mit `perspective(800px) rotateY(5deg)`
- Smooth Scroll mit Drag-Geste (Framer Motion `drag="x"`)

### 5. Featured Salons (angepasst)
- Bestehendes Grid bleibt, aber Karten erhalten:
  - 3D-Tilt auf Hover: `perspective(1000px) rotateX(2deg) rotateY(-2deg)`
  - Glassmorphism-Overlay beim Hover
  - Sanfter `translateY(-12px)` Lift
  - Schatten-Vergroesserung mit Farbton

### 6. USP-Section "Einfach schoener buchen" (NEU)
- 3 Spalten mit grossen Icons in schwebenden Glasskarten
- Jede Karte mit 3D-Hover und `glow-pulse` Effekt
- Staggered Entrance Animation (nacheinander einblenden)

### 7. Promo-Cards (NEU - 2er Grid)
- Karte 1: "Gutscheine verschenken" mit buntem Gradient-Hintergrund
- Karte 2: "Top Rated 2026" mit Badge-Grafik
- Beide mit 3D-Tilt-Hover und `perspective`

### 8. App-Download-Banner (NEU)
- Grosser Banner mit Gradient-Hintergrund
- App-Mockup schwebt mit `float-animation`
- Download-Buttons mit 3D-Press-Effekt

### 9. Inspiration/Kategorie-Bild (bestehend, angepasst)
- Farben an neues Schema anpassen
- 3D-Parallax beibehalten

### 10. Business Section (bestehend, angepasst)
- Farben anpassen (Korall statt Violet fuer CTAs)
- 3D-Schwebeelemente beibehalten

### 11. Stats Section (angepasst)
- Glassmorphism-Cards statt reinem Text
- 3D-Hover mit leichtem Tilt
- Counter-Animation (Zahlen zaehlen hoch)

### 12. Erweiterter Footer (NEU)
- 4-Spalten Layout:
  - Kunden-Hilfe
  - Entdecke (Guide, Blog, Gutscheine)
  - Geschaeftspartner
  - Unternehmen (Ueber uns, Jobs, Impressum)
- Social Media Icons mit 3D-Hover
- Copyright + Admin-Link

---

## 3D-Effekte und Animationen

1. **Card 3D Tilt**: `perspective(1000px)` mit `rotateX/Y` auf Mouse-Move oder Hover
2. **Glassmorphism Everywhere**: `bg-white/60 backdrop-blur-2xl border border-white/30`
3. **Floating Elements**: Grosse Gradient-Kugeln schweben im Hintergrund
4. **Staggered Entrance**: Elemente erscheinen nacheinander (delay pro Index)
5. **CTA 3D Press**: Buttons heben sich auf Hover, druecken sich auf Click
6. **Shimmer auf Hero**: Subtiler Lichtstreifen ueber dem CTA
7. **Glow Pulse**: Farbige Schatten pulsieren sanft auf wichtigen Elementen
8. **Parallax Scrolling**: Hintergrund-Elemente bewegen sich langsamer als Vordergrund

---

## Technische Details

### Geaenderte Dateien

| Datei | Aenderung |
|---|---|
| `src/index.css` | CSS-Variablen fuer neues Farbschema (Primary wird Petrol, neuer `--accent-coral` Farbton) |
| `src/components/zenbook/LandingPage.tsx` | Kompletter Rewrite mit allen neuen Sektionen, Treatwell-Layout, 3D-Hover-Effekte |
| `src/components/zenbook/Logo.tsx` | Farbliche Anpassung an neues Petrol/Korall-Schema |

### Keine neuen Abhaengigkeiten
- Framer Motion und Lucide Icons sind bereits installiert
- Alle 3D-Effekte werden mit CSS `perspective`/`transform` und Framer Motion `whileHover` umgesetzt

