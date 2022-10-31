import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import AuthMiddleware from './lib/middleware/auth.middleware';

export const config = {
  matcher: [
    '/daily/:path*',
    '/teams/:path*'
    // '/((?!api|static|favicon.ico).*)',
  ],
}

export function middleware(req: NextRequest) {
  return AuthMiddleware(req);
}

