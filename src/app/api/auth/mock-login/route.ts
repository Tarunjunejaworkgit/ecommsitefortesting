import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSessionToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Default development credential
    if (password !== 'admin123' && password !== 'mokshay2026') {
      return NextResponse.json({ error: 'Incorrect credentials' }, { status: 401 });
    }

    const email = 'developer-admin@mokshay.com';
    const name = 'Mokshay Dev';

    // Sign session token
    const token = createSessionToken({
      email,
      name,
      role: 'Admin',
      isMock: true,
    });

    // Log admin login activity in the database
    try {
      await prisma.adminActivityLog.create({
        data: {
          adminUserEmail: email,
          action: 'LOGIN_MOCK',
          details: 'Authenticated via Local Developer bypass credential',
          ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      });
    } catch (dbErr) {
      console.error('Failed to log admin bypass login activity:', dbErr);
    }

    // Set secure cookie (awaiting cookies() in Next.js 16)
    const cookieStore = await cookies();
    cookieStore.set('mokshay_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return NextResponse.json({ success: true, redirect: '/admin/dashboard' });
  } catch (err: any) {
    console.error('Mock login API error:', err);
    return NextResponse.json({ error: err.message || 'Authentication failed' }, { status: 500 });
  }
}
