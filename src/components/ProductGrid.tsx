'use client';

import React from 'react';
import { useCart } from '@/lib/cartContext';
import Link from 'next/link';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';

interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  sku: string | null;
  stock: number;
}

interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  isFeatured: boolean;
  order: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  status: string;
  sku: string | null;
  sizeInfo: string | null;
  rating: number;
  categoryId: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

interface ProductGridProps {
  products: Product[];
  showOnlyWishlist?: boolean;
}

export default function ProductGrid({ products, showOnlyWishlist = false }: ProductGridProps) {
  const { wishlist, toggleWishlist, isInWishlist, addToCart } = useCart();

  // Filter products by local wishlist if requested
  const displayProducts = showOnlyWishlist
    ? products.filter((p) => wishlist.includes(p.id))
    : products;

  if (displayProducts.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 bg-stone-50 border border-dashed border-stone-200 rounded">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-serif text-stone-900 font-medium">No elements found</h3>
          <p className="text-stone-500 text-sm mt-1 max-w-md mx-auto">
            {showOnlyWishlist
              ? 'Your wishlist is currently empty. Visit the catalog to add items to your curation.'
              : 'Try clearing your filters or adjusting your search queries.'}
          </p>
        </div>
        {showOnlyWishlist && (
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-primary text-white text-xs uppercase tracking-wider font-medium hover:bg-stone-800 transition rounded"
          >
            Browse Products
          </Link>
        )}
      </div>
    );
  }

  const handleQuickAdd = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault();
    // Default to the first variant if available, otherwise add base product
    const variant = prod.variants && prod.variants.length > 0 ? prod.variants[0] : undefined;
    const imageUrl = prod.images && prod.images.length > 0 ? prod.images[0].url : undefined;
    
    addToCart({
      productId: prod.id,
      variantId: variant?.id,
      name: prod.name,
      price: variant ? variant.price : prod.price,
      quantity: 1,
      imageUrl,
      sizeName: variant?.name,
      sku: variant?.sku || prod.sku || undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {displayProducts.map((prod) => {
        const featuredImage = prod.images?.find((img) => img.isFeatured)?.url || prod.images?.[0]?.url;
        const hasDiscount = prod.compareAtPrice && prod.compareAtPrice > prod.price;
        const favorited = isInWishlist(prod.id);

        return (
          <div
            key={prod.id}
            className="group bg-white border border-stone-200 p-4 rounded flex flex-col justify-between h-full relative hover:shadow-md transition duration-300"
          >
            {/* Wishlist Button Overlay */}
            <button
              onClick={() => toggleWishlist(prod.id)}
              className="absolute top-6 right-6 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm text-stone-500 hover:text-red-500 transition"
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
            </button>

            {/* Product Image Link */}
            <Link href={`/product/${prod.slug}`} className="block relative aspect-square bg-stone-50 overflow-hidden rounded mb-4">
              {featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredImage}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  No Image
                </div>
              )}
              {hasDiscount && (
                <div className="absolute top-2 left-2 bg-accent text-white px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded">
                  Offer
                </div>
              )}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-350 flex items-center justify-center">
                <span className="bg-white/90 text-stone-900 px-4 py-2 text-xs tracking-wider uppercase font-medium shadow flex items-center gap-1.5 rounded">
                  <Eye className="w-4 h-4" /> View Element
                </span>
              </div>
            </Link>

            {/* Detail details */}
            <div className="space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-stone-950 font-normal text-base md:text-lg line-clamp-2 leading-snug hover:text-primary transition">
                  <Link href={`/product/${prod.slug}`}>
                    {prod.name}
                  </Link>
                </h3>
                <div className="flex items-center gap-1 text-[#C9A054] pt-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs text-stone-600 font-mono mt-0.5">{prod.rating}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-stone-950 font-semibold text-base">₹{prod.price.toLocaleString('en-IN')}</span>
                  {hasDiscount && (
                    <span className="text-stone-400 line-through text-xs font-light">₹{prod.compareAtPrice?.toLocaleString('en-IN')}</span>
                  )}
                </div>
                {prod.variants && prod.variants.length > 1 && (
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                    {prod.variants.length} Sizes Available
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-5 flex gap-2">
              <button
                onClick={(e) => handleQuickAdd(e, prod)}
                className="flex-1 py-2.5 bg-primary text-white text-xs tracking-wider uppercase font-medium hover:bg-stone-850 transition rounded flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
