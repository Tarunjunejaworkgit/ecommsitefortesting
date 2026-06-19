import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  
  // Protect all /admin routes except /admin/login
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('mokshay_admin_session')?.value;
    
    if (!sessionCookie) {
      const proto = request.headers.get('x-forwarded-proto') || 'https';
      const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
      const realProto = proto.includes(',') ? proto.split(',').pop()?.trim() || 'https' : proto;
      
      const redirectUrl = new URL('/admin/login', `${realProto}://${host}`);
      if (request.nextUrl.pathname !== '/admin') {
        redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      }
      
      return NextResponse.redirect(redirectUrl, {
        headers: requestHeaders
      });
    }
  }
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
