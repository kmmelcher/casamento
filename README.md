# Wedding Gift List

A Next.js frontend for a wedding gift list. Guests can view gifts on cards and reserve one by entering their name (and optional message). Reservations are persisted so each gift can only be reserved once.

## Tech stack

- **Next.js 16** (App Router) with TypeScript and Tailwind CSS
- **Neon (serverless Postgres)** for storing reservations — use Vercel’s Postgres/Neon integration when deploying on Vercel

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

3. **Optional — persistence:** To test reserving gifts locally, add a Postgres database and set `POSTGRES_URL` in a `.env.local` file (see below). Without it, the app still runs: gifts are shown and the list is editable in code, but reservations are not saved.

## Environment variables

| Variable        | Description |
|----------------|-------------|
| `POSTGRES_URL` | Postgres connection string (from Vercel Postgres/Neon). Required for saving reservations. |

Example `.env.local`:

```
POSTGRES_URL=postgresql://user:password@host/database?sslmode=require
```

## Editing the gift list

Gifts are stored in **`data/gifts.json`**. Each item has:

- `id` — unique string (e.g. `"gift-1"`)
- `title` — short title
- `description` — description text
- `imageUrl` — optional image URL (e.g. Unsplash)

Edit the JSON file and redeploy (or restart the dev server) to change the list.

## Deploying on Vercel

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).

2. Add a database:
   - In the Vercel project, go to **Storage** and create a **Postgres** database (Vercel uses Neon).
   - Vercel will inject many environment variables, but the app only needs **`POSTGRES_URL`**. If the integration doesn't set that exact name, add it manually under **Settings → Environment Variables**:

     | Variable | Value |
     |----------|-------|
     | `POSTGRES_URL` | The **pooled** Postgres connection string from Neon (the one ending in `?sslmode=require`) |

3. Create the reservations table (once per database):
   - Open the database in the Vercel dashboard and run the SQL from **`scripts/init-db.sql`**, or run it in the Neon SQL editor if you use “Open in Neon”.

4. Deploy:
   - Deployments run on push. The app will work without `POSTGRES_URL` (no reservations saved) until the database is linked and the table is created.

## Scripts

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — run ESLint
