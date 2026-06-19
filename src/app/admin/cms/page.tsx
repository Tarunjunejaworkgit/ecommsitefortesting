import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminCMSClient from '@/components/AdminCMSClient';

export default async function AdminCMSPage() {
  let cmsPages: any[] = [];

  try {
    cmsPages = await prisma.cMSPage.findMany();
  } catch (err) {
    console.warn('Database offline, falling back to local client CMS defaults.');
  }

  // Map to safe client structure
  const formattedPages = cmsPages.map((p) => ({
    key: p.key,
    title: p.title,
    content: p.content,
  }));

  return <AdminCMSClient initialPages={formattedPages} />;
}
