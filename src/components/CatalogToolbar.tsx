'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';

interface CatalogToolbarProps {
  basePath: string; // '/shop' or '/blog'
  searchPlaceholder?: string;
  showSort?: boolean;
  sortOption?: string;
}

export default function CatalogToolbar({
  basePath,
  searchPlaceholder = 'Search...',
  showSort = false,
  sortOption = 'default'
}: CatalogToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', val);
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      {showSort && (
        <div className="flex items-center gap-2 bg-white border border-stone-300 px-3 py-2 rounded">
          <SlidersHorizontal className="w-4 h-4 text-stone-500" />
          <select
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-transparent text-xs text-stone-700 focus:outline-none cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      )}

      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center bg-white border border-stone-300 rounded overflow-hidden w-full md:w-auto"
      >
        <input
          type="text"
          name="search"
          defaultValue={searchParams.get('search') || ''}
          placeholder={searchPlaceholder}
          className="px-3 py-2 text-xs text-stone-700 placeholder-stone-400 focus:outline-none w-full sm:w-44 md:w-56"
        />
        <button type="submit" className="px-3 py-2 text-stone-500 hover:text-primary border-l border-stone-200">
          <Search className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
