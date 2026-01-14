import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req: NextRequest) => {
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role
  const pathname = req.nextUrl.pathname

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    // Allow access to /admin/auth (login page)
    if (pathname.startsWith('/admin/auth')) {
      if (isLoggedIn && userRole === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl))
      }
      return null
    }

    // All other admin routes require authentication and ADMIN role
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/auth/signin', req.nextUrl))
    }
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
    return null
  }

  // User dashboard routes protection
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/auth/callback')) {
    // Allow unauthenticated users to access auth pages
    if (pathname.startsWith('/auth/')) {
      return null
    }

    // Redirect logged-in admins to admin dashboard
    if (isLoggedIn && userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl))
    }

    // Require authentication for dashboard
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/signin', req.nextUrl))
    }
    return null
  }

  // Redirect root based on role
  if (pathname === '/' && isLoggedIn) {
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl))
    }
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return null
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
    '/',
  ],
}
