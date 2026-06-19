import React from 'react';
import Link from 'next/link';
import StorefrontLayout from '@/components/StorefrontLayout';
import {
  getCategories,
  getProducts,
  getProgrammes,
  getBlogPosts,
  getDeals,
  getTestimonials,
  getHeroBanners,
  getCMSPage,
} from '@/lib/services';
import { ArrowRight, Star, Calendar, MapPin, Tag } from 'lucide-react';

export default async function HomePage() {
  // Fetch data in parallel for speed
  const [
    categories,
    products,
    programmes,
    blogPosts,
    deals,
    testimonials,
    banners,
    homeCMS,
  ] = await Promise.all([
    getCategories(),
    getProducts(),
    getProgrammes(),
    getBlogPosts(),
    getDeals(),
    getTestimonials(),
    getHeroBanners(),
    getCMSPage('home'),
  ]);

  // Parse CMS content if available
  const cmsContent = homeCMS ? JSON.parse(homeCMS.content) : null;
  const heroTitle = cmsContent?.heroSection?.title || 'Mokshay';
  const heroSubtitle = cmsContent?.heroSection?.subtitle || 'Purity in every thread';
  const heritageText = cmsContent?.heritageSection?.text || 'Born from a desire to revive original craftsmanship and agricultural heritage, Mokshay partners with local collectives in Kashmir, Meghalaya, and Rajasthan.';

  // Select first banner as primary hero background
  const primaryHero = banners.length > 0 ? banners[0] : null;

  // Filter featured products (e.g. limit to 4)
  const featuredProducts = products.slice(0, 4);

  return (
    <StorefrontLayout>
      {/* 1. Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center bg-stone-900 overflow-hidden -mt-20 md:-mt-24">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          {primaryHero?.backgroundImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryHero.backgroundImage}
              alt="Mokshay Premium Hero"
              className="w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition duration-10000"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-stone-950 to-stone-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/20" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6 text-white">
          <h1 className="text-4xl md:text-7xl font-serif tracking-[0.2em] uppercase font-light animate-fade-in">
            {heroTitle}
          </h1>
          <p className="text-stone-300 tracking-widest text-sm md:text-lg font-light max-w-xl mx-auto uppercase">
            {primaryHero?.subtitle || heroSubtitle}
          </p>
          <div className="pt-6">
            <Link
              href={primaryHero?.ctaLink || '/shop'}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground text-xs uppercase tracking-widest font-semibold hover:bg-white hover:text-stone-950 transition duration-300 rounded"
            >
              {primaryHero?.ctaText || 'Begin Journey'} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Brand Story / Heritage Teaser */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center space-y-6">
        <span className="text-accent tracking-[0.3em] text-xs uppercase font-medium">An Ancient Philosophy</span>
        <h2 className="text-3xl md:text-5xl font-serif text-stone-900 font-normal">Holistic Purity, Untamed Spices</h2>
        <div className="w-20 h-px bg-accent mx-auto my-4" />
        <p className="text-stone-600 font-light leading-relaxed max-w-3xl mx-auto text-base md:text-lg">
          {heritageText}
        </p>
        <div className="pt-4">
          <Link
            href="/heritage"
            className="text-primary hover:text-accent font-medium text-sm tracking-wider uppercase inline-flex items-center gap-2 transition"
          >
            Explore Our Heritage Story <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. Featured Categories Grid */}
      <section className="bg-stone-50 py-16 md:py-24 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="flex justify-between items-end border-b border-stone-200 pb-5">
            <div className="space-y-1">
              <span className="text-accent tracking-[0.2em] text-xs uppercase font-medium">The Elements</span>
              <h3 className="text-2xl md:text-3xl font-serif text-stone-900 font-normal">Shop by Collection</h3>
            </div>
            <Link
              href="/shop"
              className="text-stone-500 hover:text-primary text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition"
            >
              Shop All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="group bg-white border border-stone-200 rounded overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full"
              >
                <div className="h-64 bg-stone-100 overflow-hidden relative">
                  {cat.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                      Collection Image
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <h4 className="font-serif text-stone-900 group-hover:text-primary text-lg transition">{cat.name}</h4>
                  <p className="text-stone-500 text-xs font-light leading-relaxed line-clamp-2">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best Sellers & New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-accent tracking-[0.2em] text-xs uppercase font-medium">Selected For You</span>
          <h3 className="text-3xl font-serif text-stone-900 font-normal">Featured Elements</h3>
          <div className="w-12 h-0.5 bg-accent mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((prod) => {
            const featuredImage = prod.images?.find((img) => img.isFeatured)?.url || prod.images?.[0]?.url;
            const hasDiscount = prod.compareAtPrice && prod.compareAtPrice > prod.price;

            return (
              <div key={prod.id} className="group flex flex-col justify-between h-full bg-white border border-stone-150 p-3 rounded relative">
                
                {/* Image and Wishlist Overlay */}
                <div className="relative aspect-square bg-stone-50 overflow-hidden rounded mb-4">
                  {featuredImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featuredImage}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">No Image</div>
                  )}
                  
                  {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-accent text-white px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded">
                      Special Offer
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1 px-1">
                  <h4 className="font-serif text-stone-900 text-base line-clamp-1 group-hover:text-primary transition">
                    <Link href={`/product/${prod.slug}`}>
                      {prod.name}
                    </Link>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-900 font-semibold text-sm">₹{prod.price.toLocaleString('en-IN')}</span>
                    {hasDiscount && (
                      <span className="text-stone-400 line-through text-xs font-light">₹{prod.compareAtPrice?.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[#C9A054] pt-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs text-stone-600 font-mono mt-0.5">{prod.rating}</span>
                  </div>
                </div>

                <div className="pt-4 px-1">
                  <Link
                    href={`/product/${prod.slug}`}
                    className="block w-full py-2 bg-primary text-white text-center text-[10px] tracking-wider uppercase font-medium hover:bg-stone-800 transition rounded"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Special Campaigns / Promotional Deals */}
      {deals.length > 0 && (
        <section className="bg-[#FAF8F5] py-12 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="bg-stone-50 border border-stone-200 rounded p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-accent/10 text-accent rounded-full">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-stone-900 font-medium">{deals[0].title}</h4>
                  <p className="text-stone-500 text-sm font-light mt-0.5">{deals[0].subtitle}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {deals[0].code && (
                  <div className="border-2 border-dashed border-accent/40 bg-accent/5 px-4 py-2 text-stone-800 font-mono text-sm font-semibold rounded tracking-wider">
                    CODE: {deals[0].code}
                  </div>
                )}
                <Link
                  href="/deals"
                  className="px-6 py-2.5 bg-accent text-accent-foreground text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 hover:text-white transition rounded"
                >
                  View All Offers
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Programmes Highlights */}
      {programmes.length > 0 && (
        <section className="bg-stone-50 py-16 md:py-24 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
            <div className="text-center space-y-2">
              <span className="text-accent tracking-[0.2em] text-xs uppercase font-medium">Holistic Rituals</span>
              <h3 className="text-3xl font-serif text-stone-900 font-normal">Wellness Programmes</h3>
              <p className="text-stone-500 text-sm font-light max-w-md mx-auto">
                Join our expert-led sessions exploring yogic breathwork, Ayurveda daily routines, and spiritual wellness.
              </p>
              <div className="w-12 h-0.5 bg-accent mx-auto mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programmes.map((prog) => (
                <div key={prog.id} className="bg-white border border-stone-200 rounded overflow-hidden shadow-sm flex flex-col sm:flex-row h-full">
                  <div className="sm:w-2/5 h-48 sm:h-full min-h-[200px] bg-stone-100 relative">
                    {prog.featuredImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={prog.featuredImage}
                        alt={prog.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">No Image</div>
                    )}
                  </div>
                  <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-serif text-stone-900 text-xl font-medium">{prog.title}</h4>
                      <p className="text-stone-500 text-xs line-clamp-3 font-light leading-relaxed">{prog.description}</p>
                      
                      <div className="flex flex-col space-y-1 text-xs text-stone-600 pt-2 font-light">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          <span>{new Date(prog.startDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-accent" />
                          <span className="truncate">{prog.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                      <span className="text-stone-900 font-semibold text-sm">₹{prog.price.toLocaleString('en-IN')}</span>
                      <Link
                        href={`/programmes?register=${prog.slug}`}
                        className="px-4 py-2 bg-primary text-white text-xs uppercase tracking-wider font-medium hover:bg-stone-850 transition rounded"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Blog Highlights */}
      {blogPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 space-y-12">
          <div className="flex justify-between items-end border-b border-stone-200 pb-5">
            <div className="space-y-1">
              <span className="text-accent tracking-[0.2em] text-xs uppercase font-medium">The Journal</span>
              <h3 className="text-2xl md:text-3xl font-serif text-stone-900 font-normal">Wellness Chronicles</h3>
            </div>
            <Link
              href="/blog"
              className="text-stone-500 hover:text-primary text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition"
            >
              Read Chronicles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.slice(0, 2).map((post) => (
              <article key={post.id} className="group space-y-4">
                <div className="h-64 bg-stone-100 rounded overflow-hidden relative">
                  {post.featuredImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-100" />
                  )}
                </div>
                <div className="space-y-2">
                  <span className="text-accent text-xs tracking-wider uppercase font-medium">
                    {post.category?.name || 'Ayurvedic Wisdom'}
                  </span>
                  <h4 className="font-serif text-stone-900 text-xl font-medium leading-snug group-hover:text-primary transition">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h4>
                  <p className="text-stone-500 text-xs font-light leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary hover:text-stone-900 font-medium text-xs tracking-wider uppercase inline-flex items-center gap-1.5 transition"
                    >
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 8. Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="bg-stone-900 text-white py-16 md:py-24 border-t border-stone-950">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
            <span className="text-accent tracking-[0.25em] text-xs uppercase font-medium">Testimonials</span>
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-serif font-light italic leading-relaxed text-stone-200">
                &ldquo;{testimonials[0].content}&rdquo;
              </h3>
              <div>
                <p className="text-sm font-semibold tracking-widest text-accent uppercase">{testimonials[0].name}</p>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  {testimonials[0].role}, {testimonials[0].company}
                </p>
              </div>
            </div>
            
            <div className="flex justify-center gap-1 text-[#C9A054]">
              {Array.from({ length: testimonials[0].rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>
        </section>
      )}
    </StorefrontLayout>
  );
}
