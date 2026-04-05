import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || 'access-secret-change-me'
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (excluding login and API auth routes)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin')) {
    const accessToken = req.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    try {
      // Use jose for edge-compatible JWT verification
      await jwtVerify(accessToken, ACCESS_TOKEN_SECRET);
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware JWT Error:', error);
      // If access token is invalid/expired, redirect to login
      // (The frontend or a separate interceptor can handle the refresh logic)
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  // Protect Admin API routes (excluding login, verify-otp, refresh, logout)
  if (pathname.startsWith('/api/admin') && 
      !pathname.startsWith('/api/admin') && 
      !pathname.startsWith('/api/admin/verify-otp') &&
      !pathname.startsWith('/api/admin/refresh') &&
      !pathname.startsWith('/api/admin/logout')) {
    
    const accessToken = req.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await jwtVerify(accessToken, ACCESS_TOKEN_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
