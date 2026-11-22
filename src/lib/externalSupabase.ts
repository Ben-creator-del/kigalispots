import { createClient } from "@supabase/supabase-js";

// External Supabase project (not Lovable Cloud). The publishable key is safe to ship to the browser;
// access is controlled by row level security on the external database.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://fcagviofpuixznfdacaq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Ck0TojyibyReJnv3M-DU9Q_TQxyY95k";

const isBrowser = typeof window !== "undefined";

export const externalSupabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // The directory is public read-only; only keep sessions in the browser.
    persistSession: isBrowser,
    autoRefreshToken: isBrowser,
  },
});
