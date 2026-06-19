import React from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { getBlogPosts } from '@/lib/services';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Search, FileText } from 'lucide-react';
import CatalogToolbar from '@/components/CatalogToolbar';

export default async function BlogPage(props: {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}) {
  // Next.js 16: Must await the searchParams promise!
  const params = await props.searchParams;
  const categoryId = params.category;
  const searchQ = params.search;

  const allPosts = await getBlogPosts();

  // Apply filters on the server side
  let filteredPosts = allPosts;
  
  if (categoryId) {
    filteredPosts = allPosts.filter((post) => post.categoryId === categoryId);
  }

  if (searchQ) {
    const q = searchQ.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) => post.title.toLowerCase().includes(q) || post.content.toLowerCase().includes(q)
    );
  }

  // Extract unique categories for filter menu
  // Using Map to deduplicate categories based on id
  const categoriesMap = new Map();
  allPosts.forEach((post) => {
    if (post.category) {
      categoriesMap.set(post.category.id, post.category.name);
    }
  });
  const categoriesList = Array.from(categoriesMap.entries()).map(([id, name]) => ({ id, name }));

  // Separate the featured post (usually the latest featured post or just the first item)
  const featuredPost = filteredPosts.find((p) => p.isFeatured) || filteredPosts[0];
  const gridPosts = featuredPost ? filteredPosts.filter((p) => p.id !== featuredPost.id) : filteredPosts;

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-12">
        
        {/* Blog Header */}
        <div className="border-b border-stone-200 pb-6 space-y-2">
          <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-normal">
            The Wellness Chronicles
          </h1>
          <p className="text-stone-500 text-sm font-light max-w-2xl">
            Journals on Ayurveda rituals, native crop histories, natural skin remedies, and the artisanal heritage of India.
          </p>
        </div>

        {/* Filters and Search Menu */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-stone-50 p-4 border border-stone-200 rounded gap-4">
          <div className="flex flex-wrap gap-2 text-xs uppercase font-medium tracking-wider">
            <Link
              href="/blog"
              className={`px-4 py-2 border rounded transition ${
                !categoryId
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-stone-300 text-stone-700 hover:border-primary'
              }`}
            >
              All Articles
            </Link>
            {categoriesList.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.id}`}
                className={`px-4 py-2 border rounded transition ${
                  categoryId === cat.id
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white border-stone-300 text-stone-700 hover:border-primary'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <CatalogToolbar basePath="/blog" showSort={false} searchPlaceholder="Search articles..." />
        </div>

        {/* Featured Post Card */}
        {featuredPost && !searchQ && !categoryId && (
          <section className="bg-white border border-stone-200 rounded overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-sm">
            <div className="h-72 md:h-full min-h-[300px] bg-stone-100 relative">
              {featuredPost.featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">No Image</div>
              )}
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-accent text-xs tracking-wider uppercase font-semibold">
                  Featured Article &bull; {featuredPost.category?.name || 'Wisdom'}
                </span>
                <h2 className="text-2xl md:text-4xl font-serif text-stone-900 font-normal leading-snug">
                  <Link href={`/blog/${featuredPost.slug}`} className="hover:text-primary transition">
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="text-stone-500 text-sm font-light leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-stone-400 text-xs font-light pt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>{new Date(featuredPost.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-accent" />
                    <span>By Mokshay Care</span>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium text-xs tracking-widest uppercase transition"
                >
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Articles List / Grid */}
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-stone-50 border border-dashed border-stone-200 rounded">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-serif text-stone-900 font-medium">No articles found</h3>
              <p className="text-stone-500 text-xs mt-1">Try resetting your filters or search terms.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white border border-stone-200 rounded overflow-hidden flex flex-col justify-between h-full hover:shadow-md transition duration-300"
              >
                <div className="space-y-4 p-4">
                  <div className="h-56 bg-stone-100 rounded overflow-hidden relative">
                    {post.featuredImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">No Image</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="text-accent text-[10px] tracking-wider uppercase font-semibold">
                      {post.category?.name || 'General'}
                    </span>
                    <h3 className="font-serif text-stone-900 text-lg font-medium leading-snug group-hover:text-primary transition line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-stone-500 text-xs font-light leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400 font-light">
                  <span>{new Date(post.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary hover:text-stone-900 font-semibold uppercase tracking-wider flex items-center gap-1 transition"
                  >
                    Read <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </StorefrontLayout>
  );
}
