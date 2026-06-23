import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — keeps the auth token alive across navigations.
  // IMPORTANT: do not remove this; without it, server components won't
  // receive an authenticated session even if the user is logged in.
  const { data: { user } } = await supabase.auth.getUser()

  // Protect app routes — redirect unauthenticated users to /auth
  const isAppRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/scans') ||
    request.nextUrl.pathname.startsWith('/vulnerabilities') ||
    request.nextUrl.pathname.startsWith('/reports') ||
    request.nextUrl.pathname.startsWith('/targets') ||
    request.nextUrl.pathname.startsWith('/tickets') ||
    request.nextUrl.pathname.startsWith('/account') ||
    request.nextUrl.pathname.startsWith('/settings') ||
    request.nextUrl.pathname.startsWith('/notifications')

  if (isAppRoute && !user) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Redirect /login to /auth for consistency
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Redirect logged-in users away from /auth and /register
  const isAuthRoute = request.nextUrl.pathname === '/auth' ||
    request.nextUrl.pathname === '/register'

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files, images, and Next.js internals.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
