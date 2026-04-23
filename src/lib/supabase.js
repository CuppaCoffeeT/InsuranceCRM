import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && publishableKey);

if (!supabaseConfigured) {
  // eslint-disable-next-line no-console
  console.error(
    '[supabase] Missing env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel (and redeploy) or in .env.local for local dev.',
  );
}

// Build a client even when env is missing so imports don't crash the whole app
// at module load. Calls will just fail with network errors, and the UI surfaces
// the missing-config banner.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  publishableKey || 'placeholder-key',
  {
    auth: {
      persistSession: supabaseConfigured,
      autoRefreshToken: supabaseConfigured,
      detectSessionInUrl: supabaseConfigured,
    },
  },
);
