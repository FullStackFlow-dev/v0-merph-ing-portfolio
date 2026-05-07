import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protect admin routes on the edge by requiring an auth cookie.
// Deep signature verification is handled server-side during login issuance.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/portal')) return NextResponse.next()

  const token = request.cookies.get('admin_session')?.value
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/portal'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
