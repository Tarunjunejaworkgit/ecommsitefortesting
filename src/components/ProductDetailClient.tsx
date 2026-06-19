'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { Star, Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

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

interface Category {
  id: string;
  name: string;
  slug: string;
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
  returnInfo: string | null;
  shippingInfo: string | null;
  specifications: string | null;
  rating: number;
  categoryId: string;
  category?: Category;
  variants: ProductVariant[];
  images: ProductImage[];
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: any[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  
  const [activeImage, setActiveImage] = useState<string>(
    product.images && product.images.length > 0 ? product.images[0].url : '/placeholder.jpg'
  );
  
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');

  // Register in Recently Viewed list on mount
  useEffect(() => {
    addRecentlyViewed(product.slug);
  }, [product.slug, addRecentlyViewed]);

  const favorited = isInWishlist(product.id);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const originalPrice = product.compareAtPrice;
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice! - currentPrice) / originalPrice!) * 100) : 0;
  
  const specs = product.specifications ? JSON.parse(product.specifications) : [];

  const handleAddToCart = () => {
    const featuredImage = product.images?.find((img) => img.isFeatured)?.url || product.images?.[0]?.url;
    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      price: currentPrice,
      quantity,
      imageUrl: featuredImage,
      sizeName: selectedVariant?.name,
      sku: selectedVariant?.sku || product.sku || undefined,
    });
  };

  return (
    <div className="space-y-12">
      {/* Upper Half: Image Gallery and Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        
        {/* Left: Gallery Column */}
        <div className="space-y-4">
          <div className="aspect-square bg-stone-50 border border-stone-200 rounded overflow-hidden relative flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>
          
          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-20 h-20 bg-stone-50 border rounded overflow-hidden flex-shrink-0 transition ${
                    activeImage === img.url ? 'border-accent shadow-sm' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.altText || 'thumbnail'}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info and Purchase Options */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-accent text-xs tracking-wider uppercase font-medium">
              {product.category?.name || 'Mokshay Collection'}
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-stone-900 font-normal leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-1.5 text-[#C9A054] pt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 fill-current ${
                    i < Math.floor(product.rating) ? 'text-accent' : 'text-stone-300'
                  }`}
                />
              ))}
              <span className="text-xs text-stone-500 font-mono mt-0.5 ml-1">({product.rating} customer rating)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-stone-900 text-2xl font-semibold">₹{currentPrice.toLocaleString('en-IN')}</span>
            {hasDiscount && (
              <>
                <span className="text-stone-400 line-through text-sm">₹{originalPrice?.toLocaleString('en-IN')}</span>
                <span className="text-accent text-xs font-semibold uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Variant / Size Selector */}
          {product.variants && product.variants.length > 1 && (
            <div className="space-y-3 pt-2 border-t border-stone-200">
              <span className="text-stone-700 text-xs tracking-wider uppercase font-medium">Select Size / Quantity</span>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      // Update active image if variant has custom logic or just keep current
                    }}
                    className={`px-4 py-2 text-xs tracking-wider uppercase border rounded font-medium transition ${
                      selectedVariant?.id === v.id
                        ? 'bg-primary border-primary text-white'
                        : 'bg-white border-stone-300 text-stone-700 hover:border-primary'
                    }`}
                  >
                    {v.name} - ₹{v.price.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector and Cart/Wishlist Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-stone-200">
            {/* Quantity Selector */}
            <div className="flex items-center border border-stone-300 rounded self-start sm:self-auto h-12">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-stone-50 text-stone-600 text-lg transition font-mono h-full"
              >
                -
              </button>
              <span className="px-6 text-sm font-mono text-stone-800">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-stone-50 text-stone-600 text-lg transition font-mono h-full"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-primary text-white text-xs tracking-widest uppercase font-semibold hover:bg-stone-850 transition rounded flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Basket
            </button>

            {/* Add to Wishlist */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`w-12 h-12 border rounded flex items-center justify-center transition ${
                favorited ? 'border-red-500 text-red-500 bg-red-50/20' : 'border-stone-300 text-stone-600 hover:border-red-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Quick trust metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-200 text-xs text-stone-600 font-light">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-accent" />
              <span>Traceable shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-accent" />
              <span>7-day return care</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>100% pure organic guarantee</span>
            </div>
          </div>

        </div>
      </div>

      {/* Middle: Detailed Tabs Information */}
      <div className="space-y-6 pt-8 border-t border-stone-200">
        <div className="flex border-b border-stone-250 gap-8 text-xs tracking-widest uppercase font-medium">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'desc' ? 'border-primary text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            The Alchemy
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'specs' ? 'border-primary text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'shipping' ? 'border-primary text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Shipping & Return Info
          </button>
        </div>

        <div className="text-sm font-light text-stone-600 leading-relaxed max-w-4xl py-2 min-h-[100px]">
          {activeTab === 'desc' && (
            <div className="space-y-4" dangerouslySetInnerHTML={{ __html: product.description }} />
          )}

          {activeTab === 'specs' && (
            <div className="border border-stone-200 rounded divide-y divide-stone-200 max-w-xl">
              {specs.length > 0 ? (
                specs.map((s: any, i: number) => (
                  <div key={i} className="grid grid-cols-3 p-3">
                    <span className="font-semibold text-stone-800 text-xs uppercase tracking-wider">{s.label}</span>
                    <span className="col-span-2 text-stone-600 text-xs">{s.value}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-xs text-stone-400">Standard specifications apply.</div>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs tracking-wide">
              <div>
                <h4 className="font-semibold text-stone-850 uppercase tracking-wider mb-1">Shipping Details</h4>
                <p>{product.shippingInfo || 'Standard shipping takes 3-7 business days across India. Ships in eco-friendly packaging.'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-850 uppercase tracking-wider mb-1 mt-4">Return Details</h4>
                <p>{product.returnInfo || 'Returns are accepted within 14 days on unused, sealed items.'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-12 border-t border-stone-200">
          <h3 className="text-2xl font-serif text-stone-950 font-normal">Related Ritual Elements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rp) => {
              const rpImage = rp.images?.find((img: any) => img.isFeatured)?.url || rp.images?.[0]?.url;
              return (
                <div key={rp.id} className="group border border-stone-200 p-3 rounded bg-white relative flex flex-col justify-between">
                  <Link href={`/product/${rp.slug}`} className="aspect-square block bg-stone-50 overflow-hidden rounded mb-3">
                    {rpImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rpImage}
                        alt={rp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">No Image</div>
                    )}
                  </Link>
                  <div className="space-y-1">
                    <h4 className="font-serif text-stone-950 text-sm line-clamp-1 group-hover:text-primary transition">
                      <Link href={`/product/${rp.slug}`}>{rp.name}</Link>
                    </h4>
                    <p className="text-stone-900 font-semibold text-xs">₹{rp.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
