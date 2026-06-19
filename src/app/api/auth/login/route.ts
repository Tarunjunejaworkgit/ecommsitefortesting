import { NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || Math.random().toString(36).substring(2, 15);
    const authUrl = getAuthUrl(state, request.url);
    
    return NextResponse.redirect(authUrl);
  } catch (err) {
    console.error('Error during authorization redirect:', err);
    return NextResponse.json({ error: 'Auth redirection failed' }, { status: 500 });
  }
}
