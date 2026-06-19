import React from 'react';
import Link from 'next/link';
import StorefrontLayout from '@/components/StorefrontLayout';

export default function NotFound() {
  return (
    <StorefrontLayout>
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-6">
        <h1 className="text-7xl md:text-8xl font-serif text-accent tracking-[0.2em] font-light">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif text-stone-900 font-normal">Sanctuary Out of Bounds</h2>
          <p className="text-stone-500 text-xs font-light leading-relaxed max-w-sm mx-auto">
            The path you are seeking does not exist or has been shifted to another coordinate in our chronicles.
          </p>
        </div>
        <div className="pt-4">
          <Link
            href="/"
            className="px-8 py-3.5 bg-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-stone-850 transition rounded"
          >
            Return to Sanctuary
          </Link>
        </div>
      </div>
    </StorefrontLayout>
  );
}
