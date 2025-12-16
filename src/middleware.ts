import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  
  const isAdminSubdomain = hostname.startsWith('admin.');
  
  if (isAdminSubdomain) {
    if (pathname.startsWith('/api/webhook')) {
      return NextResponse.next();
    }
    
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/admin')) {
      const url = request.nextUrl.clone();
      url.pathname = `/api/admin${pathname.replace('/api', '')}`;
      return NextResponse.rewrite(url);
    }
    
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/login') && !pathname.startsWith('/auth') && !pathname.startsWith('/api')) {
      const url = request.nextUrl.clone();
      url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
    
    if (pathname.startsWith('/admin')) {
      let supabaseResponse = NextResponse.next({ request });
      
      try {
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
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          const url = request.nextUrl.clone();
          url.pathname = '/login';
          url.searchParams.set('redirect', pathname);
          return NextResponse.redirect(url);
        }
        
        const userEmail = user.email?.toLowerCase() || '';
        if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(userEmail)) {
          return new NextResponse('Forbidden - Admin access required', { status: 403 });
        }
        
        return supabaseResponse;
      } catch (error) {
        console.error('Admin middleware error:', error);
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
    }
  }
  
  return NextResponse.next();
}
