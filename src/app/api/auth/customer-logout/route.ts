import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('mokshay_customer_session');
    return NextResponse.redirect(new URL('/', request.url));
  } catch (err) {
    console.error('Customer logout error:', err);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
