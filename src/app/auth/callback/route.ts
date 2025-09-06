import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabaseServer'; // your Supabase helper

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') ?? '/home';

  console.log('Auth callback - Code:', code ? 'present' : 'missing');
  console.log('Auth callback - Redirect:', redirect);

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.session) {
        console.log('Auth callback - Session created successfully');
        
        // Use origin for Replit environment
        const redirectUrl = `${origin}${redirect}`;
        console.log('Auth callback - Redirecting to:', redirectUrl);
        
        return NextResponse.redirect(redirectUrl);
      } else {
        console.error('Auth callback - Session exchange error:', error);
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
      }
    } catch (error) {
      console.error('Auth callback - Unexpected error:', error);
      return NextResponse.redirect(`${origin}/login?error=unexpected`);
    }
  }

  console.log('Auth callback - No code provided');
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
