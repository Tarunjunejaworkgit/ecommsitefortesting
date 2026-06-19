import React from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import CheckoutPageClient from '@/components/CheckoutPageClient';

export default function CheckoutPage() {
  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        
        {/* Title */}
        <div className="border-b border-stone-200 pb-6 space-y-2">
          <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-normal">
            Secure Checkout
          </h1>
          <p className="text-stone-500 text-sm font-light max-w-2xl">
            Please enter your shipping address details below. All transactions are securely processed.
          </p>
        </div>

        {/* Client form */}
        <CheckoutPageClient />

      </div>
    </StorefrontLayout>
  );
}
