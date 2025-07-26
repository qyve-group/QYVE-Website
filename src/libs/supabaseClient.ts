import { createClient } from '@supabase/supabase-js';

// Load environment variables (replace with your actual values)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create and export a single Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!, // note: NOT the anon key
// );
