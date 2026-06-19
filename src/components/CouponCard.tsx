'use client';

import React, { useState } from 'react';
import { Copy, Check, Tag } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  discountValue: number;
  discountType: string;
  code: string | null;
  bannerImage: string | null;
  startDate: Date;
  endDate: Date;
}

export default function CouponCard({ deal }: { deal: Deal }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (deal.code) {
      navigator.clipboard.writeText(deal.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = new Date(deal.endDate).toLocaleDateString('en-IN', {
    dateStyle: 'medium',
  });

  return (
    <div className="bg-white border border-stone-200 rounded p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:border-accent/40 transition">
      
      {/* Detail information */}
      <div className="flex gap-4 items-center w-full md:w-auto">
        <div className="p-3.5 bg-accent/10 text-accent rounded-full flex-shrink-0">
          <Tag className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-stone-900 text-lg font-medium">{deal.title}</h3>
          <p className="text-stone-500 text-xs font-light">{deal.subtitle}</p>
          <p className="text-stone-400 text-[10px] font-light">Valid until: {formattedDate}</p>
        </div>
      </div>

      {/* Action panel */}
      {deal.code && (
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="border border-stone-300 bg-stone-50/50 px-4 py-2 text-stone-850 font-mono text-sm font-semibold rounded text-center tracking-wider">
            {deal.code}
          </div>
          <button
            onClick={handleCopy}
            className={`px-5 py-2 text-xs uppercase tracking-wider font-semibold rounded transition flex items-center justify-center gap-2 ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-primary text-white hover:bg-stone-850'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </>
            )}
          </button>
        </div>
      )}

    </div>
  );
}
