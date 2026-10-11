# Asset Tracker

A Node.js web application to track company assets (laptops, phones, tools, etc.) and who is using them.

## Tech Stack
- Node.js + Express
- PostgreSQL + Sequelize ORM
- Jade (views) + Bootstrap 5 + DataTables.net

## Features
1. **Employee Master** — add/edit/view, filter active/inactive, search
2. **Asset Master** — add/edit/view, filter by category, search make/model/serial (unique asset code + serial no)
3. **Asset Category Master** — Laptop, Mobile Phone, Drill Machine, etc.
4. **Stock View** — in-stock assets, totals by branch + grand total value in footer
5. **Issue Asset** — issue an in-stock asset to an active employee
6. **Return Asset** — return with reason (upgrade / repair / resignation...)
7. **Scrap Asset** — mark obsolete; hidden everywhere except history/reports
8. **Asset History** — full timeline of every asset from purchase to scrap

---

## Setup

### 1. Install Node dependencies
```
npm install
```

### 2. Set up PostgreSQL ("eppadi enga DB vaikurathu")

You need a running PostgreSQL server. Two easy options:

**Option A — Local install (Windows)**
1. Download & install from https://www.postgresql.org/download/windows/
2. During install, set a password for the `postgres` user (remember it).
3. Open **pgAdmin** or **SQL Shell (psql)** and create the database:
   ```sql
   CREATE DATABASE asset_tracker;
   ```

**Option B — Docker (quick)**
```
docker run --name asset-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=asset_tracker -p 5432:5432 -d postgres
```

### 3. Configure connection
Copy `.env.example` to `.env` and fill in your details:
```
cp .env.example .env
```
Edit `.env`:
```
DB_NAME=asset_tracker
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
```

### 4. Create tables + sample data
```
npm run db:seed      # drops & recreates tables, inserts sample data
```
Or, to only create/update tables without sample data:
```
npm run db:sync
```

### 5. Run
```
npm start            # http://localhost:3000
# or during development:
npm run dev
```

---

## Data Model
- **Branch** — company locations (drives Stock View totals)
- **Category** — asset types
- **Employee** — belongs to a Branch, active/inactive flag
- **Asset** — unique `assetCode` + `serialNo`, belongs to Category & Branch, has a `status` (IN_STOCK → ISSUED → IN_STOCK → SCRAPPED)
- **Transaction** — immutable event log (PURCHASE / ISSUE / RETURN / SCRAP) that powers Asset History

The asset's current `status` is updated on each action, while the Transaction table keeps the full, permanent history.
