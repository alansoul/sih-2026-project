// apps/web/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If Clerk appends the handshake query that crashes Vercel Edge, strip it cleanly
  if (request.nextUrl.searchParams.has('__clerk_handshake')) {
    const cleanUrl = new URL(request.nextUrl.pathname, request.url);
    return NextResponse.redirect(cleanUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all page routes, skip static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};