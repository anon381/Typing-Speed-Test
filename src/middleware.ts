import { NextResponse, NextRequest } from 'next/server';

// Simplified: only push authenticated users away from /auth; no gating elsewhere.
export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const token = req.cookies.get('token')?.value;
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  if (pathname === '/auth' && token) {
    const target = searchParams.get('next') || '/';
    if (target !== '/auth') {
      const url = req.nextUrl.clone();
      url.pathname = target;
      url.search = '';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!api/public).*)'] };
