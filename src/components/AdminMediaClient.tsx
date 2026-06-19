'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  File, 
  Image as ImageIcon, 
  Inbox, 
  AlertCircle, 
  ExternalLink,
  Eye
} from 'lucide-react';

interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  createdAt: Date;
}

interface AdminMediaClientProps {
  initialAssets: MediaAsset[];
}

// Seed helper to populate UI with local mock files if database is empty/offline
const SEED_MEDIA_ASSETS = [
  { id: 'seed-1', filename: 'category-saffron.jpg', url: '/seed/category-saffron.jpg', sizeBytes: 154000, mimeType: 'image/jpeg', createdAt: new Date() },
  { id: 'seed-2', filename: 'category-oils.jpg', url: '/seed/category-oils.jpg', sizeBytes: 204000, mimeType: 'image/jpeg', createdAt: new Date() },
  { id: 'seed-3', filename: 'category-spices.jpg', url: '/seed/category-spices.jpg', sizeBytes: 180000, mimeType: 'image/jpeg', createdAt: new Date() },
  { id: 'seed-4', filename: 'category-crafts.jpg', url: '/seed/category-crafts.jpg', sizeBytes: 220000, mimeType: 'image/jpeg', createdAt: new Date() },
  { id: 'seed-5', filename: 'saffron-1.jpg', url: '/seed/saffron-1.jpg', sizeBytes: 125000, mimeType: 'image/jpeg', createdAt: new Date() },
  { id: 'seed-6', filename: 'oil-1.jpg', url: '/seed/oil-1.jpg', sizeBytes: 145000, mimeType: 'image/jpeg', createdAt: new Date() },
  { id: 'seed-7', filename: 'turmeric-1.jpg', url: '/seed/turmeric-1.jpg', sizeBytes: 98000, mimeType: 'image/jpeg', createdAt: new Date() },
  { id: 'seed-8', filename: 'copper-1.jpg', url: '/seed/copper-1.jpg', sizeBytes: 310000, mimeType: 'image/jpeg', createdAt: new Date() },
  { id: 'seed-9', filename: 'prog-breathwork.jpg', url: '/seed/prog-breathwork.jpg', sizeBytes: 195000, mimeType: 'image/jpeg', createdAt: new Date() },
  { id: 'seed-10', filename: 'prog-ayurveda.jpg', url: '/seed/prog-ayurveda.jpg', sizeBytes: 165000, mimeType: 'image/jpeg', createdAt: new Date() },
];

export default function AdminMediaClient({ initialAssets }: AdminMediaClientProps) {
  const router = useRouter();
  
  // Combine db assets with seed assets if DB list is empty to keep it beautiful
  const allAssets = initialAssets.length > 0 ? initialAssets : SEED_MEDIA_ASSETS;
  
  const [assets, setAssets] = useState<MediaAsset[]>(allAssets);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError(null);

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      // Prepend to local state list
      const newAsset = {
        id: data.asset.id,
        filename: data.asset.filename,
        url: data.asset.url,
        sizeBytes: data.asset.sizeBytes,
        mimeType: data.asset.mimeType,
        createdAt: new Date(data.asset.createdAt)
      };
      
      setAssets((prev) => [newAsset, ...prev]);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to upload media file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!confirm(`Are you sure you want to delete ${asset.filename}?`)) return;
    setError(null);

    try {
      const res = await fetch(`/api/upload?id=${asset.id}&url=${encodeURIComponent(asset.url)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Deletion failed');
      
      // Remove from local state list
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete media asset.');
    }
  };

  const handleCopyLink = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filters
  const filteredAssets = assets.filter((asset) =>
    asset.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-stone-200 pb-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-serif text-stone-900 font-normal">Media Asset Library</h2>
          <p className="text-stone-400">Upload product images, blog attachments, and program covers. Copy image URLs for use in text editors.</p>
        </div>
        
        {/* Upload Button */}
        <div>
          <label className="px-4 py-2.5 bg-accent text-accent-foreground text-xs uppercase tracking-wider font-semibold hover:bg-stone-900 transition rounded flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload File'}
            <input 
              type="file" 
              accept="image/*,application/pdf" 
              disabled={uploading} 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white border border-stone-200 p-4 rounded shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search media by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-300 pl-10 pr-4 py-2 rounded text-xs focus:outline-none focus:border-primary text-stone-850"
          />
        </div>
        <div className="text-stone-400 text-[10px] font-light">
          Showing {filteredAssets.length} of {assets.length} items
        </div>
      </div>

      {/* Media Grid */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded p-12 text-center text-stone-400 space-y-3">
          <Inbox className="w-10 h-10 mx-auto text-stone-350" />
          <p>No media files found matching query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredAssets.map((asset) => {
            const isImage = asset.mimeType.startsWith('image/');
            return (
              <div 
                key={asset.id} 
                className="bg-white border border-stone-200 rounded overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
              >
                {/* Thumbnail Display */}
                <div className="h-40 bg-stone-100 flex items-center justify-center relative overflow-hidden border-b border-stone-150">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={asset.url} 
                      alt={asset.filename} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                  ) : (
                    <div className="text-stone-400 flex flex-col items-center gap-1.5">
                      <File className="w-10 h-10 text-stone-300" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">{asset.mimeType.split('/')[1] || 'FILE'}</span>
                    </div>
                  )}
                  
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleCopyLink(asset)}
                      className="p-2 bg-white text-stone-800 rounded hover:bg-stone-100 transition shadow"
                      title="Copy URL Link"
                    >
                      {copiedId === asset.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-white text-stone-800 rounded hover:bg-stone-100 transition shadow"
                      title="View File"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(asset)}
                      className="p-2 bg-red-650 text-white rounded hover:bg-red-700 transition shadow"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Meta details */}
                <div className="p-3 text-[10px] text-stone-600 font-light flex-grow flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="font-semibold text-stone-900 truncate text-xs" title={asset.filename}>
                      {asset.filename}
                    </h4>
                    <span className="text-stone-400">{formatBytes(asset.sizeBytes)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-[9px] text-stone-400">
                    <span className="truncate max-w-[80px] font-mono">{asset.mimeType}</span>
                    <span>
                      {new Date(asset.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
