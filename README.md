# Vertragsverwaltung

Eine moderne Webanwendung zur Verwaltung von Verträgen.

**Tech-Stack:** React + Material UI (Frontend) · Node.js + Express (Backend) · SQLite + Prisma ORM (Datenbank)

---

## Projektstruktur

```
contract-manager/
├── backend/
│   ├── controllers/       # Request-Handling (Contract, Document)
│   ├── routes/             # Express-Routen / REST-API
│   ├── services/           # Datenbankzugriff über Prisma
│   ├── middleware/         # Error-Handling, Upload (vorbereitet), Auth (vorbereitet)
│   ├── prisma/              # Schema + Seed-Skript
│   ├── app.js               # Express-App-Konfiguration
│   └── server.js            # Einstiegspunkt
└── frontend/
    └── src/
        ├── components/     # StatCard, ContractTable, ContractFormDialog, ConfirmDialog
        ├── pages/           # DashboardPage
        ├── layouts/         # MainLayout (Sidebar/AppBar)
        ├── hooks/            # useContracts, useDashboardStats
        ├── services/         # API-Client (axios)
        └── constants/        # Status-/Kategorie-Optionen
```

---

## Voraussetzungen

- Node.js ≥ 18
- npm

---

## 1. Backend starten

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Das Backend läuft danach auf **http://localhost:4000**.

`npx prisma migrate dev` legt automatisch die SQLite-Datei `dev.db` an und erstellt die Tabellen `contracts` und `documents`. `npm run prisma:seed` befüllt die Datenbank mit 6 Beispiel-Verträgen.

Praktisches Tool zum Ansehen der Datenbank im Browser:
```bash
npx prisma studio
```

---

## 2. Frontend starten

In einem zweiten Terminal:

```bash
cd frontend
npm install
npm run dev
```

Das Frontend läuft auf **http://localhost:5173** und leitet alle `/api`-Aufrufe automatisch an das Backend (Port 4000) weiter (siehe `vite.config.js`).

Öffne im Browser: **http://localhost:5173**

---

## REST-API

| Methode | Endpoint                          | Beschreibung                          |
|---------|------------------------------------|----------------------------------------|
| GET     | `/api/contracts`                  | Alle Verträge (Filter: `?search=`, `?status=`, `?category=`) |
| GET     | `/api/contracts/:id`              | Einzelnen Vertrag abrufen             |
| POST    | `/api/contracts`                  | Neuen Vertrag anlegen                 |
| PUT     | `/api/contracts/:id`               | Vertrag bearbeiten                     |
| DELETE  | `/api/contracts/:id`               | Vertrag löschen                        |
| GET     | `/api/contracts/stats/dashboard`   | Dashboard-Kennzahlen                   |
| GET     | `/api/contracts/:id/documents`    | Dokumente eines Vertrags               |
| POST    | `/api/contracts/:id/documents`    | Dokument-Metadaten anlegen             |
| DELETE  | `/api/documents/:id`               | Dokument löschen                        |

---

## Umstieg auf PostgreSQL

1. In `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. In `backend/.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/vertragsverwaltung"
   ```
3. `npx prisma migrate dev` erneut ausführen.

Da im Schema ausschließlich Prisma-eigene, datenbankunabhängige Typen verwendet werden, ist keine weitere Anpassung nötig.

---

## Vorbereitete Erweiterungen

Die Architektur ist bewusst so aufgebaut, dass folgende Funktionen später ohne größeren Umbau ergänzt werden können:

- **Authentifizierung (JWT/OAuth):** `backend/middleware/auth.js` enthält bereits eine Platzhalter-Middleware (`requireAuth`), die aktuell durchreicht. Der Frontend-`api.js`-Client hat einen auskommentierten Interceptor für Bearer-Token.
- **PDF-Upload / Dokumentenverwaltung:** Das Datenmodell `Document` (1:n zu `Contract`) existiert bereits vollständig inkl. Service- und Controller-Layer. `backend/middleware/upload.js` enthält eine fertige Multer-Konfiguration, die nur noch als Middleware in die Route eingehängt werden muss.
- **Filter (Kategorie, Preis, Laufzeit, Status):** Der Service `contractService.getAllContracts()` akzeptiert bereits einen `filters`-Parameter (Status, Kategorie, Suche) – kann leicht um Preis-/Laufzeit-Filter erweitert werden.
- **Erinnerungen an Kündigungsfristen / E-Mail-Benachrichtigungen:** Das Feld `cancellationDays` ist bereits im Datenmodell vorhanden; ein Cronjob-Service kann leicht als weiterer Service ergänzt werden.
- **Benutzerverwaltung:** Ein `User`-Modell ist im Prisma-Schema als Kommentar vorbereitet.
- **PostgreSQL:** siehe oben.

---

## Funktionsübersicht

- **Dashboard** mit drei Info-Karten (monatliche Kosten aktiver Verträge, Anzahl aktiver Verträge, Platzhalter)
- **Vertragstabelle** mit Suche, Status-Chips und "Mehr"-Menü (Bearbeiten/Löschen)
- **"+"-Button** öffnet Dialog zum Anlegen neuer Verträge
- **Vollständiges CRUD** für Verträge (erstellen, anzeigen, bearbeiten, löschen)
- **Responsive Design** (Sidebar wird auf mobilen Geräten zum ausklappbaren Menü)
>>>>>>> dd1704f ('base')
