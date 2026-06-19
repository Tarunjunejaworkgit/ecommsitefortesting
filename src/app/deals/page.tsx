import React from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { getDeals } from '@/lib/services';
import CouponCard from '@/components/CouponCard';
import { Ticket } from 'lucide-react';

export default async function DealsPage() {
  const deals = await getDeals();

  // Cast dates to Date objects to satisfy type checkers
  const castedDeals = deals.map((d) => ({
    ...d,
    startDate: new Date(d.startDate),
    endDate: new Date(d.endDate),
  }));

  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-12">
        
        {/* Heading */}
        <div className="border-b border-stone-200 pb-6 space-y-2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-normal">
            Special Campaigns & Offers
          </h1>
          <p className="text-stone-500 text-sm font-light max-w-2xl">
            Acquire promotional discount keys and coupon vouchers to apply during checkout. Experience the Mokshay ritual with priority offers.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="space-y-6">
          {castedDeals.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-stone-50 border border-dashed border-stone-200 rounded">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mx-auto">
                <Ticket className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-stone-900 font-medium">No offers currently active</h3>
                <p className="text-stone-500 text-xs mt-1">Check back soon for seasonal campaigns.</p>
              </div>
            </div>
          ) : (
            castedDeals.map((deal) => (
              <CouponCard key={deal.id} deal={deal} />
            ))
          )}
        </div>

        {/* Small T&C */}
        <div className="bg-stone-50 border border-stone-200 p-5 rounded text-xs text-stone-500 font-light space-y-2 leading-relaxed">
          <h4 className="font-serif text-stone-850 font-semibold uppercase tracking-wider">Promotional Guidelines</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>Coupons must be applied during checkout before final order submission. Retroactive adjustments are not supported.</li>
            <li>Percentage-based discounts apply to the subtotal amount (excluding taxes and shipping charges).</li>
            <li>Free gift items (like copper tumblers) are auto-assigned by matching coupon keys and fulfilled while stocks persist.</li>
          </ul>
        </div>

      </div>
    </StorefrontLayout>
  );
}
