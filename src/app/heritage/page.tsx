import React from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { getCMSPage } from '@/lib/services';
import { Compass, Sparkles, Sprout, Heart } from 'lucide-react';

export default async function HeritagePage() {
  const cmsData = await getCMSPage('about');
  const cmsContent = cmsData ? JSON.parse(cmsData.content) : null;
  
  const visionText = cmsContent?.vision || 'Our vision is to introduce modern consumers to the calming, restorative properties of high-grade, traditional Indian spices, elixirs, and lifestyle accessories.';
  const storyText = cmsContent?.story || 'Established in 2024, Mokshay was inspired by a simple idea: that wellness begins with uncompromising purity.';

  const milestones = [
    {
      year: 'Autumn 2024',
      title: 'The Valley Alliance',
      desc: 'Formed direct fair-trade sourcing agreements with Pampore saffron agricultural cooperatives in Kashmir, bypassing multiple broker tiers to secure Grade A++ Mongra harvests.',
    },
    {
      year: 'Winter 2024',
      title: 'Forging Metal Rituals',
      desc: 'Partnered with Thathera metal-crafting guilds in Rajasthan to design a hammered pure copper hydration set, keeping ancient forging metal arts alive.',
    },
    {
      year: 'Spring 2025',
      title: 'The Cold Press Infusions',
      desc: 'Composed Kumkumadi facial oil in certified Ayurvedic boiling rooms using wild-harvested red sandalwood extracts and first-flush kesar threads.',
    },
    {
      year: 'Summer 2026',
      title: 'Holistic Mokshay Launch',
      desc: 'Unveiled our digital storefront and holistic wellness programs, sharing authentic rituals directly with global wellness seekers.',
    },
  ];

  return (
    <StorefrontLayout>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-16">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-accent tracking-[0.3em] text-xs uppercase font-medium">Chronicles of Purity</span>
          <h1 className="text-4xl md:text-6xl font-serif text-stone-900 font-normal leading-tight">
            Our Heritage
          </h1>
          <div className="w-16 h-px bg-accent mx-auto" />
          <p className="text-stone-500 text-sm font-light leading-relaxed">
            {storyText}
          </p>
        </div>

        {/* Brand Editorial Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900">Crafting Peaceful Rituals</h2>
            <p className="text-stone-600 text-sm font-light leading-relaxed">
              Mokshay was born from a journey across India&apos;s agricultural landscapes. We noticed that the most potent botanical treasures—saffron stigmas in Pampore, turmeric roots in the high Meghalaya hills, cold-pressed seed oils—rarely reached households in their original state.
            </p>
            <p className="text-stone-600 text-sm font-light leading-relaxed">
              We set out to create a bridge: directly sourcing from native agricultural collectives and metalwork artisans, paying fair value prices, and packing them in small premium glass jars with full ingredient transparency.
            </p>
          </div>
          <div className="bg-stone-50 border border-stone-200 p-8 rounded space-y-6">
            <h3 className="text-lg font-serif text-stone-900 font-medium">Founder&apos;s Statement</h3>
            <p className="text-stone-600 text-sm font-light italic leading-relaxed">
              &ldquo;We believe that true wellness is not about complex routines, but returning to original elements. A cup of pure copper water in the morning, a thread of Pampore kesar at night. Purity is a state of mind.&rdquo;
            </p>
            <div className="w-10 h-px bg-accent" />
            <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold">The Mokshay Collective</p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-y border-stone-200">
          <div className="text-center space-y-3">
            <Sprout className="w-6 h-6 text-accent mx-auto" />
            <h4 className="font-serif text-stone-900 font-medium">100% Native Origin</h4>
            <p className="text-stone-550 text-xs font-light leading-relaxed">Sourced from native microclimates where soil and weather yield the highest crocin, curcumin, and mineral balances.</p>
          </div>
          <div className="text-center space-y-3">
            <Compass className="w-6 h-6 text-accent mx-auto" />
            <h4 className="font-serif text-stone-900 font-medium">Artisanal Guilds</h4>
            <p className="text-stone-550 text-xs font-light leading-relaxed">Supporting traditional metal forging guilds and small farm collectives with direct revenue shares.</p>
          </div>
          <div className="text-center space-y-3">
            <Sparkles className="w-6 h-6 text-accent mx-auto" />
            <h4 className="font-serif text-stone-900 font-medium">Vedic Alignment</h4>
            <p className="text-stone-550 text-xs font-light leading-relaxed">Balancing Vata, Pitta, and Kapha bio-energies through classical oil infusion boiling methods.</p>
          </div>
        </div>

        {/* Timeline Timeline */}
        <div className="space-y-10">
          <h3 className="text-2xl md:text-3xl font-serif text-stone-900 text-center">Ritual Milestones</h3>
          
          <div className="relative border-l border-stone-250 ml-4 md:ml-32 space-y-12">
            {milestones.map((m, index) => (
              <div key={index} className="relative pl-6 md:pl-10">
                {/* Dot */}
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-accent rounded-full border border-white" />
                
                {/* Label Year */}
                <div className="md:absolute md:-left-32 md:top-1 md:w-28 text-left md:text-right text-accent text-xs font-bold font-mono tracking-widest uppercase">
                  {m.year}
                </div>
                
                {/* Content */}
                <div className="space-y-1">
                  <h4 className="font-serif text-stone-900 text-lg font-semibold">{m.title}</h4>
                  <p className="text-stone-550 text-xs font-light leading-relaxed max-w-2xl">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </StorefrontLayout>
  );
}
