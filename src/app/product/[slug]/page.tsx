import React from 'react';
import { notFound } from 'next/navigation';
import StorefrontLayout from '@/components/StorefrontLayout';
import { getProductBySlug, getProducts } from '@/lib/services';
import ProductDetailClient from '@/components/ProductDetailClient';

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  // Next.js 16: Must await the params promise!
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current product)
  const allCategoryProducts = await getProducts(product.categoryId);
  const relatedProducts = allCategoryProducts.filter((p) => p.id !== product.id);

  // Cast product properties to conform strictly to what client expects
  const castedProduct = {
    ...product,
    variants: (product.variants || []).map(v => ({
      ...v,
      sku: v.sku || null
    })),
    images: (product.images || []).map(img => ({
      ...img,
      altText: img.altText || null
    })),
    sku: product.sku || null,
    sizeInfo: product.sizeInfo || null,
    returnInfo: product.returnInfo || null,
    shippingInfo: product.shippingInfo || null,
    specifications: product.specifications || null,
    category: product.category ? {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    } : undefined
  };

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <ProductDetailClient 
          product={castedProduct} 
          relatedProducts={relatedProducts} 
        />
      </div>
    </StorefrontLayout>
  );
}
