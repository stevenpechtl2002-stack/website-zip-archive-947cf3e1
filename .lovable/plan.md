
# Kalender + Supabase API + n8n Voice Agent Integration

## Zusammenfassung

Ich werde den Kalender vollständig mit einer echten Datenbank verbinden und eine Multi-Tenant API bauen, sodass jeder Salonbesitzer seinen eigenen API-Schlüssel für den n8n Voice Agent bekommt.

---

## Was wird gebaut?

### 1. Datenbank-Schema (6 Tabellen)

```text
+-----------------+       +------------------+       +-------------------+
|   profiles      |       |   user_roles     |       |    api_keys       |
+-----------------+       +------------------+       +-------------------+
| id (auth.users) |       | user_id          |       | user_id           |
| email, name     |       | role (enum)      |       | key_hash          |
| avatar_url      |       +------------------+       | key_prefix        |
+-----------------+                                  | name, is_active   |
       |                                             +-------------------+
       v
+-----------------+       +------------------+       +-------------------+
| staff_members   |       |   products       |       |   reservations    |
+-----------------+       +------------------+       +-------------------+
| user_id (FK)    |       | user_id (FK)     |       | user_id (FK)      |
| name, color     |       | name, category   |       | customer_name     |
| avatar_url      |       | duration_minutes |       | date, time        |
| is_active       |       | price            |       | staff_member_id   |
+-----------------+       +------------------+       | product_id        |
       |                                             | status, source    |
       v                                             +-------------------+
+------------------+       +------------------+
|  staff_shifts    |       | shift_exceptions |
+------------------+       +------------------+
| staff_member_id  |       | staff_member_id  |
| day_of_week 0-6  |       | exception_date   |
| start/end_time   |       | start/end_time   |
| is_working       |       | reason           |
+------------------+       +------------------+
```

### 2. Edge Functions (API fur n8n Voice Agent)

| Endpunkt | Methode | Beschreibung |
|----------|---------|--------------|
| `/get-available-slots` | GET | Freie Termine abfragen |
| `/create-reservation` | POST | Buchung erstellen |
| `/cancel-reservation` | POST | Buchung stornieren |
| `/generate-api-key` | POST | Neuen API-Key erstellen |

### 3. Frontend-Anderungen

| Komponente | Anderung |
|------------|----------|
| `CalendarView.tsx` | Realtime-Subscription fur Live-Updates |
| `Settings.tsx` | API-Key Verwaltung hinzufugen |
| `ZenBookApp.tsx` | Auth-Integration + Supabase-Hooks |
| Neue Hooks | `useReservations`, `useStaffMembers`, `useProducts`, `useApiKeys` |

---

## Implementierungs-Schritte

### Phase 1: Datenbank-Migration

**SQL-Migration mit folgenden Tabellen:**

1. **`profiles`** - Benutzerprofile (id, email, full_name, avatar_url)
2. **`user_roles`** - Rollen-System (user_id, role enum: admin/salon/customer)
3. **`api_keys`** - API-Schlussel fur Voice Agent (key_hash, key_prefix, is_active)
4. **`staff_members`** - Mitarbeiter (user_id, name, avatar_url, color, is_active)
5. **`staff_shifts`** - Arbeitszeiten pro Wochentag (day_of_week 0-6, start/end_time)
6. **`shift_exceptions`** - Urlaub/Pausen (exception_date, reason)
7. **`products`** - Services (category, name, duration_minutes, price)
8. **`reservations`** - Buchungen (date, time, staff_member_id, product_id, status, source)
9. **`contacts`** - Kundendaten (name, phone, email, booking_count)

**Sicherheits-Funktionen:**
- `has_role()` - Sichere Rollen-Prufung ohne RLS-Rekursion
- `update_updated_at_column()` - Automatische Timestamp-Updates
- Trigger fur Profil-Erstellung bei neuer Registrierung

**RLS-Policies:**
- Alle Tabellen: Benutzer sehen nur eigene Daten uber `user_id`
- Reservierungen: Offentliche INSERT-Policy fur API-Zugriff

**Realtime:**
- Aktiviert fur `reservations` Tabelle

### Phase 2: Edge Functions

**Datei 1: `supabase/functions/get-available-slots/index.ts`**

```
GET /get-available-slots?date=2025-02-07&staff_id=uuid&duration=60
Header: x-api-key: zen_live_xxx

Logik:
1. API-Key validieren -> user_id ermitteln
2. Arbeitszeiten fur den Wochentag laden (staff_shifts)
3. Bestehende Buchungen laden (reservations)
4. Ausnahmen prufen (shift_exceptions)
5. Freie Slots berechnen und zuruckgeben

Response:
{
  "success": true,
  "date": "2025-02-07",
  "slots": [
    { "time": "09:00", "staff_name": "Sarah M.", "staff_id": "..." },
    { "time": "10:30", "staff_name": "Sarah M.", "staff_id": "..." }
  ]
}
```

**Datei 2: `supabase/functions/create-reservation/index.ts`**

```
POST /create-reservation
Header: x-api-key: zen_live_xxx
Body: {
  "customer_name": "Max Mustermann",
  "customer_phone": "+49 171 1234567",
  "date": "2025-02-07",
  "time": "14:00",
  "staff_id": "uuid",
  "product_id": "uuid"
}

Logik:
1. API-Key validieren
2. Slot-Verfugbarkeit prufen
3. Endzeit berechnen (Zeit + Service-Dauer)
4. Buchung in reservations erstellen
5. Kontakt in contacts erstellen/aktualisieren
6. Bestatigung zuruckgeben
```

**Datei 3: `supabase/functions/cancel-reservation/index.ts`**

```
POST /cancel-reservation
Header: x-api-key: zen_live_xxx
Body: { "reservation_id": "uuid" }
       ODER { "customer_phone": "+49...", "date": "2025-02-07" }
```

**Datei 4: `supabase/functions/generate-api-key/index.ts`**

```
POST /generate-api-key
Header: Authorization: Bearer <session_token>

Logik:
1. Benutzer-Session validieren
2. Neuen Key generieren (zen_live_bk_[32-random-chars])
3. SHA-256 Hash speichern
4. Klartext-Key einmalig zuruckgeben
```

### Phase 3: React Hooks

**Neue Dateien:**

| Datei | Zweck |
|-------|-------|
| `src/hooks/useAuth.ts` | Auth State + Session Management |
| `src/hooks/useReservations.ts` | CRUD + Realtime Subscription |
| `src/hooks/useStaffMembers.ts` | Mitarbeiter CRUD |
| `src/hooks/useStaffShifts.ts` | Arbeitszeiten CRUD |
| `src/hooks/useProducts.ts` | Services CRUD |
| `src/hooks/useContacts.ts` | Kundendaten CRUD |
| `src/hooks/useApiKeys.ts` | API-Keys generieren/verwalten |
| `src/hooks/useAvailableSlots.ts` | Freie Slots vom Backend |

**Beispiel useReservations.ts:**
```typescript
// Realtime-Subscription
useEffect(() => {
  const channel = supabase
    .channel('reservations-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'reservations' },
      () => refetch()
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, []);
```

### Phase 4: Frontend-Komponenten

**Anderungen an bestehenden Dateien:**

1. **`src/components/zenbook/ZenBookApp.tsx`**
   - Auth-Provider Integration
   - `storageService` durch Supabase-Hooks ersetzen
   - Login/Logout mit echtem Auth

2. **`src/components/zenbook/CalendarView.tsx`**
   - Realtime-Updates empfangen
   - `appointments` aus `useReservations` Hook

3. **`src/components/zenbook/Settings.tsx`**
   - API-Key Verwaltungs-UI hinzufugen:
     - Aktive Keys anzeigen
     - Neuen Key generieren
     - Key kopieren
     - Key deaktivieren/loschen
   - API-Endpunkte dokumentieren

4. **`src/types/index.ts`**
   - Neue Types fur Supabase-Tabellen

5. **`supabase/config.toml`**
   - Edge Functions Konfiguration (verify_jwt = false)

**Neue Auth-Komponenten:**

| Datei | Zweck |
|-------|-------|
| `src/components/auth/AuthProvider.tsx` | Auth Context Provider |
| `src/components/auth/LoginForm.tsx` | Login Formular |
| `src/components/auth/SignupForm.tsx` | Registrierung |
| `src/components/auth/ProtectedRoute.tsx` | Route Guard |

---

## API-Key System

### Format

```
zen_live_bk_[32-random-chars]
```
- `zen_live_` - Prefix fur Identifikation
- `bk_` - Key-Typ (booking)
- Rest: Zufallszeichen

### Sicherheit

- Keys werden **gehashed** gespeichert (SHA-256)
- Klartext wird **nur einmal** angezeigt
- `is_active` Flag fur Deaktivierung
- `last_used_at` Timestamp fur Monitoring

### UI im Dashboard

```
+----------------------------------------------------------+
|  API Schlussel fur Voice Agent                           |
+----------------------------------------------------------+
|                                                          |
|  Aktive Keys:                                            |
|  +-----------------------------------------------------+ |
|  | zen_live_bk_a8f3...  Voice Agent  14.02.2025        | |
|  |                               [Kopieren] [Loschen]  | |
|  +-----------------------------------------------------+ |
|                                                          |
|  [ + Neuen Key generieren ]                              |
|                                                          |
|  API Endpunkte:                                          |
|  GET  /functions/v1/get-available-slots?date=YYYY-MM-DD  |
|  POST /functions/v1/create-reservation                   |
|  POST /functions/v1/cancel-reservation                   |
|                                                          |
+----------------------------------------------------------+
```

---

## n8n Voice Agent Konfiguration

Nach der Implementierung kann der Voice Agent so konfiguriert werden:

### HTTP Request Nodes

**1. Verfugbarkeit prufen:**
```
Method: GET
URL: https://lnzhonyvlrtwlzzxhlao.supabase.co/functions/v1/get-available-slots
Query: date={{ $json.date }}&duration=60
Headers: x-api-key={{ $credentials.zenbook_api_key }}
```

**2. Buchung erstellen:**
```
Method: POST
URL: https://lnzhonyvlrtwlzzxhlao.supabase.co/functions/v1/create-reservation
Headers: 
  x-api-key={{ $credentials.zenbook_api_key }}
  Content-Type: application/json
Body: {
  "customer_name": "{{ $json.name }}",
  "customer_phone": "{{ $json.phone }}",
  "date": "{{ $json.date }}",
  "time": "{{ $json.time }}",
  "staff_id": "{{ $json.staff_id }}",
  "product_id": "{{ $json.product_id }}"
}
```

**3. Stornierung:**
```
Method: POST
URL: https://lnzhonyvlrtwlzzxhlao.supabase.co/functions/v1/cancel-reservation
Headers: x-api-key={{ $credentials.zenbook_api_key }}
Body: { "reservation_id": "{{ $json.reservation_id }}" }
```

---

## Dateien-Ubersicht

### Neue Dateien (20 Dateien)

```text
supabase/functions/
  get-available-slots/index.ts    # Slots abfragen
  create-reservation/index.ts     # Buchung erstellen
  cancel-reservation/index.ts     # Buchung stornieren
  generate-api-key/index.ts       # API-Key erstellen

src/hooks/
  useAuth.ts                      # Auth State
  useReservations.ts              # Buchungen + Realtime
  useStaffMembers.ts              # Mitarbeiter
  useStaffShifts.ts               # Arbeitszeiten
  useProducts.ts                  # Services
  useContacts.ts                  # Kunden
  useApiKeys.ts                   # API-Keys
  useAvailableSlots.ts            # Freie Slots

src/components/auth/
  AuthProvider.tsx                # Context
  LoginForm.tsx                   # Login
  SignupForm.tsx                  # Registrierung
  ProtectedRoute.tsx              # Route Guard
```

### Zu andernde Dateien (7 Dateien)

```text
src/App.tsx                       # AuthProvider + Routes
src/components/zenbook/
  ZenBookApp.tsx                  # Auth + Supabase Hooks
  CalendarView.tsx                # Realtime Integration
  Settings.tsx                    # API-Key UI
  StaffManagement.tsx             # Supabase CRUD
  ServiceManagement.tsx           # Supabase CRUD
src/types/index.ts                # Neue Types
supabase/config.toml              # Edge Function Config
```

---

## Zeitschatzung

| Phase | Beschreibung | Aufwand |
|-------|--------------|---------|
| Phase 1 | Datenbank-Migration + RLS | 1 Iteration |
| Phase 2 | Edge Functions (4 Stuck) | 2 Iterationen |
| Phase 3 | React Hooks (8 Stuck) | 2 Iterationen |
| Phase 4 | Frontend-Integration | 2 Iterationen |
| Phase 5 | Auth-System | 1 Iteration |
| **Gesamt** | | **~8 Iterationen** |

---

## Ergebnis

Nach der Implementierung:
- Jeder Salonbesitzer hat seinen eigenen API-Key
- Der Voice Agent kann uber n8n Slots abfragen und Buchungen erstellen
- Der Kalender aktualisiert sich in Echtzeit
- Alle Daten sind sicher in der Datenbank gespeichert
- Multi-Tenant-fahig: Mehrere Salons konnen die gleiche App nutzen
