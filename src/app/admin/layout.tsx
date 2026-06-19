export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import {
  LayoutDashboard,
  ShoppingBag,
  ReceiptText,
  Users,
  FileText,
  Calendar,
  Percent,
  Compass,
  Image as ImageIcon,
  LogOut,
  FolderLock,
  Globe
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '';

  // If rendering the login page, bypass layout check and wrapping
  if (pathname.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  const session = await getAdminSession();

  // If session is missing, redirect to admin login
  if (!session) {
    redirect('/admin/login');
  }

  const navLinks = [
    { label: 'Overview Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products Catalog', href: '/admin/products', icon: ShoppingBag },
    { label: 'Orders Fulfillment', href: '/admin/orders', icon: ReceiptText },
    { label: 'Customer Relations', href: '/admin/customers', icon: Users },
    { label: 'Wellness Blog', href: '/admin/blog', icon: FileText },
    { label: 'Programmes Schedule', href: '/admin/programmes', icon: Calendar },
    { label: 'Deals & Coupons', href: '/admin/deals', icon: Percent },
    { label: 'B2B Wholesale Leads', href: '/admin/leads', icon: Compass },
    { label: 'CMS Content Blocks', href: '/admin/cms', icon: FolderLock },
    { label: 'Media Asset Library', href: '/admin/media', icon: ImageIcon },
  ];

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden font-sans text-xs">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col justify-between flex-shrink-0 border-r border-stone-850">
        
        {/* Brand Header */}
        <div className="space-y-4">
          <div className="p-6 border-b border-stone-800 flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-accent" />
            <span className="font-serif tracking-widest text-lg font-bold text-white">MOKSHAY ADMIN</span>
          </div>

          {/* Links */}
          <nav className="px-4 space-y-1.5 flex-1 overflow-y-auto max-h-[70vh]">
            {navLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-stone-800 hover:text-white rounded text-stone-400 font-medium transition"
                >
                  <Icon className="w-4 h-4 text-accent" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-stone-800 space-y-3 bg-stone-950">
          <div className="px-3 py-1 bg-stone-850 rounded flex flex-col space-y-0.5 text-[10px]">
            <span className="text-white font-semibold truncate">{session.name}</span>
            <span className="text-stone-500 truncate text-[9px]">{session.email}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 p-2 bg-stone-800 hover:bg-stone-750 text-white rounded justify-center font-medium transition"
            >
              <Globe className="w-3.5 h-3.5" /> Site
            </Link>
            <a
              href="/api/auth/logout"
              className="flex items-center gap-1 p-2 bg-red-900/60 hover:bg-red-800 text-white rounded justify-center font-medium transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </a>
          </div>
        </div>

      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top bar header */}
        <header className="h-16 bg-white border-b border-stone-200 px-8 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 font-semibold rounded uppercase tracking-wider text-[9px]">
              Active Role: {session.role}
            </span>
            {session.isMock && (
              <span className="bg-amber-100 text-amber-800 px-3 py-1 font-semibold rounded uppercase tracking-wider text-[9px]">
                Offline Sandbox Mode
              </span>
            )}
          </div>
          
          <div className="text-stone-400 text-[10px] font-light">
            Mokshay Management Console &bull; Connected to Azure SQL
          </div>
        </header>

        {/* Dynamic content area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
