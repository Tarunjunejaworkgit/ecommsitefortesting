'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Compass } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#1e231e] text-[#FAF8F5] pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16">
        
        {/* Brand Narrative */}
        <div className="space-y-4">
          <Link
            href="/"
            className="text-2xl font-serif tracking-[0.25em] text-white hover:text-stone-200 transition font-medium"
          >
            MOKSHAY
          </Link>
          <p className="text-stone-400 text-sm font-light leading-relaxed">
            Crafting a pathway to purity and tranquility. Sourcing the absolute finest single-origin natural elixirs, organic spices, and hand-forged lifestyle accessories from India&apos;s heritage landscapes.
          </p>
          <div className="flex space-x-4 pt-2 text-stone-400">
            <a href="#" className="hover:text-accent transition" aria-label="Instagram">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="hover:text-accent transition" aria-label="Facebook">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="hover:text-accent transition"><Compass className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-4">
          <h4 className="font-serif text-white tracking-wider text-sm uppercase">Collections</h4>
          <ul className="space-y-2 text-stone-400 text-sm font-light">
            <li>
              <Link href="/shop?category=cat-1" className="hover:text-accent transition">
                Saffron & Elixirs
              </Link>
            </li>
            <li>
              <Link href="/shop?category=cat-2" className="hover:text-accent transition">
                Wellness Oils
              </Link>
            </li>
            <li>
              <Link href="/shop?category=cat-3" className="hover:text-accent transition">
                Sacred Spices
              </Link>
            </li>
            <li>
              <Link href="/shop?category=cat-4" className="hover:text-accent transition">
                Lifestyle & Crafts
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-accent transition">
                Shop All Elements
              </Link>
            </li>
          </ul>
        </div>

        {/* Brand & Support */}
        <div className="space-y-4">
          <h4 className="font-serif text-white tracking-wider text-sm uppercase">Rituals & Care</h4>
          <ul className="space-y-2 text-stone-400 text-sm font-light">
            <li><Link href="/heritage" className="hover:text-accent transition">Heritage Story</Link></li>
            <li><Link href="/programmes" className="hover:text-accent transition">Wellness Programmes</Link></li>
            <li><Link href="/blog" className="hover:text-accent transition">Wellness Chronicles</Link></li>
            <li><Link href="/bulk-purchases" className="hover:text-accent transition">Wholesale & Corporates</Link></li>
            <li><Link href="/faq" className="hover:text-accent transition">FAQ / Support</Link></li>
            <li><Link href="/track-order" className="hover:text-accent transition">Track Your Order</Link></li>
          </ul>
        </div>

        {/* Newsletter subscription */}
        <div className="space-y-4">
          <h4 className="font-serif text-white tracking-wider text-sm uppercase">Chronicles Newsletter</h4>
          <p className="text-stone-400 text-sm font-light leading-relaxed">
            Subscribe to receive Ayurvedic rituals, seasonal recipe details, and priority notifications for wellness programs.
          </p>
          {subscribed ? (
            <div className="bg-primary/20 border border-primary/50 text-[#C9A054] p-3 text-xs rounded font-light">
              Welcome to the Mokshay Ritual. Verify your email to begin.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex border-b border-stone-700 pb-1">
              <input
                type="email"
                placeholder="Enter email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-sm text-white focus:outline-none flex-1 placeholder-stone-500 font-light pr-2"
              />
              <button type="submit" className="text-stone-400 hover:text-white p-1 transition">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-stone-850 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 font-light gap-4">
        
        {/* Copyright */}
        <div>
          &copy; {new Date().getFullYear()} Mokshay Heritage Pvt. Ltd. All rights reserved.
        </div>

        {/* Care Policies */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/shipping-policy" className="hover:text-stone-300 transition">Shipping Policy</Link>
          <Link href="/return-policy" className="hover:text-stone-300 transition">Return Policy</Link>
          <Link href="/privacy-policy" className="hover:text-stone-300 transition">Privacy Policy</Link>
          <Link href="/terms-conditions" className="hover:text-stone-300 transition">Terms of Service</Link>
          <Link href="/admin/dashboard" className="hover:text-stone-300 transition underline decoration-dotted">Admin Portal</Link>
        </div>

      </div>
    </footer>
  );
}
