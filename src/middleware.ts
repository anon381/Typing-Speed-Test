import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/favicon') ||
    pathname === '/auth'
  ) {
    return NextResponse.next();
  }
  const token = req.cookies.get('token')?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) return NextResponse.next();
  try { jwt.verify(token, secret); } catch {
    const url = req.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!api/public).*)'] };
