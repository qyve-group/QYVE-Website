import { createClient } from '@supabase/supabase-js';

// Load environment variables (replace with your actual values)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug environment variables
if (typeof window === 'undefined') {
  console.log('🔧 Supabase Environment Variables:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
}

// Create a mock client if environment variables are not set
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set, using mock client');
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
    }),
  };
} else {
  // Create and export a single Supabase client instance
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// export const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!, // note: NOT the anon key
// );
