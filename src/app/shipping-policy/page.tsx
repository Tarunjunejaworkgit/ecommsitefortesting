import React from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { getCMSPage } from '@/lib/services';
import { Truck } from 'lucide-react';

export default async function ShippingPolicyPage() {
  const cmsPage = await getCMSPage('shipping');
  const content = cmsPage ? cmsPage.content : 'Standard shipping rates apply.';

  return (
    <StorefrontLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2 border-b border-stone-200 pb-6">
          <Truck className="w-8 h-8 text-accent mx-auto" />
          <h1 className="text-3xl font-serif text-stone-900 font-normal">Shipping Policy</h1>
          <p className="text-stone-500 text-xs font-light">Information regarding delivery zones, transit timelines, and shipping carriers.</p>
        </div>
        <div className="text-sm font-light text-stone-600 leading-relaxed space-y-4">
          <p>{content}</p>
          <h4 className="font-serif font-semibold text-stone-800 uppercase tracking-wider text-xs pt-4">Estimated Timelines</h4>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><b>Metro Cities (Delhi NCR, Mumbai, Bengaluru, etc.):</b> 3-5 business days.</li>
            <li><b>Non-Metro Areas & Regional Districts:</b> 5-7 business days.</li>
            <li><b>North-East States & J&K:</b> 7-10 business days.</li>
          </ul>
        </div>
      </div>
    </StorefrontLayout>
  );
}
