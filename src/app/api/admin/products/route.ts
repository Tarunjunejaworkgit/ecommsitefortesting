import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, description, price, compareAtPrice, categoryId, status, sizeInfo, returnInfo, shippingInfo, specifications, variants, images } = body;

    if (!name || !slug || !description || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        categoryId,
        status: status || 'ACTIVE',
        sizeInfo: sizeInfo || null,
        returnInfo: returnInfo || null,
        shippingInfo: shippingInfo || null,
        specifications: specifications ? JSON.stringify(specifications) : null,
        variants: {
          create: (variants || []).map((v: any) => ({
            name: v.name,
            price: parseFloat(v.price) || parseFloat(price),
            sku: v.sku || null,
            stock: parseInt(v.stock, 10) || 0,
          })),
        },
        images: {
          create: (images || []).map((img: any, idx: number) => ({
            url: img.url,
            altText: img.altText || null,
            isFeatured: idx === 0,
            order: idx,
          })),
        },
      },
    });

    // Log action
    await prisma.adminActivityLog.create({
      data: {
        adminUserEmail: session.email,
        action: 'PRODUCT_CREATE',
        details: `Created product: ${name} (ID: ${product.id})`,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    console.error('Admin create product error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 550 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, slug, description, price, compareAtPrice, categoryId, status, sizeInfo, returnInfo, shippingInfo, specifications, variants, images } = body;

    if (!id || !name || !slug || !description || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Delete existing variants and images first (or update them)
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.productImage.deleteMany({ where: { productId: id } });

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        categoryId,
        status: status || 'ACTIVE',
        sizeInfo: sizeInfo || null,
        returnInfo: returnInfo || null,
        shippingInfo: shippingInfo || null,
        specifications: specifications ? JSON.stringify(specifications) : null,
        variants: {
          create: (variants || []).map((v: any) => ({
            name: v.name,
            price: parseFloat(v.price) || parseFloat(price),
            sku: v.sku || null,
            stock: parseInt(v.stock, 10) || 0,
          })),
        },
        images: {
          create: (images || []).map((img: any, idx: number) => ({
            url: img.url,
            altText: img.altText || null,
            isFeatured: img.isFeatured || idx === 0,
            order: idx,
          })),
        },
      },
    });

    // Log action
    await prisma.adminActivityLog.create({
      data: {
        adminUserEmail: session.email,
        action: 'PRODUCT_UPDATE',
        details: `Updated product: ${name} (ID: ${id})`,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    console.error('Admin edit product error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 550 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Cascade deletions are configured, but delete explicitly just in case
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    // Log action
    await prisma.adminActivityLog.create({
      data: {
        adminUserEmail: session.email,
        action: 'PRODUCT_DELETE',
        details: `Deleted product: ${product.name} (ID: ${id})`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin delete product error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete product' }, { status: 550 });
  }
}
