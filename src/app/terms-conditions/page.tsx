import React from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { getCMSPage } from '@/lib/services';
import { FileText } from 'lucide-react';

export default async function TermsConditionsPage() {
  const cmsPage = await getCMSPage('terms');
  const content = cmsPage ? cmsPage.content : 'Terms and conditions apply.';

  return (
    <StorefrontLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2 border-b border-stone-200 pb-6">
          <FileText className="w-8 h-8 text-accent mx-auto" />
          <h1 className="text-3xl font-serif text-stone-900 font-normal">Terms & Conditions</h1>
          <p className="text-stone-500 text-xs font-light">Guidelines governing your usage, purchases, and interactions on our site.</p>
        </div>
        <div className="text-sm font-light text-stone-600 leading-relaxed space-y-4">
          <p>{content}</p>
          <h4 className="font-serif font-semibold text-stone-800 uppercase tracking-wider text-xs pt-4">User Agreement</h4>
          <p className="text-xs">
            By browsing the Mokshay catalog or booking wellness registrations, you affirm that you are at least 18 years of age, provide complete registration contact data, and agree to purchase elements for individual consumption or approved trade purposes.
          </p>
        </div>
      </div>
    </StorefrontLayout>
  );
}
