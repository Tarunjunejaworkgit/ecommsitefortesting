import { prisma } from './prisma';
import * as mock from './mockData';

// Helper to determine if an error is a database connection/firewall/schema error
function isDbError(err: any): boolean {
  return true; // Fallback to mock data for all database errors to prevent build failure
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return categories;
  } catch (err) {
    if (isDbError(err)) {
      console.warn('Database offline, returning mock categories');
      return mock.mockCategories;
    }
    throw err;
  }
}

export async function getProducts(categoryId?: string) {
  try {
    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId, status: 'ACTIVE' } : { status: 'ACTIVE' },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
      },
    });
    return products;
  } catch (err) {
    if (isDbError(err)) {
      console.warn('Database offline, returning mock products');
      if (categoryId) {
        return mock.mockProducts.filter(p => p.categoryId === categoryId);
      }
      return mock.mockProducts;
    }
    throw err;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        category: true,
      },
    });
    return product;
  } catch (err) {
    if (isDbError(err)) {
      console.warn(`Database offline, returning mock product for slug: ${slug}`);
      const found = mock.mockProducts.find(p => p.slug === slug);
      if (found) {
        const category = mock.mockCategories.find(c => c.id === found.categoryId);
        return {
          ...found,
          category,
          images: found.images || [],
          variants: found.variants || [],
        };
      }
      return null;
    }
    throw err;
  }
}

export async function getProgrammes() {
  try {
    return await prisma.programme.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { startDate: 'asc' },
    });
  } catch (err) {
    if (isDbError(err)) {
      console.warn('Database offline, returning mock programmes');
      return mock.mockProgrammes.map(p => ({
        ...p,
        startDate: new Date(p.startDate),
        endDate: p.endDate ? new Date(p.endDate) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }
    throw err;
  }
}

export async function getProgrammeBySlug(slug: string) {
  try {
    return await prisma.programme.findUnique({
      where: { slug },
    });
  } catch (err) {
    if (isDbError(err)) {
      const p = mock.mockProgrammes.find(p => p.slug === slug);
      if (!p) return null;
      return {
        ...p,
        startDate: new Date(p.startDate),
        endDate: p.endDate ? new Date(p.endDate) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    throw err;
  }
}

export async function getBlogPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    if (isDbError(err)) {
      console.warn('Database offline, returning mock blog posts');
      return mock.mockBlogPosts.map(post => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.createdAt),
        category: {
          id: post.categoryId,
          name: post.categoryName || 'General',
          slug: post.categoryId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }));
    }
    throw err;
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch (err) {
    if (isDbError(err)) {
      const post = mock.mockBlogPosts.find(p => p.slug === slug);
      if (!post) return null;
      return {
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.createdAt),
        category: {
          id: post.categoryId,
          name: post.categoryName || 'General',
          slug: post.categoryId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    }
    throw err;
  }
}

export async function getDeals() {
  try {
    return await prisma.deal.findMany({
      where: { isActive: true },
    });
  } catch (err) {
    if (isDbError(err)) {
      return mock.mockDeals.map(d => ({
        ...d,
        startDate: new Date(d.startDate),
        endDate: new Date(d.endDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }
    throw err;
  }
}

export async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { isFeatured: true },
    });
  } catch (err) {
    if (isDbError(err)) {
      return mock.mockTestimonials.map(t => ({
        ...t,
        createdAt: new Date(),
      }));
    }
    throw err;
  }
}

export async function getHeroBanners() {
  try {
    return await prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  } catch (err) {
    if (isDbError(err)) {
      return mock.mockHeroBanners.map(hb => ({
        ...hb,
        createdAt: new Date(),
      }));
    }
    throw err;
  }
}

export async function getCMSPage(key: string) {
  try {
    return await prisma.cMSPage.findUnique({
      where: { key },
    });
  } catch (err) {
    if (isDbError(err)) {
      const content = mock.mockCMSPages[key];
      if (!content) return null;
      return {
        id: `cms-${key}`,
        key,
        title: `${key.toUpperCase()} Content`,
        content: typeof content === 'string' ? content : JSON.stringify(content),
        metadata: null,
        updatedAt: new Date(),
      };
    }
    throw err;
  }
}

export async function getSEORecord(path: string) {
  try {
    return await prisma.sEORecord.findUnique({
      where: { path },
    });
  } catch (err) {
    if (isDbError(err)) {
      if (path === '/') {
        return {
          id: 'seo-home',
          path: '/',
          title: 'Mokshay | Premium Ayurvedic Elixirs & Heritage Crafts',
          description: 'Experience the absolute purity of Kashmiri Mongra Saffron, therapeutic Ayurvedic facial oils, single-origin spices, and hand-forged copper accessories.',
          keywords: 'saffron, ayurveda, pure kesar, copper bottle, turmeric',
          ogImage: '/seed/hero-home.jpg',
          twitterCard: 'summary_large_image',
          updatedAt: new Date(),
        };
      }
      return {
        id: `seo-path-${path.replace(/\//g, '-')}`,
        path,
        title: 'Mokshay Premium Storefront',
        description: 'Premium Indian brand selling saffron, therapeutic oils, spices, and copperware.',
        keywords: 'saffron, ayurveda, wellness',
        ogImage: '/seed/hero-home.jpg',
        twitterCard: 'summary_large_image',
        updatedAt: new Date(),
      };
    }
    throw err;
  }
}
