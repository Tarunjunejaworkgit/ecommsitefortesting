import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cartContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mokshay | Premium Ayurvedic Elixirs & Heritage Crafts',
  description: 'Experience pure, hand-harvested Kashmiri Mongra Saffron, therapeutic Ayurvedic oils, organic spices, and handcrafted copperware.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
