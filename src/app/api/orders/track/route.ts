import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const number = searchParams.get('number');
    const email = searchParams.get('email');

    if (!number) {
      return NextResponse.json({ error: 'Order number is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: number.trim().toUpperCase() },
      include: {
        shippingAddress: true,
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Email validation if email parameter is supplied
    if (email && email.trim()) {
      const matchEmail = email.trim().toLowerCase();
      if (order.guestEmail?.toLowerCase() !== matchEmail) {
        const customer = order.customerId ? await prisma.customer.findUnique({ where: { id: order.customerId } }) : null;
        if (!customer || customer.email.toLowerCase() !== matchEmail) {
          return NextResponse.json({ error: 'Order and email mismatch' }, { status: 403 });
        }
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error('Order tracking API error:', err);
    return NextResponse.json({ error: err.message || 'Tracking failed' }, { status: 500 });
  }
}
