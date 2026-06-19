import React from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { getCMSPage } from '@/lib/services';
import { RotateCcw } from 'lucide-react';

export default async function ReturnPolicyPage() {
  const cmsPage = await getCMSPage('returns');
  const content = cmsPage ? cmsPage.content : 'Returns accepted within 14 days.';

  return (
    <StorefrontLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2 border-b border-stone-200 pb-6">
          <RotateCcw className="w-8 h-8 text-accent mx-auto" />
          <h1 className="text-3xl font-serif text-stone-900 font-normal">Return & Cancellation Policy</h1>
          <p className="text-stone-500 text-xs font-light">Information regarding eligibility, return windows, and processing schedules.</p>
        </div>
        <div className="text-sm font-light text-stone-600 leading-relaxed space-y-4">
          <p>{content}</p>
          <h4 className="font-serif font-semibold text-stone-800 uppercase tracking-wider text-xs pt-4">Return Eligibility Guidelines</h4>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><b>Edible Elements (Saffron, Infusions, Spices):</b> Eligible for returns only if the container seal remains intact.</li>
            <li><b>Therapeutic Skincare Oils:</b> Dropper seals must be intact and bottle unused.</li>
            <li><b>Hammered Copperware & Accessories:</b> Must show no signs of water usage, polishing, or scratches.</li>
          </ul>
        </div>
      </div>
    </StorefrontLayout>
  );
}
