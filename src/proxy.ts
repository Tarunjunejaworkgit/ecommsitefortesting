import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', url.pathname);
  
  // Protect all /admin routes except /admin/login
  if (url.pathname.startsWith('/admin') && !url.pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('mokshay_admin_session')?.value;
    
    if (!sessionCookie) {
      url.pathname = '/admin/login';
      // Pass the original URL as a redirect query parameter if they were attempting to access a specific page
      if (request.nextUrl.pathname !== '/admin') {
        url.searchParams.set('redirect', request.nextUrl.pathname);
      }
      return NextResponse.redirect(url, {
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
