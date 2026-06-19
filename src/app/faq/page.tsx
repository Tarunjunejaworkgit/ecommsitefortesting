import React from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { getCMSPage } from '@/lib/services';
import { HelpCircle } from 'lucide-react';

export default async function FAQPage() {
  const cmsPage = await getCMSPage('faq');
  const faqs = cmsPage ? JSON.parse(cmsPage.content) : [];

  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Title */}
        <div className="text-center space-y-2 border-b border-stone-200 pb-6">
          <HelpCircle className="w-8 h-8 text-accent mx-auto" />
          <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-normal">
            Frequently Asked Questions
          </h1>
          <p className="text-stone-500 text-sm font-light">
            Common questions regarding our sourcing, saffron testing, copperware care, and shipping pathways.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4 text-xs">
          {faqs.map((faq: any, index: number) => (
            <details
              key={index}
              className="group border border-stone-200 rounded bg-white p-4 transition [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer font-serif text-stone-900 text-sm font-semibold select-none">
                <span>{faq.q}</span>
                <span className="text-stone-400 group-open:rotate-180 transition duration-300">
                  &darr;
                </span>
              </summary>
              <p className="text-stone-550 font-light mt-3 leading-relaxed border-t border-stone-100 pt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </StorefrontLayout>
  );
}
