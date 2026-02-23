

# Fehlende Tabellen, Trigger und API-Key-Automatisierung

## Zusammenfassung

Das bestehende System hat bereits Multi-Tenancy (RLS mit `auth.uid() = user_id`) auf den Kerntabellen. Es fehlen aber die Tabellen `customers`, `customer_api_keys`, `notifications` und `voice_agent_config`, sowie der erweiterte `handle_new_user()`-Trigger fuer automatische API-Key-Generierung und der `sync_reservation_to_contact`-Trigger.

---

## Was bereits existiert

- Tabellen: `staff_members`, `staff_shifts`, `shift_exceptions`, `products`, `reservations`, `contacts`, `profiles`, `user_roles`, `api_keys`
- RLS-Policies auf allen Tabellen mit `auth.uid() = user_id`
- `handle_new_user()` Trigger (erstellt Profil + Rolle "salon")
- `has_role()`, `is_admin()`, `get_staff_owner()` Funktionen
- Edge Functions: `generate-api-key`, `get-available-slots`, `create-reservation`, `cancel-reservation`
- Enum `app_role`: admin, salon, customer

## Was neu erstellt wird

### Phase 1: Datenbank-Migration

**1. Enum erweitern** -- `app_role` um 'sales' erweitern (falls gewuenscht, ansonsten bleibt es bei admin/salon/customer)

**2. Neue Tabellen:**

- **`customers`** -- Business-Kunden / Account-Inhaber
  - `id` uuid PK (= auth.users.id)
  - `email` text NOT NULL
  - `company_name` text nullable
  - `plan` text default 'starter'
  - `status` text default 'active'
  - `notes` text nullable
  - RLS: SELECT/UPDATE wenn `auth.uid() = id`, Admins ALL

- **`customer_api_keys`** -- Automatische API-Keys pro Business
  - `id` uuid PK default gen_random_uuid()
  - `customer_id` uuid NOT NULL (FK -> customers.id)
  - `api_key` uuid NOT NULL default gen_random_uuid()
  - `created_at`, `updated_at` timestamptz
  - RLS: SELECT/UPDATE wenn `auth.uid() = customer_id`, Admins ALL

- **`notifications`** -- Benachrichtigungen
  - `id` uuid PK default gen_random_uuid()
  - `user_id` uuid NOT NULL
  - `title` text NOT NULL
  - `message` text NOT NULL
  - `type` text default 'info' (info/success/warning/error)
  - `is_read` boolean default false
  - `created_at` timestamptz
  - RLS: SELECT/UPDATE wenn `auth.uid() = user_id`

- **`voice_agent_config`** -- Oeffnungszeiten / Konfiguration
  - `id` uuid PK default gen_random_uuid()
  - `user_id` uuid NOT NULL UNIQUE
  - `business_name` text nullable
  - `industry` text nullable
  - `opening_hours` jsonb default '{}'
  - `is_active` boolean default false
  - `created_at`, `updated_at` timestamptz
  - RLS: SELECT/UPDATE/INSERT/DELETE wenn `auth.uid() = user_id`

**3. Erweiterter `handle_new_user()` Trigger:**
- Profil erstellen (wie bisher)
- Rolle 'customer' zuweisen (statt 'salon')
- `customers`-Datensatz erstellen (id, email, company_name aus Metadaten)
- Automatisch `customer_api_keys`-Eintrag erstellen
- Willkommens-Notification erstellen

**4. Neuer `sync_reservation_to_contact()` Trigger:**
- AFTER INSERT auf `reservations`
- Sucht bestehenden Kontakt per Telefon, E-Mail oder Name
- Erstellt neuen Kontakt oder aktualisiert `booking_count` und `last_visit`

### Phase 2: Frontend-Aenderungen

**5. API-Einstellungen-Seite im Portal**
- Neuer Nav-Eintrag "API" in der Sidebar (in `ZenBookApp.tsx`)
- Neue Komponente `ApiSettings.tsx`:
  - Zeigt den automatisch generierten API-Key (aus `customer_api_keys`) maskiert an
  - Anzeigen/Verbergen-Toggle
  - Kopieren-Button
  - "Neuen Key generieren"-Button (regeneriert via `crypto.randomUUID()`)
  - Status-Badge (Aktiv/Inaktiv)
  - n8n-Konfigurationsanleitung mit Beispiel-JSON

**6. Hook `useCustomerApiKey`**
- Liest/schreibt `customer_api_keys` fuer den aktuellen User
- Funktion zum Regenerieren des Keys

**7. Hook `useBusinessSettings`**
- Liest/schreibt `voice_agent_config` (Oeffnungszeiten)
- `isDayClosed(dayIndex)` Hilfsfunktion
- Default-Werte: Mo-Fr 09:00-18:00, Sa 09:00-14:00, So geschlossen

**8. Hook `useNotifications`**
- Liest Notifications fuer den aktuellen User
- Markiert als gelesen

---

## Technische Details

### Datenbank-Migration SQL (Zusammenfassung)

```text
1. CREATE TABLE customers (id, email, company_name, plan, status, notes, created_at, updated_at)
2. CREATE TABLE customer_api_keys (id, customer_id FK, api_key, created_at, updated_at)
3. CREATE TABLE notifications (id, user_id, title, message, type, is_read, created_at)
4. CREATE TABLE voice_agent_config (id, user_id UNIQUE, business_name, industry, opening_hours jsonb, is_active, created_at, updated_at)
5. RLS aktivieren + Policies fuer alle neuen Tabellen
6. DROP + RECREATE handle_new_user() mit erweiterter Logik
7. CREATE sync_reservation_to_contact() Trigger-Funktion
8. CREATE TRIGGER on reservations AFTER INSERT
```

### Neue/Geaenderte Dateien

- `src/hooks/useCustomerApiKey.ts` -- neu
- `src/hooks/useBusinessSettings.ts` -- neu
- `src/hooks/useNotifications.ts` -- neu
- `src/components/zenbook/ApiSettings.tsx` -- neu (ersetzt/ergaenzt bestehende ApiKeyManagement)
- `src/components/zenbook/ZenBookApp.tsx` -- Nav-Eintrag "API" hinzufuegen
- `src/components/zenbook/index.ts` -- Export ergaenzen

### Bestehende Logik bleibt erhalten
- Die bestehende `api_keys`-Tabelle und `generate-api-key` Edge Function bleiben bestehen (fuer Voice-Agent-API-Keys)
- `customer_api_keys` ist ein separates, automatisch generiertes Key-System fuer Business-Kunden
- Alle bestehenden Hooks und Komponenten werden nicht veraendert

