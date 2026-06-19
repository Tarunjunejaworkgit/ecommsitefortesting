'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash, X, Upload, Check, AlertCircle, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BlogCategory {
  id: string;
  name: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  isFeatured: boolean;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  categoryId: string;
  category?: BlogCategory;
}

interface AdminBlogClientProps {
  posts: BlogPost[];
  categories: BlogCategory[];
}

export default function AdminBlogClient({ posts, categories }: AdminBlogClientProps) {
  const router = useRouter();

  const [activeModal, setActiveModal] = useState<'create' | 'edit' | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formFields, setFormFields] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    isFeatured: false,
    status: 'DRAFT',
    categoryId: categories[0]?.id || '',
    seoTitle: '',
    seoDescription: '',
  });

  const handleOpenCreate = () => {
    setError(null);
    setFormFields({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      isFeatured: false,
      status: 'DRAFT',
      categoryId: categories[0]?.id || '',
      seoTitle: '',
      seoDescription: '',
    });
    setActiveModal('create');
  };

  const handleOpenEdit = (post: BlogPost) => {
    setError(null);
    setEditingPost(post);
    setFormFields({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      featuredImage: post.featuredImage || '',
      isFeatured: post.isFeatured,
      status: post.status,
      categoryId: post.categoryId,
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
    });
    setActiveModal('edit');
  };

  const handleTitleChange = (titleVal: string) => {
    const slugVal = titleVal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormFields((prev) => ({ ...prev, title: titleVal, slug: slugVal }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFormFields((prev) => ({ ...prev, featuredImage: data.asset.url }));
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/actions?type=blog&id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Deletion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const isEdit = activeModal === 'edit';
      const endpoint = `/api/admin/actions?type=blog`;
      const res = await fetch(endpoint, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: editingPost?.id, ...formFields } : formFields),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setActiveModal(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-stone-200 pb-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-serif text-stone-900 font-normal">Wellness Chronicles</h2>
          <p className="text-stone-400">CRUD articles, configure featured journals, and edit SEO details.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-accent text-accent-foreground text-xs uppercase tracking-wider font-semibold hover:bg-stone-900 transition rounded flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Article
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded overflow-hidden shadow-sm">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-stone-400 space-y-2">
            <FileText className="w-8 h-8 mx-auto text-stone-300" />
            <p>No articles posted yet. Click Add Article to start seeding.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-550 uppercase text-[10px] tracking-wider font-semibold">
                <th className="p-4 pl-6">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-stone-50/50 transition">
                  <td className="p-4 pl-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-50 border border-stone-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {post.featuredImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-5 h-5 text-stone-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-800 text-sm line-clamp-1">{post.title}</h4>
                      <span className="text-[9px] text-stone-400 font-mono">{post.slug}</span>
                    </div>
                  </td>
                  <td className="p-4">{post.category?.name || 'Wisdom'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                      post.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-550'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4">{post.isFeatured ? 'Yes' : 'No'}</td>
                  <td className="p-4 text-right pr-6 space-x-2">
                    <button
                      onClick={() => handleOpenEdit(post)}
                      className="p-1.5 border border-stone-200 hover:border-accent text-stone-500 rounded transition inline-flex"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 border border-stone-200 hover:border-red-500 text-stone-500 rounded transition inline-flex"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Editor Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-250 rounded shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-serif text-stone-900 text-lg font-semibold">
                {activeModal === 'edit' ? 'Edit Article' : 'Create Article'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Errors */}
            {error && (
              <div className="m-5 p-4 bg-red-50 text-red-700 border border-red-200 rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-6 text-xs text-stone-600 font-light flex-1">
              
              {/* Basic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formFields.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal text-stone-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Article Slug *</label>
                  <input
                    type="text"
                    required
                    value={formFields.slug}
                    onChange={(e) => setFormFields({ ...formFields, slug: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal text-stone-850 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Category *</label>
                  <select
                    value={formFields.categoryId}
                    onChange={(e) => setFormFields({ ...formFields, categoryId: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 bg-white rounded text-sm focus:outline-none focus:border-primary cursor-pointer font-normal text-stone-850"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Status</label>
                  <select
                    value={formFields.status}
                    onChange={(e) => setFormFields({ ...formFields, status: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 bg-white rounded text-sm focus:outline-none focus:border-primary cursor-pointer font-normal text-stone-850"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-4 p-3 bg-stone-50 border rounded text-xs items-center text-stone-700">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formFields.isFeatured}
                  onChange={(e) => setFormFields({ ...formFields, isFeatured: e.target.checked })}
                  className="w-4 h-4 cursor-pointer focus:ring-primary text-primary"
                />
                <label htmlFor="isFeatured" className="cursor-pointer select-none font-semibold uppercase tracking-wider">
                  Highlight as Featured Article on Blog Homepage
                </label>
              </div>

              {/* Excerpt */}
              <div className="space-y-1">
                <label className="text-stone-700 font-semibold uppercase">Article Excerpt (Brief description for grid summaries) *</label>
                <input
                  type="text"
                  required
                  value={formFields.excerpt}
                  onChange={(e) => setFormFields({ ...formFields, excerpt: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 rounded text-sm font-normal text-stone-850 focus:outline-none"
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-stone-700 font-semibold uppercase block">Featured Cover Image *</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    required
                    value={formFields.featuredImage}
                    onChange={(e) => setFormFields({ ...formFields, featuredImage: e.target.value })}
                    className="flex-grow border border-stone-300 p-2 rounded focus:outline-none font-normal text-stone-850"
                    placeholder="Upload file or enter URL..."
                  />
                  <label className="px-4 py-2 border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded cursor-pointer transition flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> {uploading ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              {/* HTML Content */}
              <div className="space-y-1">
                <label className="text-stone-700 font-semibold uppercase block">HTML Content Body *</label>
                <textarea
                  required
                  rows={8}
                  value={formFields.content}
                  onChange={(e) => setFormFields({ ...formFields, content: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 rounded text-sm font-normal text-stone-850 focus:outline-none resize-none font-mono"
                  placeholder="<p>Write your article HTML code here...</p>"
                />
              </div>

              {/* SEO details */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-serif text-stone-900 text-sm font-semibold uppercase tracking-wider">
                  5. SEO Meta Fields
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-700 font-semibold uppercase block">SEO Page Title</label>
                    <input
                      type="text"
                      value={formFields.seoTitle}
                      onChange={(e) => setFormFields({ ...formFields, seoTitle: e.target.value })}
                      className="w-full border border-stone-300 p-2.5 rounded text-sm font-normal text-stone-850"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-700 font-semibold uppercase block">SEO Meta Description</label>
                    <input
                      type="text"
                      value={formFields.seoDescription}
                      onChange={(e) => setFormFields({ ...formFields, seoDescription: e.target.value })}
                      className="w-full border border-stone-300 p-2.5 rounded text-sm font-normal text-stone-850"
                    />
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="pt-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white py-4 z-10">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold uppercase rounded tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-primary hover:bg-stone-850 text-white font-semibold uppercase rounded tracking-wider disabled:bg-stone-300 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Article'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
