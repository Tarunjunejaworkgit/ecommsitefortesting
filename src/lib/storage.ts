import { BlobServiceClient } from '@azure/storage-blob';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const defaultContainer = process.env.AZURE_STORAGE_CONTAINER || 'media';

export async function uploadFile(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string,
  containerName: string = defaultContainer
): Promise<string> {
  const uniqueName = `${Date.now()}-${filename.replace(/\s+/g, '-')}`;

  if (connectionString) {
    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerClient = blobServiceClient.getContainerClient(containerName);
      
      // Ensure container exists with public read access for blobs
      await containerClient.createIfNotExists({ access: 'blob' });
      
      const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);
      await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
        blobHTTPHeaders: { blobContentType: mimeType }
      });
      
      return blockBlobClient.url;
    } catch (err) {
      console.error('Failed to upload to Azure Blob Storage, falling back to local storage:', err);
    }
  }

  // Fallback: Save to public/uploads
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, uniqueName);
  fs.writeFileSync(filePath, fileBuffer);
  
  return `/uploads/${uniqueName}`;
}

export async function deleteFile(fileUrl: string, containerName: string = defaultContainer): Promise<void> {
  if (connectionString && fileUrl.includes('windows.net')) {
    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerClient = blobServiceClient.getContainerClient(containerName);
      
      const urlParts = fileUrl.split('/');
      const blobName = urlParts[urlParts.length - 1];
      
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.deleteIfExists();
      return;
    } catch (err) {
      console.error('Failed to delete from Azure Blob Storage:', err);
    }
  }

  // Local deletion fallback
  if (fileUrl.startsWith('/uploads/')) {
    const filename = fileUrl.replace('/uploads/', '');
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Failed to delete local file:', err);
      }
    }
  }
}
