import React from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { getCategories, getProducts } from '@/lib/services';
import Link from 'next/link';
import { Heart, Search, Filter, SlidersHorizontal, Check } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import CatalogToolbar from '@/components/CatalogToolbar';

export default async function ShopPage(props: {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    wishlist?: string;
  }>;
}) {
  // Next.js 16: Must await the searchParams promise!
  const params = await props.searchParams;
  const categoryId = params.category;
  const searchQ = params.search;
  const sortOption = params.sort || 'default';
  const showWishlist = params.wishlist === 'true';

  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts(categoryId),
  ]);

  // Apply server-side search filter
  let filteredProducts = allProducts;
  if (searchQ) {
    const q = searchQ.toLowerCase();
    filteredProducts = allProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  // Apply server-side sorting
  if (sortOption === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortOption === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  const selectedCategory = categories.find(c => c.id === categoryId);

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        
        {/* Header Title Section */}
        <div className="border-b border-stone-200 pb-6 space-y-2">
          <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-normal">
            {showWishlist ? 'Your Wishlist' : selectedCategory ? selectedCategory.name : 'The Ritual Shop'}
          </h1>
          <p className="text-stone-500 text-sm font-light max-w-2xl">
            {showWishlist 
              ? 'Your personal curation of pure, heritage-inspired wellness essentials.' 
              : selectedCategory?.description || 'Explore our full collection of hand-harvested Kashmiri saffron, therapeutic Ayurvedic oils, and single-origin sacred spices.'}
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-stone-50 p-4 border border-stone-200 rounded">
          {/* Category Quick Links */}
          <div className="flex flex-wrap gap-2 text-xs tracking-wider uppercase font-medium">
            <Link
              href="/shop"
              className={`px-4 py-2 border rounded transition ${
                !categoryId && !showWishlist
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-stone-300 text-stone-700 hover:border-primary'
              }`}
            >
              Shop All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className={`px-4 py-2 border rounded transition ${
                  categoryId === cat.id
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white border-stone-300 text-stone-700 hover:border-primary'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Search, Sort, and Wishlist toggler */}
          <CatalogToolbar basePath="/shop" showSort={true} sortOption={sortOption} searchPlaceholder="Search catalog..." />
        </div>

        {/* Product Grid Render */}
        <ProductGrid products={filteredProducts} showOnlyWishlist={showWishlist} />

      </div>
    </StorefrontLayout>
  );
}
