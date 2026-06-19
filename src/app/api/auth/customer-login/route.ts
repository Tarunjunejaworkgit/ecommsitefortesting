import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSessionToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const name = email.split('@')[0];
    let customerId = `cust-mock-${Date.now()}`;
    let customerName = name.charAt(0).toUpperCase() + name.slice(1);

    try {
      // Find or create customer record in DB
      const existing = await prisma.customer.findUnique({
        where: { email }
      });

      if (existing) {
        customerId = existing.id;
        customerName = existing.firstName 
          ? `${existing.firstName} ${existing.lastName || ''}`.trim() 
          : customerName;
      } else {
        const newCustomer = await prisma.customer.create({
          data: {
            email,
            firstName: customerName,
            lastName: '',
          }
        });
        customerId = newCustomer.id;
      }
    } catch (dbErr) {
      console.warn('Database offline, proceeding with simulated customer registry:', dbErr);
    }

    // Create session token
    const token = createSessionToken({
      id: customerId,
      email,
      name: customerName,
    } as any);

    // Set secure HTTP-only customer session cookie
    const cookieStore = await cookies();
    cookieStore.set('mokshay_customer_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return NextResponse.json({ success: true, redirect: '/profile' });
  } catch (err: any) {
    console.error('Customer login API error:', err);
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
