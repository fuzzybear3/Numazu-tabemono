# Numazu Tabemono

A restaurant leaderboard and map for Numazu, Japan. Two admins add restaurants and manage rankings via a protected `/admin` area. The public gets a read-only leaderboard and interactive map.

**Live site:** https://numazu.stevenguido.com

---

## Stack

- **Next.js 16** — App Router, TypeScript, Tailwind CSS
- **Supabase** — Postgres database, Auth, Storage
- **shadcn/ui** — UI components
- **Leaflet + OpenStreetMap** — Free map, no API key needed
- **Nominatim** — Free restaurant search (OpenStreetMap geocoding)
- **@dnd-kit** — Drag-to-reorder rankings
- **Vercel** — Hosting

## Features

- Public leaderboard ranked by admin-defined order
- Interactive map with numbered pins for each restaurant
- Restaurant detail pages with visit photo gallery
- Admin dashboard: add restaurants, log visits, drag-to-reorder rankings
- GPS-based restaurant entry for places not yet in Nominatim
- "Also add to OpenStreetMap" link when adding via GPS

---

## Local development

### 1. Clone the repo

```bash
git clone git@github.com:fuzzybear3/Numazu-tabemono.git
cd Numazu-tabemono
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get your Supabase keys from: **Supabase dashboard → Project Settings → API**

### 4. Run the database migration

In the Supabase SQL editor, run the contents of:

```
supabase/migrations/0001_initial_schema.sql
```

This creates the `restaurants`, `visits`, and `rankings` tables with RLS policies.

### 5. Create the storage bucket

In Supabase dashboard → Storage → New bucket:
- Name: `food-photos`
- Public: yes

Then add policies (or run the commented SQL at the bottom of the migration file).

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Admin access

Admin accounts are created manually in the Supabase dashboard:

**Authentication → Users → Add user**

Any Supabase user can log in at `/admin/login` and has full admin access.

---

## Deployment

Deployed to Vercel. Any push to `main` triggers an automatic redeploy.

Environment variables are set in the Vercel dashboard under **Project Settings → Environment Variables**.
