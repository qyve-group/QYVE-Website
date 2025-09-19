import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabaseServer'; // your Supabase helper

export async function GET(request: Request) {
  const { searchParams, origin, hash } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') ?? '/home';

  console.log('Auth callback - Full URL:', request.url);
  console.log('Auth callback - Code:', code ? 'present' : 'missing');
  console.log('Auth callback - Hash:', hash);
  console.log(
    'Auth callback - All search params:',
    Object.fromEntries(searchParams),
  );
  console.log('Auth callback - Redirect:', redirect);
  console.log('Auth callback - Origin:', origin);

  // Check for access_token in hash (implicit flow)
  if (hash && hash.includes('access_token')) {
    console.log(
      '⚠️ Detected implicit flow (access_token in hash) - OAuth misconfigured!',
    );
    console.log('Hash:', hash);
    return NextResponse.redirect(
      `${origin}/login?error=implicit_flow_detected`,
    );
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.session) {
        console.log('Auth callback - Session created successfully');

        // Fix: Handle both relative paths and full URLs
        let redirectUrl: string;
        if (redirect.startsWith('http://') || redirect.startsWith('https://')) {
          // If redirect is already a full URL, use it as-is
          redirectUrl = redirect;
        } else {
          // If redirect is a path, combine with origin
          redirectUrl = `${origin}${redirect.startsWith('/') ? '' : '/'}${redirect}`;
        }
        console.log('Auth callback - Redirecting to:', redirectUrl);

        return NextResponse.redirect(redirectUrl);
      }
      console.error('Auth callback - Session exchange error:', error);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    } catch (error) {
      console.error('Auth callback - Unexpected error:', error);
      return NextResponse.redirect(`${origin}/login?error=unexpected`);
    }
  }

  console.log('Auth callback - No code provided');
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
