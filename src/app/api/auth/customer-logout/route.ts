import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPublicUrl } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('mokshay_customer_session');
    return NextResponse.redirect(getPublicUrl('/', request));
  } catch (err) {
    console.error('Customer logout error:', err);
    return NextResponse.redirect(getPublicUrl('/', request));
  }
}
