import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminSession, getPublicUrl } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    
    if (session) {
      // Log logout activity in the database
      try {
        await prisma.adminActivityLog.create({
          data: {
            adminUserEmail: session.email,
            action: 'LOGOUT',
            details: 'Successfully logged out',
            ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
          },
        });
      } catch (dbErr) {
        console.error('Failed to log admin logout activity:', dbErr);
      }
    }

    const cookieStore = await cookies();
    cookieStore.delete('mokshay_admin_session');

    return NextResponse.redirect(getPublicUrl('/admin/login', request));
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.redirect(getPublicUrl('/admin/login', request));
  }
}
