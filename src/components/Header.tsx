'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Percent, User } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import CartDrawer from './CartDrawer';
import { mockCategories } from '@/lib/mockData';

export default function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);

  const announcements = [
    'Auspicious Beginnings: 15% off your first order with code: MOKSHAY15',
    'Tamra Hydration: Receive a free hammered copper tumbler on orders above ₹5,000',
    'Purely Sourced: Authentic Kashmiri Mongra Kesar and Cold-pressed Ayurvedic Elixirs',
  ];

  // Rotate announcements
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Track page scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <header className="w-full z-40 fixed top-0 left-0">
      {/* Top Announcement Bar */}
      <div className="w-full bg-primary text-primary-foreground py-2 text-center text-xs tracking-wider font-light transition-all duration-500 overflow-hidden flex justify-center items-center h-8">
        <span className="animate-fade-in px-4">{announcements[activeAnnouncement]}</span>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm border-stone-200'
            : 'bg-background/90 backdrop-blur-sm py-5 border-stone-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Hamburger Menu (Mobile) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-stone-700 hover:text-primary transition"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-serif tracking-[0.25em] text-primary hover:text-stone-900 transition font-medium"
          >
            MOKSHAY
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8 text-sm tracking-widest uppercase font-light text-stone-700">
            <Link href="/" className={`hover:text-primary transition ${pathname === '/' ? 'text-primary font-normal' : ''}`}>
              Home
            </Link>

            {/* Shop Dropdown */}
            <div className="relative group">
              <Link
                href="/shop"
                className={`hover:text-primary transition flex items-center gap-1 ${
                  pathname.startsWith('/shop') ? 'text-primary font-normal' : ''
                }`}
              >
                Shop <ChevronDown className="w-3.5 h-3.5" />
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white border border-stone-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 rounded p-2 flex flex-col space-y-1">
                <Link href="/shop" className="px-4 py-2 hover:bg-stone-50 text-xs text-stone-800 transition tracking-wider">
                  Shop All Products
                </Link>
                {mockCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    className="px-4 py-2 hover:bg-stone-50 text-xs text-stone-700 transition tracking-wider"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/programmes" className={`hover:text-primary transition ${pathname.startsWith('/programmes') ? 'text-primary font-normal' : ''}`}>
              Programmes
            </Link>
            <Link href="/blog" className={`hover:text-primary transition ${pathname.startsWith('/blog') ? 'text-primary font-normal' : ''}`}>
              Blog
            </Link>
            <Link href="/heritage" className={`hover:text-primary transition ${pathname === '/heritage' ? 'text-primary font-normal' : ''}`}>
              Heritage
            </Link>
            <Link href="/bulk-purchases" className={`hover:text-primary transition ${pathname === '/bulk-purchases' ? 'text-primary font-normal' : ''}`}>
              Bulk
            </Link>
            <Link href="/deals" className={`hover:text-primary transition flex items-center gap-1 text-accent ${pathname === '/deals' ? 'font-normal' : ''}`}>
              <Percent className="w-3 h-3" /> Offers
            </Link>
            <Link href="/contact" className={`hover:text-primary transition ${pathname === '/contact' ? 'text-primary font-normal' : ''}`}>
              Contact
            </Link>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-5 text-stone-700">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:text-primary transition p-1"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link href="/shop?wishlist=true" className="hover:text-primary transition p-1 relative">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-accent text-white text-[9px] font-mono rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link href="/profile" className="hover:text-primary transition p-1" title="My Account">
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="hover:text-primary transition p-1 relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-primary text-white text-[9px] font-mono rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sliding Search Panel */}
        {isSearchOpen && (
          <div className="w-full bg-stone-50 border-t border-stone-200 py-4 px-4 flex justify-center animate-slide-down">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="w-full max-w-2xl flex gap-2"
            >
              <input
                type="text"
                placeholder="Search the Mokshay catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-white border border-stone-300 px-4 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-primary rounded"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white text-xs uppercase tracking-wider font-medium hover:bg-stone-800 transition rounded"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-30 bg-white border-t border-stone-200 flex flex-col p-6 space-y-6 overflow-y-auto md:hidden animate-fade-in">
          <div className="flex flex-col space-y-4 text-lg font-serif text-stone-800">
            <Link href="/" className="pb-2 border-b border-stone-100 hover:text-primary">Home</Link>
            <Link href="/shop" className="pb-2 border-b border-stone-100 hover:text-primary">Shop All</Link>
            
            {/* Category Sublinks */}
            <div className="pl-4 flex flex-col space-y-2 text-sm text-stone-500 font-sans tracking-wide">
              {mockCategories.map(cat => (
                <Link key={cat.id} href={`/shop?category=${cat.id}`} className="hover:text-primary">
                  {cat.name}
                </Link>
              ))}
            </div>

            <Link href="/programmes" className="pb-2 border-b border-stone-100 hover:text-primary">Programmes</Link>
            <Link href="/blog" className="pb-2 border-b border-stone-100 hover:text-primary">Chronicles Blog</Link>
            <Link href="/heritage" className="pb-2 border-b border-stone-100 hover:text-primary">Heritage Story</Link>
            <Link href="/bulk-purchases" className="pb-2 border-b border-stone-100 hover:text-primary">Wholesale / Bulk</Link>
            <Link href="/deals" className="pb-2 border-b border-stone-100 text-accent hover:text-primary flex items-center gap-1">
              <Percent className="w-4 h-4" /> Special Deals
            </Link>
            <Link href="/contact" className="pb-2 border-b border-stone-100 hover:text-primary">Contact Us</Link>
            <Link href="/profile" className="pb-2 border-b border-stone-100 hover:text-primary flex items-center gap-2 font-normal">
              <User className="w-5 h-5 text-accent" /> My Account
            </Link>
          </div>
          
          <div className="pt-6 border-t border-stone-200 text-center space-y-3">
            <p className="text-xs text-stone-400">Holistic purity from origin to soul.</p>
            <p className="text-sm font-medium text-stone-700">care@mokshay.com</p>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
