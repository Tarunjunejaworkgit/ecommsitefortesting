import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminOrdersClient from '@/components/AdminOrdersClient';

export default async function AdminOrdersPage() {
  let orders: any[] = [];

  try {
    orders = await prisma.order.findMany({
      include: {
        shippingAddress: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.warn('Database offline, returning empty orders list for admin dashboard');
  }

  // Cast types cleanly
  const castedOrders = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    guestEmail: o.guestEmail || null,
    status: o.status,
    totalAmount: o.totalAmount,
    taxAmount: o.taxAmount,
    shippingAmount: o.shippingAmount,
    discountAmount: o.discountAmount,
    couponCode: o.couponCode || null,
    notes: o.notes || null,
    trackingNumber: o.trackingNumber || null,
    carrier: o.carrier || null,
    createdAt: new Date(o.createdAt),
    shippingAddress: {
      firstName: o.shippingAddress.firstName,
      lastName: o.shippingAddress.lastName,
      email: o.shippingAddress.email,
      phone: o.shippingAddress.phone,
      addressLine1: o.shippingAddress.addressLine1,
      addressLine2: o.shippingAddress.addressLine2 || null,
      city: o.shippingAddress.city,
      state: o.shippingAddress.state,
      postalCode: o.shippingAddress.postalCode,
      country: o.shippingAddress.country,
    },
    items: o.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      sku: item.sku || null,
    })),
  }));

  return <AdminOrdersClient orders={castedOrders} />;
}
