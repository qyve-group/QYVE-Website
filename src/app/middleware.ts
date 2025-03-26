// Since Server Components can't write cookies, you need middleware to refresh expired Auth tokens and store them.

// The middleware is responsible for:

// Refreshing the Auth token (by calling supabase.auth.getUser).
// Passing the refreshed Auth token to Server Components, so they don't attempt to refresh the same token themselves. This is accomplished with request.cookies.set.
// Passing the refreshed Auth token to the browser, so it replaces the old token. This is accomplished with response.cookies.set.


import { type NextRequest } from 'next/server'
import { updateSession } from '@/libs/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}