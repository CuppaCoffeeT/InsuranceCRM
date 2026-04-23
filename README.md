# InsuranceCRM

Vite + React + Bootstrap CRM backed by Supabase (auth + Postgres).

## Setup

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
VITE_SUPABASE_URL=https://uivdgousiyfeyrebloaz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable key from Supabase dashboard, starts with sb_publishable_>
```

The publishable key is the current standard (the `anon` JWT is the legacy name for the same
thing — both work, but prefer publishable). **Never** put the secret key (`sb_secret_...`) in
the browser — it bypasses RLS.

Both vars must also be set in **Vercel → Project → Settings → Environment Variables**
for production and preview environments. Redeploy after setting them.

### 2. Database

Open Supabase → SQL Editor and run the full contents of [`supabase/schema.sql`](supabase/schema.sql).
It creates 5 tables (`clients`, `policies`, `projected_cash_values`, `interactions`,
`bank_balance_history`) with row-level security scoped to `auth.uid()`.

### 3. Supabase auth settings

In Supabase → **Authentication → URL Configuration**:

- **Site URL**: `https://<your-vercel-domain>` (e.g. `https://project-wk9er.vercel.app`)
- **Additional Redirect URLs**: add the same origin + `/update-password` and `/signin`
- For local dev, also add `http://localhost:5173` and `http://localhost:5173/update-password`

### 4. Run locally

```
npm install
npm run dev
```

### 5. Deploy

Pushing to `main` on GitHub auto-triggers a Vercel deploy (connected via the dashboard).

## Auth flow

- `/signin` — email + password
- `/signup` — creates an account; confirmation email sent
- `/reset-password` — request password reset link
- `/update-password` — target of the recovery email; sets a new password
- `/` — CRM (gated, redirects to `/signin` when signed out)

## Project layout

```
src/
  lib/supabase.js         # createClient, uses VITE_SUPABASE_* envs
  context/AuthContext.jsx # session + signOut
  pages/auth/             # SignIn, SignUp, ResetPassword, UpdatePassword
  hooks/useClients.js     # Supabase-backed CRUD, maps snake_case ↔ camelCase
  components/             # Dashboard, Clients, modals, report sections
  utils/finance.js        # CPF projection, retirement sums, summary math
supabase/schema.sql       # tables + RLS policies (run once in SQL editor)
```
