'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash, X, Upload, Check, AlertCircle, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductVariant {
  id?: string;
  name: string;
  price: number;
  sku: string | null;
  stock: number;
}

interface ProductImage {
  id?: string;
  url: string;
  altText: string | null;
  isFeatured: boolean;
  order: number;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  status: string;
  sku: string | null;
  categoryId: string;
  sizeInfo: string | null;
  returnInfo: string | null;
  shippingInfo: string | null;
  specifications: string | null;
  variants: ProductVariant[];
  images: ProductImage[];
}

interface AdminProductsClientProps {
  products: Product[];
  categories: Category[];
}

export default function AdminProductsClient({ products, categories }: AdminProductsClientProps) {
  const router = useRouter();

  const [activeModal, setActiveModal] = useState<'create' | 'edit' | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formFields, setFormFields] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compareAtPrice: '',
    categoryId: categories[0]?.id || '',
    status: 'ACTIVE',
    sizeInfo: '',
    returnInfo: '',
    shippingInfo: '',
  });

  const [variantsList, setVariantsList] = useState<ProductVariant[]>([
    { name: 'Standard', price: 0, sku: '', stock: 10 },
  ]);

  const [imagesList, setImagesList] = useState<ProductImage[]>([]);
  const [specsList, setSpecsList] = useState<{ label: string; value: string }[]>([]);

  // Open modal functions
  const handleOpenCreate = () => {
    setError(null);
    setFormFields({
      name: '',
      slug: '',
      description: '',
      price: '',
      compareAtPrice: '',
      categoryId: categories[0]?.id || '',
      status: 'ACTIVE',
      sizeInfo: '',
      returnInfo: '',
      shippingInfo: '',
    });
    setVariantsList([{ name: 'Standard', price: 0, sku: '', stock: 10 }]);
    setImagesList([]);
    setSpecsList([]);
    setActiveModal('create');
  };

  const handleOpenEdit = (prod: Product) => {
    setError(null);
    setEditingProduct(prod);
    setFormFields({
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      price: prod.price.toString(),
      compareAtPrice: prod.compareAtPrice ? prod.compareAtPrice.toString() : '',
      categoryId: prod.categoryId,
      status: prod.status,
      sizeInfo: prod.sizeInfo || '',
      returnInfo: prod.returnInfo || '',
      shippingInfo: prod.shippingInfo || '',
    });
    setVariantsList(prod.variants.length > 0 ? prod.variants : [{ name: 'Standard', price: prod.price, sku: prod.sku, stock: 10 }]);
    setImagesList(prod.images);
    setSpecsList(prod.specifications ? JSON.parse(prod.specifications) : []);
    setActiveModal('edit');
  };

  const handleNameChange = (nameVal: string) => {
    const slugVal = nameVal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormFields((prev) => ({ ...prev, name: nameVal, slug: slugVal }));
  };

  // Image Upload helper
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

      const newImg: ProductImage = {
        url: data.asset.url,
        altText: file.name,
        isFeatured: imagesList.length === 0,
        order: imagesList.length,
      };

      setImagesList([...imagesList, newImg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Add sub-variants or specs
  const handleAddVariant = () => {
    setVariantsList([...variantsList, { name: '', price: parseFloat(formFields.price) || 0, sku: '', stock: 5 }]);
  };

  const handleRemoveVariant = (idx: number) => {
    setVariantsList(variantsList.filter((_, i) => i !== idx));
  };

  const handleAddSpec = () => {
    setSpecsList([...specsList, { label: '', value: '' }]);
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecsList(specsList.filter((_, i) => i !== idx));
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action is irreversible.')) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

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

    const payload = {
      ...formFields,
      price: parseFloat(formFields.price) || 0,
      compareAtPrice: formFields.compareAtPrice ? parseFloat(formFields.compareAtPrice) : null,
      specifications: specsList,
      variants: variantsList.map(v => ({ ...v, price: parseFloat(v.price.toString()) || 0 })),
      images: imagesList,
    };

    try {
      const isEdit = activeModal === 'edit';
      const endpoint = '/api/admin/products';
      const res = await fetch(endpoint, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: editingProduct?.id, ...payload } : payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      setActiveModal(null);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Heading Block */}
      <div className="flex justify-between items-center border-b border-stone-200 pb-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-serif text-stone-900 font-normal">Products Catalog</h2>
          <p className="text-stone-400">Add, edit, or adjust variants and sizes for active storefront products.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-accent text-accent-foreground text-xs uppercase tracking-wider font-semibold hover:bg-stone-900 hover:text-white transition rounded flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Products Table List */}
      <div className="bg-white border border-stone-200 rounded overflow-hidden shadow-sm">
        {products.length === 0 ? (
          <div className="p-12 text-center text-stone-400 space-y-2">
            <ShoppingBag className="w-8 h-8 mx-auto text-stone-300" />
            <p>No products registered. Click Add Product to seed inventory.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-550 uppercase text-[10px] tracking-wider font-semibold">
                <th className="p-4 pl-6">Product Details</th>
                <th className="p-4">SKU / Code</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Sizes</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-stone-50/50 transition">
                  <td className="p-4 pl-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-50 border border-stone-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {prod.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={prod.images[0].url} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-stone-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900 text-sm line-clamp-1">{prod.name}</h4>
                      <span className="text-[10px] text-stone-400 font-mono">{prod.slug}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono">{prod.sku || 'N/A'}</td>
                  <td className="p-4 font-mono font-semibold text-stone-900">₹{prod.price.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wide ${
                      prod.status === 'ACTIVE' ? 'bg-green-55 text-green-700' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="p-4">{prod.variants?.length || 0} variants</td>
                  <td className="p-4 text-right pr-6 space-x-2">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="p-1.5 border border-stone-200 hover:border-accent text-stone-500 hover:text-accent rounded transition inline-flex"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1.5 border border-stone-200 hover:border-red-500 text-stone-500 hover:text-red-500 rounded transition inline-flex"
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

      {/* Editor Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-250 rounded shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-serif text-stone-900 text-lg font-semibold">
                {activeModal === 'edit' ? `Edit Product: ${editingProduct?.name}` : 'Create New Product'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Error alerts */}
            {error && (
              <div className="m-5 p-4 bg-red-50 text-red-700 border border-red-200 rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-6 text-xs text-stone-600 font-light flex-1">
              
              {/* Product Basic Info */}
              <div className="space-y-4">
                <h4 className="font-serif text-stone-900 text-sm font-semibold uppercase tracking-wider border-b pb-1">
                  1. Basic Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-700 font-semibold uppercase block">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formFields.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal text-stone-850"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-700 font-semibold uppercase block">Product URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={formFields.slug}
                      onChange={(e) => setFormFields({ ...formFields, slug: e.target.value })}
                      className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal text-stone-850 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-700 font-semibold uppercase block">Category *</label>
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
                    <label className="text-stone-700 font-semibold uppercase block">Product Status</label>
                    <select
                      value={formFields.status}
                      onChange={(e) => setFormFields({ ...formFields, status: e.target.value })}
                      className="w-full border border-stone-300 p-2.5 bg-white rounded text-sm focus:outline-none focus:border-primary cursor-pointer font-normal text-stone-850"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-700 font-semibold uppercase block">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formFields.price}
                      onChange={(e) => setFormFields({ ...formFields, price: e.target.value })}
                      className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal text-stone-850 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-700 font-semibold uppercase block">Compare At Price (₹)</label>
                    <input
                      type="number"
                      value={formFields.compareAtPrice}
                      onChange={(e) => setFormFields({ ...formFields, compareAtPrice: e.target.value })}
                      className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal text-stone-850 font-mono"
                      placeholder="Original price for discount display"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase block">Description (HTML Block supported) *</label>
                  <textarea
                    required
                    rows={4}
                    value={formFields.description}
                    onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal text-stone-850 resize-none"
                  />
                </div>
              </div>

              {/* Media Uploader */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-serif text-stone-900 text-sm font-semibold uppercase tracking-wider border-b pb-1">
                  2. Image Assets Gallery
                </h4>
                
                <div className="flex flex-wrap gap-4 items-center">
                  {imagesList.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 border border-stone-200 rounded overflow-hidden bg-stone-50 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="product" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImagesList(imagesList.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {img.isFeatured && (
                        <div className="absolute bottom-0 inset-x-0 bg-primary/80 text-white text-[8px] text-center uppercase tracking-wide py-0.5">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Upload box */}
                  <label className="w-24 h-24 border-2 border-dashed border-stone-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-accent text-stone-400 hover:text-accent transition">
                    <Upload className="w-5 h-5 mb-1" />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Product Variants / Sizes */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center border-b pb-1">
                  <h4 className="font-serif text-stone-900 text-sm font-semibold uppercase tracking-wider">
                    3. Sizes & Inventory Variants
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-accent hover:text-primary font-semibold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Size
                  </button>
                </div>
                
                <div className="space-y-3">
                  {variantsList.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-4 space-y-1">
                        <label className="text-[10px] text-stone-500 font-semibold uppercase">Size Name (e.g. 500ml)</label>
                        <input
                          type="text"
                          required
                          value={v.name}
                          onChange={(e) => {
                            const updated = [...variantsList];
                            updated[idx].name = e.target.value;
                            setVariantsList(updated);
                          }}
                          className="w-full border border-stone-300 p-2 rounded focus:outline-none focus:border-primary font-normal"
                        />
                      </div>
                      <div className="col-span-3 space-y-1">
                        <label className="text-[10px] text-stone-500 font-semibold uppercase">Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={v.price}
                          onChange={(e) => {
                            const updated = [...variantsList];
                            updated[idx].price = parseFloat(e.target.value) || 0;
                            setVariantsList(updated);
                          }}
                          className="w-full border border-stone-300 p-2 rounded focus:outline-none focus:border-primary font-normal font-mono"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] text-stone-500 font-semibold uppercase">Inventory (Stock)</label>
                        <input
                          type="number"
                          required
                          value={v.stock}
                          onChange={(e) => {
                            const updated = [...variantsList];
                            updated[idx].stock = parseInt(e.target.value, 10) || 0;
                            setVariantsList(updated);
                          }}
                          className="w-full border border-stone-300 p-2 rounded focus:outline-none focus:border-primary font-normal font-mono"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] text-stone-500 font-semibold uppercase">SKU Code</label>
                        <input
                          type="text"
                          value={v.sku || ''}
                          onChange={(e) => {
                            const updated = [...variantsList];
                            updated[idx].sku = e.target.value || null;
                            setVariantsList(updated);
                          }}
                          className="w-full border border-stone-300 p-2 rounded focus:outline-none focus:border-primary font-normal font-mono"
                        />
                      </div>
                      <div className="col-span-1 text-center pb-1">
                        <button
                          type="button"
                          disabled={variantsList.length <= 1}
                          onClick={() => handleRemoveVariant(idx)}
                          className="text-stone-300 hover:text-red-650 p-1.5"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center border-b pb-1">
                  <h4 className="font-serif text-stone-900 text-sm font-semibold uppercase tracking-wider">
                    4. Technical Specifications
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-accent hover:text-primary font-semibold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>
                
                <div className="space-y-3">
                  {specsList.map((s, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-5 space-y-1">
                        <label className="text-[10px] text-stone-500 font-semibold uppercase">Label Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Origin"
                          value={s.label}
                          onChange={(e) => {
                            const updated = [...specsList];
                            updated[idx].label = e.target.value;
                            setSpecsList(updated);
                          }}
                          className="w-full border border-stone-300 p-2 rounded focus:outline-none"
                        />
                      </div>
                      <div className="col-span-6 space-y-1">
                        <label className="text-[10px] text-stone-500 font-semibold uppercase">Specification Value</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Pampore, Kashmir"
                          value={s.value}
                          onChange={(e) => {
                            const updated = [...specsList];
                            updated[idx].value = e.target.value;
                            setSpecsList(updated);
                          }}
                          className="w-full border border-stone-300 p-2 rounded focus:outline-none"
                        />
                      </div>
                      <div className="col-span-1 text-center pb-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(idx)}
                          className="text-stone-300 hover:text-red-650 p-1.5"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
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
                  <Check className="w-4 h-4" /> {loading ? 'Saving Changes...' : 'Save Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
