import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/?error=unauthorized', req.nextUrl))
  }
})

export const config = {
  matcher: ['/dashboard/:path*'],
}
