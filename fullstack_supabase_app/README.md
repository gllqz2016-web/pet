# Stray Stories Fullstack App

React + Vite frontend with an Express API and Supabase-backed data storage.

## Features

- Phone/email demo registration and login
- Pet discovery, pet detail pages, favorites, and adoption applications
- Message center with notification data
- Event list, event details, and event registration
- Lost/sighting reports, report detail pages, and map-linked nearby reports
- Supabase SQL migrations for all app tables

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from `.env.example` and fill in backend-only Supabase values:

   ```bash
   cp .env.example .env
   ```

3. In Supabase SQL Editor, run:

   - `supabase/schema.sql` for a fresh database, or
   - `supabase/20260511_notifications.sql` and `supabase/20260511_interactions.sql` if the base schema already exists.

4. Run the fullstack server:

   ```bash
   npm start
   ```

5. Open:

   ```text
   http://localhost:8787/
   ```

For Vite-only frontend development, run `npm run dev:client` and `npm run dev:server` in separate terminals.

## Validation

```bash
npm run lint
npm run build
```

## Security Notes

Do not commit `.env`. Supabase service keys are used only by the Express backend; frontend code calls `/api/*` routes and never receives the service key.
