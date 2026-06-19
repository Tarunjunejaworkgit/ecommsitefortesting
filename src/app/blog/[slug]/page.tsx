import React from 'react';
import { notFound } from 'next/navigation';
import StorefrontLayout from '@/components/StorefrontLayout';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/services';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  // Next.js 16: Must await the params promise!
  const { slug } = await props.params;

  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch other posts for recommendations
  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 2);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <StorefrontLayout>
      <article className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Back Link */}
        <div>
          <Link
            href="/blog"
            className="text-stone-500 hover:text-primary text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Chronicles
          </Link>
        </div>

        {/* Article Meta */}
        <div className="space-y-4 text-center md:text-left">
          <span className="text-accent text-xs tracking-widest uppercase font-semibold">
            {post.category?.name || 'Ayurvedic Wellness'}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-normal leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-stone-400 text-xs font-light pt-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-accent" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-accent" />
              <span>By Mokshay Care Team</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="w-full h-[45vh] bg-stone-100 rounded overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Editorial Body */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
          
          {/* Left Column: Author and Sharing */}
          <div className="md:col-span-1 border-t md:border-t-0 md:border-r border-stone-200 pt-6 md:pt-0 md:pr-6 space-y-6 text-xs text-stone-500">
            <div>
              <h4 className="font-semibold uppercase tracking-wider text-stone-800 mb-1">Mokshay Chronicles</h4>
              <p className="font-light leading-relaxed">Written and verified by our Ayurvedic research panel to ensure original holistic standards.</p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <span className="font-semibold uppercase tracking-wider text-stone-850">Share Wisdom</span>
              <div className="flex gap-3 text-stone-400">
                <button className="hover:text-primary transition"><Share2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Right Column: HTML Article Content */}
          <div 
            className="md:col-span-3 text-stone-700 space-y-6 text-base font-light leading-relaxed prose prose-stone max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

        </div>

        {/* Recommendations Section */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-stone-200 pt-12 mt-16 space-y-8">
            <h3 className="text-2xl font-serif text-stone-950 font-normal text-center">Continue Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((rp) => (
                <div key={rp.id} className="group grid grid-cols-3 gap-4 bg-stone-50 p-4 border border-stone-200 rounded">
                  <div className="col-span-1 aspect-square bg-stone-100 rounded overflow-hidden relative">
                    {rp.featuredImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rp.featuredImage}
                        alt={rp.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-100" />
                    )}
                  </div>
                  <div className="col-span-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-accent text-[9px] uppercase tracking-wider font-semibold">
                        {rp.category?.name || 'Wisdom'}
                      </span>
                      <h4 className="font-serif text-stone-900 text-sm font-semibold line-clamp-2 leading-snug group-hover:text-primary transition">
                        <Link href={`/blog/${rp.slug}`}>{rp.title}</Link>
                      </h4>
                    </div>
                    <Link
                      href={`/blog/${rp.slug}`}
                      className="text-stone-500 hover:text-stone-900 text-[10px] uppercase font-semibold tracking-wider inline-flex items-center gap-1 mt-2"
                    >
                      Read Thread &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </article>
    </StorefrontLayout>
  );
}
