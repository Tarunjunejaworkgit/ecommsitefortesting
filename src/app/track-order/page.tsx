import React, { Suspense } from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import TrackOrderClient from '@/components/TrackOrderClient';

export default function TrackOrderPage() {
  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        
        {/* Title */}
        <div className="border-b border-stone-200 pb-6 space-y-2 text-center">
          <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-normal">
            Track Your Ritual Order
          </h1>
          <p className="text-stone-500 text-sm font-light max-w-2xl mx-auto">
            Please enter your Invoice Number (e.g., MOK-10042) to track dispatch status, courier assignments, and delivery milestones.
          </p>
        </div>

        {/* Client tracker with suspense wrapper for useSearchParams hook */}
        <Suspense fallback={<div className="text-center py-10 text-stone-400">Loading tracker...</div>}>
          <TrackOrderClient />
        </Suspense>

      </div>
    </StorefrontLayout>
  );
}
