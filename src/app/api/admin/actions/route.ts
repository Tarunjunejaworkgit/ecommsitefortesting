import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    const body = await request.json();

    if (type === 'blog') {
      const { title, slug, content, excerpt, featuredImage, isFeatured, status, categoryId, seoTitle, seoDescription } = body;
      const post = await prisma.blogPost.create({
        data: { title, slug, content, excerpt, featuredImage, isFeatured: !!isFeatured, status: status || 'DRAFT', categoryId, seoTitle, seoDescription },
      });
      await prisma.adminActivityLog.create({
        data: { adminUserEmail: session.email, action: 'BLOG_CREATE', details: `Created article: ${title}` },
      });
      return NextResponse.json({ success: true, post });
    }

    if (type === 'programme') {
      const { title, slug, description, content, featuredImage, startDate, endDate, location, status, maxRegistrations, price } = body;
      const prog = await prisma.programme.create({
        data: {
          title,
          slug,
          description,
          content,
          featuredImage,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          location,
          status: status || 'DRAFT',
          maxRegistrations: maxRegistrations ? parseInt(maxRegistrations, 10) : null,
          price: parseFloat(price) || 0.0,
        },
      });
      await prisma.adminActivityLog.create({
        data: { adminUserEmail: session.email, action: 'PROG_CREATE', details: `Created programme: ${title}` },
      });
      return NextResponse.json({ success: true, programme: prog });
    }

    if (type === 'deal') {
      const { title, subtitle, description, discountValue, discountType, code, bannerImage, startDate, endDate, isActive } = body;
      const deal = await prisma.deal.create({
        data: {
          title,
          subtitle,
          description,
          discountValue: parseFloat(discountValue) || 0.0,
          discountType: discountType || 'PERCENTAGE',
          code: code || null,
          bannerImage: bannerImage || null,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          isActive: isActive !== false,
        },
      });
      await prisma.adminActivityLog.create({
        data: { adminUserEmail: session.email, action: 'DEAL_CREATE', details: `Created coupon campaign: ${title}` },
      });
      return NextResponse.json({ success: true, deal });
    }

    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  } catch (err: any) {
    console.error(`Admin POST action error (${type}):`, err);
    return NextResponse.json({ error: err.message || 'Operation failed' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    const body = await request.json();

    if (type === 'order') {
      const { id, status, trackingNumber, carrier } = body;
      const order = await prisma.order.update({
        where: { id },
        data: { status, trackingNumber: trackingNumber || null, carrier: carrier || null },
      });
      await prisma.adminActivityLog.create({
        data: { adminUserEmail: session.email, action: 'ORDER_UPDATE', details: `Updated order ${order.orderNumber} status to ${status}` },
      });
      return NextResponse.json({ success: true, order });
    }

    if (type === 'lead') {
      const { id, status, notes } = body;
      const lead = await prisma.bulkPurchaseLead.update({
        where: { id },
        data: { status, notes: notes || null },
      });
      await prisma.adminActivityLog.create({
        data: { adminUserEmail: session.email, action: 'LEAD_UPDATE', details: `Updated lead status for ${lead.name} to ${status}` },
      });
      return NextResponse.json({ success: true, lead });
    }

    if (type === 'cms') {
      const { key, title, content } = body;
      const cms = await prisma.cMSPage.upsert({
        where: { key },
        create: { key, title, content: JSON.stringify(content) },
        update: { title, content: JSON.stringify(content) },
      });
      await prisma.adminActivityLog.create({
        data: { adminUserEmail: session.email, action: 'CMS_UPDATE', details: `Updated CMS blocks for key: ${key}` },
      });
      return NextResponse.json({ success: true, cms });
    }

    if (type === 'blog') {
      const { id, title, slug, content, excerpt, featuredImage, isFeatured, status, categoryId, seoTitle, seoDescription } = body;
      const post = await prisma.blogPost.update({
        where: { id },
        data: { title, slug, content, excerpt, featuredImage, isFeatured: !!isFeatured, status, categoryId, seoTitle, seoDescription },
      });
      await prisma.adminActivityLog.create({
        data: { adminUserEmail: session.email, action: 'BLOG_UPDATE', details: `Updated article: ${title}` },
      });
      return NextResponse.json({ success: true, post });
    }

    if (type === 'programme') {
      const { id, title, slug, description, content, featuredImage, startDate, endDate, location, status, maxRegistrations, price } = body;
      const prog = await prisma.programme.update({
        where: { id },
        data: {
          title,
          slug,
          description,
          content,
          featuredImage,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          location,
          status,
          maxRegistrations: maxRegistrations ? parseInt(maxRegistrations, 10) : null,
          price: parseFloat(price) || 0.0,
        },
      });
      await prisma.adminActivityLog.create({
        data: { adminUserEmail: session.email, action: 'PROG_UPDATE', details: `Updated programme: ${title}` },
      });
      return NextResponse.json({ success: true, programme: prog });
    }

    if (type === 'deal') {
      const { id, title, subtitle, description, discountValue, discountType, code, bannerImage, startDate, endDate, isActive } = body;
      const deal = await prisma.deal.update({
        where: { id },
        data: {
          title,
          subtitle,
          description,
          discountValue: parseFloat(discountValue) || 0.0,
          discountType,
          code: code || null,
          bannerImage: bannerImage || null,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          isActive,
        },
      });
      await prisma.adminActivityLog.create({
        data: { adminUserEmail: session.email, action: 'DEAL_UPDATE', details: `Updated coupon campaign: ${title}` },
      });
      return NextResponse.json({ success: true, deal });
    }

    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  } catch (err: any) {
    console.error(`Admin PUT action error (${type}):`, err);
    return NextResponse.json({ error: err.message || 'Operation failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  try {
    if (type === 'blog') {
      const post = await prisma.blogPost.delete({ where: { id } });
      await prisma.adminActivityLog.create({
        data: { adminUserEmail: session.email, action: 'BLOG_DELETE', details: `Deleted article: ${post.title}` },
      });
      return NextResponse.json({ success: true });
    }

    if (type === 'programme') {
      const prog = await prisma.programme.delete({ where: { id } });
      await prisma.adminActivityLog.create({
        data: { adminUserEmail: session.email, action: 'PROG_DELETE', details: `Deleted programme: ${prog.title}` },
      });
      return NextResponse.json({ success: true });
    }

    if (type === 'deal') {
      const deal = await prisma.deal.delete({ where: { id } });
      await prisma.adminActivityLog.create({
        data: { adminUserEmail: session.email, action: 'DEAL_DELETE', details: `Deleted coupon campaign: ${deal.title}` },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  } catch (err: any) {
    console.error(`Admin DELETE action error (${type}):`, err);
    return NextResponse.json({ error: err.message || 'Operation failed' }, { status: 550 });
  }
}
