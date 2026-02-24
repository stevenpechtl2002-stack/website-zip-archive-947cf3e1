

# Standard-Arbeitszeiten einfuegen (Daten-Insert)

## Status

Die `staff_shifts`-Tabelle hat aktuell **0 Eintraege**. Alle 9 aktiven Mitarbeiter haben keine Schichten hinterlegt. Deshalb gibt `get-available-slots` weiterhin leere Ergebnisse zurueck.

## Was jetzt passiert

Ein SQL-Insert wird ausgefuehrt, der fuer **alle 9 aktiven Mitarbeiter** Standard-Schichten anlegt:

- **Tage**: Montag bis Samstag (day_of_week 1-6)
- **Zeiten**: 09:00 - 18:00
- **Status**: is_working = true
- **Sonntag**: bleibt frei (kein Eintrag)

Das ergibt **54 neue Eintraege** (9 Mitarbeiter x 6 Tage).

## Ergebnis nach dem Fix

- `get-available-slots` liefert Slots von 09:00 bis 18:00 im 30-Minuten-Takt
- n8n-Abfragen funktionieren korrekt
- Arbeitszeiten koennen spaeter ueber das Dashboard angepasst werden

## Technische Details

### Datenbank (nur Daten-Insert, kein Schema-Change)

```text
INSERT INTO staff_shifts (staff_member_id, day_of_week, start_time, end_time, is_working)
SELECT id, day, '09:00', '18:00', true
FROM staff_members, generate_series(1, 6) AS day
WHERE is_active = true
```

### Keine Datei-Aenderungen noetig

Der bestehende Code (Edge Function `get-available-slots` und Hook `useStaffShifts`) ist bereits korrekt implementiert. Es fehlen nur die Daten in der Tabelle.

