# Wedding Gift List

A Next.js frontend for a wedding gift list. Guests sign in with Google, browse gift cards, and reserve one with a single click. Reserved gifts are marked as taken (without revealing who reserved them). Each user can view and manage their own reservations.

## Tech stack

- **Next.js 16** (App Router) with TypeScript and Tailwind CSS
- **Firebase Authentication** — Google sign-in
- **Neon (serverless Postgres)** for storing reservations — use Vercel's Postgres/Neon integration when deploying on Vercel

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up Firebase (see [Firebase setup](#firebase-setup) below).

3. Create a `.env.local` file with the required environment variables (see [Environment variables](#environment-variables)).

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

5. **Optional — persistence:** To test reserving gifts locally, add a Postgres database and set `POSTGRES_URL` in `.env.local`. Without it, the app still runs but reservations are not saved.

## Firebase setup

### 1. Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Give it a name (e.g. `my-wedding-list`) and follow the wizard. You can disable Google Analytics if you don't need it.

### 2. Enable Google sign-in

1. In the Firebase Console, go to **Authentication** (left sidebar) → **Sign-in method**.
2. Click **Google**, toggle **Enable**, fill in the project support email, and click **Save**.

### 3. Register a web app

1. In the Firebase Console, go to **Project settings** (gear icon) → **General**.
2. Under **Your apps**, click the web icon (`</>`) to add a new web app.
3. Give it a nickname (e.g. `wedding-list-web`) — you don't need Firebase Hosting.
4. After registering, you'll see a config object like this:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "my-wedding-list.firebaseapp.com",
     projectId: "my-wedding-list",
     storageBucket: "my-wedding-list.firebasestorage.app",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123",
   };
   ```

5. Copy these values into your `.env.local` as the `NEXT_PUBLIC_FIREBASE_*` variables (see below).

### 4. Generate a service account key (for the server)

1. In the Firebase Console, go to **Project settings** → **Service accounts**.
2. Click **Generate new private key** and confirm. A JSON file will download.
3. From that JSON file, copy the following fields into your `.env.local`:

   | JSON field | Environment variable |
   |---|---|
   | `project_id` | `FIREBASE_ADMIN_PROJECT_ID` |
   | `client_email` | `FIREBASE_ADMIN_CLIENT_EMAIL` |
   | `private_key` | `FIREBASE_ADMIN_PRIVATE_KEY` |

   > **Note:** The `private_key` value contains `\n` escape sequences. Paste it as-is (including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers). The app handles the newline conversion.

4. **Keep this JSON file private.** Do not commit it to version control.

### 5. Add your domain to authorized domains

1. In **Authentication** → **Settings** → **Authorized domains**, make sure your deployment domain (e.g. `my-wedding-list.vercel.app`) is listed. `localhost` is included by default.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `POSTGRES_URL` | For persistence | Postgres connection string (from Vercel Postgres / Neon) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain (e.g. `project.firebaseapp.com`) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `FIREBASE_ADMIN_PROJECT_ID` | Yes | Same as `project_id` from the service account JSON |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Yes | `client_email` from the service account JSON |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Yes | `private_key` from the service account JSON |

Example `.env.local`:

```
POSTGRES_URL=postgresql://user:password@host/database?sslmode=require

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-wedding-list.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-wedding-list
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-wedding-list.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

FIREBASE_ADMIN_PROJECT_ID=my-wedding-list
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@my-wedding-list.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...your key here...\n-----END PRIVATE KEY-----\n"
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
   - Vercel will inject many environment variables, but the app only needs **`POSTGRES_URL`**. If the integration doesn't set that exact name, add it manually under **Settings → Environment Variables**.

3. Add Firebase environment variables:
   - In **Settings → Environment Variables**, add all the `NEXT_PUBLIC_FIREBASE_*` and `FIREBASE_ADMIN_*` variables listed above.

4. Create the reservations table (once per database):
   - Open the database in the Vercel dashboard and run the SQL from **`scripts/init-db.sql`**, or run it in the Neon SQL editor.

5. Add your Vercel domain to Firebase authorized domains:
   - In the Firebase Console → **Authentication** → **Settings** → **Authorized domains**, add your `*.vercel.app` domain.

6. Deploy:
   - Deployments run on push. The app requires the Firebase variables to be set for authentication to work.

## Scripts

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — run ESLint
