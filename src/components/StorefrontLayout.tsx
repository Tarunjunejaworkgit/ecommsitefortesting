import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      {/* Dynamic top padding (h-8 announcement + navigation height) */}
      <main className="flex-1 pt-20 md:pt-24 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
