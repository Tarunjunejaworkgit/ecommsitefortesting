import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminMediaClient from '@/components/AdminMediaClient';

export default async function AdminMediaPage() {
  let assets: any[] = [];

  try {
    assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.warn('Database offline, media asset list will use pre-seeded local image catalogs in the browser.');
  }

  // Format to standard Client properties
  const formattedAssets = assets.map((asset) => ({
    id: asset.id,
    filename: asset.filename,
    url: asset.url,
    sizeBytes: asset.sizeBytes,
    mimeType: asset.mimeType,
    createdAt: asset.createdAt,
  }));

  return <AdminMediaClient initialAssets={formattedAssets} />;
}
