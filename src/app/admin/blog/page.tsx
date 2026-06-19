import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminBlogClient from '@/components/AdminBlogClient';

export default async function AdminBlogPage() {
  let posts: any[] = [];
  let categories: any[] = [];

  try {
    [posts, categories] = await Promise.all([
      prisma.blogPost.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blogCategory.findMany({
        orderBy: { name: 'asc' },
      }),
    ]);
  } catch (err) {
    console.warn('Database offline, returning empty articles listings for admin blog dashboard');
  }

  // Cast parameters cleanly
  const castedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt || null,
    featuredImage: post.featuredImage || null,
    isFeatured: post.isFeatured,
    status: post.status,
    seoTitle: post.seoTitle || null,
    seoDescription: post.seoDescription || null,
    categoryId: post.categoryId,
    category: post.category ? {
      id: post.category.id,
      name: post.category.name,
    } : undefined,
  }));

  const castedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  return (
    <AdminBlogClient
      posts={castedPosts}
      categories={castedCategories}
    />
  );
}
