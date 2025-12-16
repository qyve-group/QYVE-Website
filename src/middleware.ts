import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

async function checkAdminAuth(request: NextRequest): Promise<{ authorized: boolean; response?: NextResponse }> {
  let supabaseResponse = NextResponse.next({ request });
  
  try {
    const allCookies = request.cookies.getAll();
    console.log('Middleware - cookies:', allCookies.map(c => c.name));
    console.log('Middleware - ADMIN_EMAILS:', ADMIN_EMAILS);
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return allCookies;
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );
    
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('Middleware - user:', user?.email, 'error:', error?.message);
    
    if (!user) {
      return { authorized: false };
    }
    
    const userEmail = user.email?.toLowerCase() || '';
    if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(userEmail)) {
      console.log('Middleware - email not in admin list:', userEmail);
      return { authorized: false };
    }
    
    return { authorized: true, response: supabaseResponse };
  } catch (error) {
    console.error('Admin auth check error:', error);
    return { authorized: false };
  }
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  
  const isAdminSubdomain = hostname.startsWith('admin.');
  
  if (pathname.startsWith('/api/admin')) {
    let supabaseResponse = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );
    await supabase.auth.getUser();
    return supabaseResponse;
  }

  if (isAdminSubdomain) {
    if (pathname.startsWith('/api/webhook')) {
      return NextResponse.next();
    }
    
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/admin')) {
      const authResult = await checkAdminAuth(request);
      if (!authResult.authorized) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = `/api/admin${pathname.replace('/api', '')}`;
      return NextResponse.rewrite(url);
    }
    
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/login') && !pathname.startsWith('/auth') && !pathname.startsWith('/api')) {
      const authResult = await checkAdminAuth(request);
      if (!authResult.authorized) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
      const url = request.nextUrl.clone();
      url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
    
    if (pathname.startsWith('/admin')) {
      const authResult = await checkAdminAuth(request);
      if (!authResult.authorized) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
      return authResult.response || NextResponse.next();
    }
  }
  
  return NextResponse.next();
}
