import { createBrowserClient } from '@supabase/ssr';

// Create and export a Supabase browser client that stores session in cookies
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
