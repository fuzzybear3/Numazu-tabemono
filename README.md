# Numazu Tabemono

**Live site:** https://tabemono.stevenguido.com

---

## Stack

- **Next.js 16** — App Router, TypeScript, Tailwind CSS
- **Supabase** — Postgres database, Auth, Storage
- **shadcn/ui** — UI components
- **Leaflet + OpenStreetMap** — Map and geocoding, no API key needed
- **Nominatim** — Restaurant search
- **@dnd-kit** — Drag-to-reorder rankings
- **Vercel** — Hosting

---

## Local development

### 1. Clone and install

```bash
git clone git@github.com:fuzzybear3/Numazu-tabemono.git
cd Numazu-tabemono
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Keys are in the Supabase dashboard under **Project Settings → API**.

### 3. Database setup

Run `supabase/migrations/0001_initial_schema.sql` in the Supabase SQL editor. This creates the tables and RLS policies.

### 4. Storage bucket

In Supabase dashboard → Storage → New bucket:
- Name: `food-photos`
- Public: yes

Add storage policies from the commented SQL at the bottom of the migration file.

### 5. Run

```bash
npm run dev
```

---

## Admin access

Create admin accounts in Supabase dashboard → **Authentication → Users → Add user**.

Any Supabase user can log in at `/admin/login`.

---

## Deployment

Pushes to `main` deploy automatically via Vercel.

Set environment variables in Vercel under **Project Settings → Environment Variables**. After adding or changing vars, trigger a redeploy.
