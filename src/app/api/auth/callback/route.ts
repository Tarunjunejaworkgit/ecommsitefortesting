import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { exchangeCodeForToken, createSessionToken, getPublicUrl } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const state = searchParams.get('state');
  const isCustomer = state === 'customer';
  const loginUrlPath = isCustomer ? '/login' : '/admin/login';

  if (error) {
    console.error('Microsoft Entra Auth Error:', error, errorDescription);
    return NextResponse.redirect(getPublicUrl(`${loginUrlPath}?error=${encodeURIComponent(errorDescription || error)}`, request));
  }

  if (!code) {
    return NextResponse.redirect(getPublicUrl(`${loginUrlPath}?error=no_authorization_code`, request));
  }

  try {
    const tokenData = await exchangeCodeForToken(code, request);
    
    // Decode ID Token (JWT) without verification for metadata payload
    const idToken = tokenData.id_token;
    if (!idToken) {
      throw new Error('No id_token found in token response');
    }

    const payloadBase64 = idToken.split('.')[1];
    const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const userPayload = JSON.parse(payloadJson);

    const email = userPayload.email || userPayload.preferred_username || userPayload.upn || (isCustomer ? 'customer@mokshay.com' : 'unknown-admin@mokshay.com');
    const name = userPayload.name || email.split('@')[0];

    if (isCustomer) {
      // Find or create customer record in database
      let customerId = `cust-mock-${Date.now()}`;
      try {
        const existing = await prisma.customer.findUnique({
          where: { email },
        });

        if (existing) {
          customerId = existing.id;
        } else {
          const newCustomer = await prisma.customer.create({
            data: {
              email,
              firstName: name.split(' ')[0] || 'Customer',
              lastName: name.split(' ').slice(1).join(' ') || '',
            },
          });
          customerId = newCustomer.id;
        }
      } catch (dbErr) {
        console.warn('Database offline during customer register callback, using mock customer ID');
      }

      // Create session token
      const sessionToken = createSessionToken({
        id: customerId,
        email,
        name,
      } as any);

      // Set secure HTTP-only customer session cookie
      const cookieStore = await cookies();
      cookieStore.set('mokshay_customer_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
      });

      return NextResponse.redirect(getPublicUrl('/profile', request));
    } else {
      // Admin session creation
      const sessionToken = createSessionToken({
        email,
        name,
        role: 'Admin',
      });

      // Write to DB AdminActivityLog
      try {
        await prisma.adminActivityLog.create({
          data: {
            adminUserEmail: email,
            action: 'LOGIN',
            details: 'Successfully authenticated via Microsoft Entra ID',
            ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
          },
        });
      } catch (dbErr) {
        console.error('Failed to log admin login activity:', dbErr);
      }

      // Set secure HTTP-only cookie (awaiting cookies() in Next.js 16)
      const cookieStore = await cookies();
      cookieStore.set('mokshay_admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
      });

      return NextResponse.redirect(getPublicUrl('/admin/dashboard', request));
    }
  } catch (err: any) {
    console.error('OAuth Callback exchange error:', err);
    return NextResponse.redirect(
      getPublicUrl(`${loginUrlPath}?error=token_exchange_failed&details=${encodeURIComponent(err.message || 'unknown')}`, request)
    );
  }
}
