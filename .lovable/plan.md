

# Fix: Arbeitszeiten (Staff Shifts) konfigurierbar machen

## Das Problem

Die `get-available-slots` Funktion gibt leere Slots zurueck, weil **keine Arbeitszeiten** (`staff_shifts`) in der Datenbank hinterlegt sind. Ohne Schichten weiss das System nicht, wann Mitarbeiter verfuegbar sind, und meldet daher "keine freien Termine".

## Die Loesung

### Schritt 1: Standard-Arbeitszeiten automatisch anlegen

Fuer alle 9 aktiven Mitarbeiter werden Standard-Schichten erstellt (Montag-Samstag, 09:00-18:00), damit sofort Slots verfuegbar sind.

Dies wird per SQL-Insert in die `staff_shifts`-Tabelle gemacht:
- Tage 1-6 (Montag bis Samstag)
- Startzeit: 09:00
- Endzeit: 18:00
- `is_working: true`
- Sonntag (0) bleibt frei

### Schritt 2: Sicherstellen, dass die StaffManagement-UI Schichten verwalten kann

Pruefen und sicherstellen, dass die bestehende Staff-Management-Oberflaeche im Dashboard die Moeglichkeit bietet, Arbeitszeiten pro Mitarbeiter zu bearbeiten. Falls die UI das nicht abdeckt, wird sie erweitert.

## Technische Details

### Datenbank-Aenderung (kein Schema-Change, nur Daten)

Insert von Standard-Schichten fuer alle aktiven Mitarbeiter:

```text
Fuer jeden der 9 Mitarbeiter:
  Fuer jeden Wochentag 1-6 (Mo-Sa):
    INSERT INTO staff_shifts (staff_member_id, day_of_week, start_time, end_time, is_working)
    VALUES (<staff_id>, <day>, '09:00', '18:00', true)
```

### Dateien die geprueft/angepasst werden

| Datei | Aenderung |
|---|---|
| Datenbank (`staff_shifts`) | Standard-Schichten fuer alle Mitarbeiter einfuegen |
| `src/components/zenbook/StaffManagement.tsx` | Pruefen ob Schicht-Verwaltung vorhanden ist |
| `src/components/zenbook/StaffCalendarView.tsx` | Pruefen ob Arbeitszeiten korrekt angezeigt werden |

### Ergebnis

Nach dem Fix wird `get-available-slots` fuer jeden Wochentag (Mo-Sa) Slots von 09:00 bis 18:00 im 30-Minuten-Takt zurueckgeben. Die Arbeitszeiten koennen dann ueber das Dashboard angepasst werden.
