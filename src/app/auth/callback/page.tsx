// pages/auth/callback.tsx or app/auth/callback/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/libs/supabaseClient';
// import Loading from '@/app/loading';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { error } = await supabase.auth.getSession(); // Will trigger if exchange is complete
      if (!error) {
        router.push('/home'); // or your home page
      } else {
        // console.error(error);
        throw new Error('Error');
      }
    };

    handleAuth();
  }, [router]);

  // return (
  //   <>
  //     <p>Signing you in...</p>
  //     {/* <Loading /> */}
  //   </>
  // );
}

// import { NextResponse } from 'next/server';

// import { createClient } from '@/libs/supabaseServer';

// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get('code');
//   const next = searchParams.get('next') ?? '/';

//   if (code) {
//     const supabase = await createClient();
//     const { error } = await supabase.auth.exchangeCodeForSession(code);
//     if (!error) {
//       const forwardedHost = request.headers.get('x-forwarded-host');
//       const isLocalEnv = process.env.NODE_ENV === 'development';
//       if (isLocalEnv) {
//         return NextResponse.redirect(`${origin}${next}`);
//       }
//       if (forwardedHost) {
//         return NextResponse.redirect(`https://${forwardedHost}${next}`);
//       }
//       return NextResponse.redirect(`${origin}${next}`);
//     }
//   }

//   return NextResponse.redirect(`${origin}/auth/auth-code-error`);
// }
