import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isOnDashboard = pathname.startsWith('/dashboard')
  const isOnAuth = pathname.startsWith('/auth')
  const isOnAdmin = pathname.startsWith('/admin')

  // Check for session cookie - NextAuth uses these cookies
  const hasSession = request.cookies.has('next-auth.session-token') ||
    request.cookies.has('__Secure-next-auth.session-token') ||
    request.cookies.has('next-auth.csrf-token')

  // Redirect authenticated users away from auth pages
  if (isOnAuth && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users to sign-in
  if (isOnDashboard && !hasSession) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Protect admin routes
  if (isOnAdmin) {
    // First check if user has a session
    if (!hasSession) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Verify admin role via API call
    // Pass cookies to the API for session verification
    try {
      const verifyUrl = new URL('/api/admin/verify', request.url)
      const response = await fetch(verifyUrl, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      })

      if (!response.ok) {
        // API error or unauthorized - redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      const data = await response.json()

      if (!data.isAdmin) {
        // User is not an admin - redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      // On error, redirect to dashboard for safety
      console.error('Admin verification failed:', error)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
