import React from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import BulkPurchaseForm from '@/components/BulkPurchaseForm';
import { ShieldCheck, Truck, Sparkles } from 'lucide-react';

export default function BulkPurchasesPage() {
  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-12">
        
        {/* Editorial Heading */}
        <div className="border-b border-stone-200 pb-6 space-y-2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-normal">
            Wholesale & Corporate Gifting
          </h1>
          <p className="text-stone-500 text-sm font-light max-w-2xl">
            Partner with Mokshay to introduce premium, single-origin natural elixirs, organic spices, and handcrafted copperware to your organization, events, or retail locations.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-stone-50 border border-stone-200 p-6 rounded text-center space-y-3">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-stone-900 text-base font-semibold">Custom Branding</h4>
            <p className="text-stone-550 text-xs font-light leading-relaxed">
              We offer bespoke copper engraving and customized wooden gift box embossing containing greeting cards detailing the crop story.
            </p>
          </div>
          
          <div className="bg-stone-50 border border-stone-200 p-6 rounded text-center space-y-3">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-stone-900 text-base font-semibold">Uncompromising Purity</h4>
            <p className="text-stone-550 text-xs font-light leading-relaxed">
              Every batch of Mongra Kesar and Lakadong Turmeric is lab-certified for chemical residue and active curcumin/crocin components.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-6 rounded text-center space-y-3">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-stone-900 text-base font-semibold">Flexible Logistical Flow</h4>
            <p className="text-stone-550 text-xs font-light leading-relaxed">
              Express priority dispatching with centralized invoicing and shipping solutions for regional offices or domestic distribution centers.
            </p>
          </div>
        </div>

        {/* Lead Capture Form Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-serif text-stone-900 font-normal">Request Commercial Quotation</h3>
            <p className="text-stone-500 text-xs mt-1">Please specify your estimated volumes below to initiate contact.</p>
          </div>
          <BulkPurchaseForm />
        </div>

      </div>
    </StorefrontLayout>
  );
}
