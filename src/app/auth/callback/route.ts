import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabaseServer'; // your Supabase helper

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') ?? '/home';

  if (code) {
    const supabase = await createClient(); // make sure this works in server context
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const redirectUrl =
        forwardedHost &&
        forwardedHost.endsWith(process.env.NEXT_PUBLIC_BASE_URL!)
          ? `https://${forwardedHost}${redirect}`
          : `https://${process.env.NEXT_PUBLIC_BASE_URL}${redirect}`;

      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
