import React from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { getCMSPage } from '@/lib/services';
import { ShieldCheck } from 'lucide-react';

export default async function PrivacyPolicyPage() {
  const cmsPage = await getCMSPage('privacy');
  const content = cmsPage ? cmsPage.content : 'We secure your personal data.';

  return (
    <StorefrontLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2 border-b border-stone-200 pb-6">
          <ShieldCheck className="w-8 h-8 text-accent mx-auto" />
          <h1 className="text-3xl font-serif text-stone-900 font-normal">Privacy Policy</h1>
          <p className="text-stone-500 text-xs font-light">Information regarding how we gather, protect, and handle client details.</p>
        </div>
        <div className="text-sm font-light text-stone-600 leading-relaxed space-y-4">
          <p>{content}</p>
          <h4 className="font-serif font-semibold text-stone-800 uppercase tracking-wider text-xs pt-4">Data Security Points</h4>
          <p className="text-xs">
            We encrypt shipping databases and contact details. Mokshay does not store raw credit/debit card numbers or net banking logins. Payment details are handled securely by PCI-DSS compliant third-party gateways.
          </p>
        </div>
      </div>
    </StorefrontLayout>
  );
}
