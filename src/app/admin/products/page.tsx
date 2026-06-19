import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminProductsClient from '@/components/AdminProductsClient';

export default async function AdminProductsPage() {
  let products: any[] = [];
  let categories: any[] = [];

  try {
    [products, categories] = await Promise.all([
      prisma.product.findMany({
        include: {
          images: { orderBy: { order: 'asc' } },
          variants: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' },
      }),
    ]);
  } catch (err) {
    console.warn('Database offline, returning empty products lists for admin dashboard');
  }

  // Cast products properties to satisfy TypeScript typing
  const castedProducts = products.map((prod) => ({
    ...prod,
    variants: (prod.variants || []).map((v: any) => ({
      ...v,
      sku: v.sku || null
    })),
    images: (prod.images || []).map((img: any) => ({
      ...img,
      altText: img.altText || null
    })),
    sku: prod.sku || null,
    sizeInfo: prod.sizeInfo || null,
    returnInfo: prod.returnInfo || null,
    shippingInfo: prod.shippingInfo || null,
    specifications: prod.specifications || null,
  }));

  const castedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  return (
    <AdminProductsClient
      products={castedProducts}
      categories={castedCategories}
    />
  );
}
