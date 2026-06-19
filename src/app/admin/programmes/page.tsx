import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminProgrammesClient from '@/components/AdminProgrammesClient';

export default async function AdminProgrammesPage() {
  let programmes: any[] = [];

  try {
    programmes = await prisma.programme.findMany({
      include: {
        registrations: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { startDate: 'asc' },
    });
  } catch (err) {
    console.warn('Database offline, returning empty programmes lists for admin dashboard');
  }

  // Cast dates cleanly
  const castedProgrammes = programmes.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    content: p.content,
    featuredImage: p.featuredImage || null,
    startDate: new Date(p.startDate),
    endDate: p.endDate ? new Date(p.endDate) : null,
    location: p.location,
    status: p.status,
    maxRegistrations: p.maxRegistrations || null,
    price: p.price,
    registrations: p.registrations.map((reg: any) => ({
      id: reg.id,
      firstName: reg.firstName,
      lastName: reg.lastName,
      email: reg.email,
      phone: reg.phone,
      status: reg.status,
      notes: reg.notes || null,
      createdAt: new Date(reg.createdAt),
    })),
  }));

  return <AdminProgrammesClient programmes={castedProgrammes} />;
}
