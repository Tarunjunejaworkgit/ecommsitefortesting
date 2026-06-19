import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminDealsClient from '@/components/AdminDealsClient';
import { mockDeals } from '@/lib/mockData';

export default async function AdminDealsPage() {
  let deals: any[] = [];

  try {
    deals = await prisma.deal.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.warn('Database offline, returning mock deals for admin dashboard');
    deals = mockDeals.map((d) => ({
      ...d,
      startDate: new Date(d.startDate),
      endDate: new Date(d.endDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  return <AdminDealsClient deals={deals} />;
}
