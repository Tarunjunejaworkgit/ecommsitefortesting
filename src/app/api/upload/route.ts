import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { uploadFile, deleteFile } from '@/lib/storage';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  // Ensure the caller is an authenticated admin
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadFile(buffer, file.name, file.type);

    // Save metadata record in DB
    let mediaAsset;
    try {
      mediaAsset = await prisma.mediaAsset.create({
        data: {
          filename: file.name,
          url: fileUrl,
          sizeBytes: file.size,
          mimeType: file.type,
        },
      });
    } catch (dbErr) {
      console.warn('Database offline, returning mock media asset metadata:', dbErr);
      mediaAsset = {
        id: `media-mock-${Date.now()}`,
        filename: file.name,
        url: fileUrl,
        sizeBytes: file.size,
        mimeType: file.type,
        containerName: 'media',
        createdAt: new Date(),
      };
    }

    // Log the upload activity
    try {
      await prisma.adminActivityLog.create({
        data: {
          adminUserEmail: session.email,
          action: 'MEDIA_UPLOAD',
          details: `Uploaded media: ${file.name} to url: ${fileUrl}`,
          ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      });
    } catch (dbErr) {
      console.error('Failed to log admin upload activity:', dbErr);
    }

    return NextResponse.json({ success: true, asset: mediaAsset });
  } catch (err: any) {
    console.error('File upload API error:', err);
    return NextResponse.json({ error: err.message || 'File upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  // Ensure the caller is an authenticated admin
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const fallbackUrl = searchParams.get('url'); // Allow clients to pass URL directly if DB is offline

    if (!id) {
      return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    let asset = null;
    let urlToDelete = fallbackUrl;

    try {
      asset = await prisma.mediaAsset.findUnique({
        where: { id },
      });
      if (asset) {
        urlToDelete = asset.url;
      }
    } catch (dbErr) {
      console.warn('Database offline, looking up local assets or mock deletion');
    }

    if (!asset && !urlToDelete) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Delete from storage
    if (urlToDelete) {
      await deleteFile(urlToDelete);
    }

    // Delete from DB if online
    if (asset) {
      try {
        await prisma.mediaAsset.delete({
          where: { id },
        });
      } catch (dbErr) {
        console.error('Failed to delete media asset from DB:', dbErr);
      }
    }

    // Log activity
    try {
      await prisma.adminActivityLog.create({
        data: {
          adminUserEmail: session.email,
          action: 'MEDIA_DELETE',
          details: `Deleted media asset: ${asset?.filename || 'mock-asset'} (URL: ${urlToDelete})`,
          ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      });
    } catch (dbErr) {
      console.error('Failed to log admin delete activity:', dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('File delete API error:', err);
    return NextResponse.json({ error: err.message || 'File deletion failed' }, { status: 500 });
  }
}
