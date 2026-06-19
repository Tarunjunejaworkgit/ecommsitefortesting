'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash, X, Upload, Check, AlertCircle, Tag, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Deal {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  discountValue: number;
  discountType: string;
  code: string | null;
  bannerImage: string | null;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export default function AdminDealsClient({ deals }: { deals: Deal[] }) {
  const router = useRouter();

  const [activeModal, setActiveModal] = useState<'create' | 'edit' | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [formFields, setFormFields] = useState({
    title: '',
    subtitle: '',
    description: '',
    discountValue: '',
    discountType: 'PERCENTAGE',
    code: '',
    bannerImage: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const handleOpenCreate = () => {
    setError(null);
    setFormFields({
      title: '',
      subtitle: '',
      description: '',
      discountValue: '15',
      discountType: 'PERCENTAGE',
      code: '',
      bannerImage: '',
      startDate: new Date().toISOString().substring(0, 16),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().substring(0, 16),
      isActive: true,
    });
    setActiveModal('create');
  };

  const handleOpenEdit = (deal: Deal) => {
    setError(null);
    setEditingDeal(deal);
    
    const startStr = new Date(deal.startDate).toISOString().substring(0, 16);
    const endStr = new Date(deal.endDate).toISOString().substring(0, 16);

    setFormFields({
      title: deal.title,
      subtitle: deal.subtitle || '',
      description: deal.description || '',
      discountValue: deal.discountValue.toString(),
      discountType: deal.discountType,
      code: deal.code || '',
      bannerImage: deal.bannerImage || '',
      startDate: startStr,
      endDate: endStr,
      isActive: deal.isActive,
    });
    setActiveModal('edit');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFormFields((prev) => ({ ...prev, bannerImage: data.asset.url }));
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/actions?type=deal&id=${id}`, {
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
      const res = await fetch('/api/admin/actions?type=deal', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: editingDeal?.id, ...formFields } : formFields),
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
          <h2 className="text-2xl font-serif text-stone-900 font-normal">Deals & Coupons</h2>
          <p className="text-stone-400">Launch marketing campaigns, specify percentage discounts, and configure checkout coupon codes.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-accent text-accent-foreground text-xs uppercase tracking-wider font-semibold hover:bg-stone-900 transition rounded flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Offer
        </button>
      </div>

      {/* Grid table */}
      <div className="bg-white border border-stone-200 rounded overflow-hidden shadow-sm">
        {deals.length === 0 ? (
          <div className="p-12 text-center text-stone-450 space-y-2">
            <Tag className="w-8 h-8 mx-auto text-stone-300" />
            <p>No promo deals active. Click Add Offer to start a campaign.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-550 uppercase text-[10px] tracking-wider font-semibold">
                <th className="p-4 pl-6">Campaign Info</th>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Value</th>
                <th className="p-4">Validity Range</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150">
              {deals.map((deal) => {
                const datesRange = `${new Date(deal.startDate).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                })} - ${new Date(deal.endDate).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: '2-digit',
                })}`;

                return (
                  <tr key={deal.id} className="hover:bg-stone-50/50 transition">
                    <td className="p-4 pl-6">
                      <h4 className="font-semibold text-stone-900 text-sm line-clamp-1">{deal.title}</h4>
                      <span className="text-[10px] text-stone-400 font-light">{deal.subtitle || 'No subtitle'}</span>
                    </td>
                    <td className="p-4">
                      {deal.code ? (
                        <span className="font-mono bg-stone-100 px-2 py-0.5 rounded font-bold text-stone-850">
                          {deal.code}
                        </span>
                      ) : (
                        <span className="text-stone-450 italic">Automatic Discount</span>
                      )}
                    </td>
                    <td className="p-4 font-mono font-semibold text-stone-850">
                      {deal.discountType === 'PERCENTAGE' ? `${deal.discountValue}% Off` : `₹${deal.discountValue} Off`}
                    </td>
                    <td className="p-4 flex items-center gap-1 mt-4.5 border-0 text-stone-500 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{datesRange}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wide ${
                        deal.isActive ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {deal.isActive ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6 space-x-2">
                      <button
                        onClick={() => handleOpenEdit(deal)}
                        className="p-1.5 border border-stone-200 hover:border-accent text-stone-500 rounded transition inline-flex"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(deal.id)}
                        className="p-1.5 border border-stone-200 hover:border-red-500 text-stone-500 rounded transition inline-flex"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Editor Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-250 rounded shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
            
            <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-serif text-stone-900 text-lg font-semibold">
                {activeModal === 'edit' ? 'Edit Coupon Campaign' : 'Create Coupon Campaign'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="m-5 p-4 bg-red-50 text-red-700 border rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="p-6 space-y-6 text-xs text-stone-600 font-light flex-1">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Campaign Title *</label>
                  <input
                    type="text"
                    required
                    value={formFields.title}
                    onChange={(e) => setFormFields({ ...formFields, title: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary text-stone-850 font-normal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Coupon Key (Checkout Code)</label>
                  <input
                    type="text"
                    value={formFields.code}
                    onChange={(e) => setFormFields({ ...formFields, code: e.target.value.toUpperCase() })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-mono text-stone-850 font-bold tracking-widest"
                    placeholder="e.g. MOKSHAY15"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={formFields.discountValue}
                    onChange={(e) => setFormFields({ ...formFields, discountValue: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Discount Unit</label>
                  <select
                    value={formFields.discountType}
                    onChange={(e) => setFormFields({ ...formFields, discountType: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 bg-white rounded text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="PERCENTAGE">Percentage (%) Off</option>
                    <option value="FIXED">Flat Rate (₹) Off</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Start Validity Date *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formFields.startDate}
                    onChange={(e) => setFormFields({ ...formFields, startDate: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">End Expiry Date *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formFields.endDate}
                    onChange={(e) => setFormFields({ ...formFields, endDate: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-700 font-semibold uppercase">Subtitle Description</label>
                <input
                  type="text"
                  value={formFields.subtitle}
                  onChange={(e) => setFormFields({ ...formFields, subtitle: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none"
                  placeholder="e.g. Receive 15% off on your first order"
                />
              </div>

              <div className="space-y-2">
                <label className="text-stone-700 font-semibold uppercase block">Banner Image Background</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={formFields.bannerImage}
                    onChange={(e) => setFormFields({ ...formFields, bannerImage: e.target.value })}
                    className="flex-grow border border-stone-300 p-2 rounded focus:outline-none font-normal text-stone-850"
                  />
                  <label className="px-4 py-2 border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded cursor-pointer transition flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="flex gap-4 p-3 bg-stone-50 border rounded text-xs items-center text-stone-700">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formFields.isActive}
                  onChange={(e) => setFormFields({ ...formFields, isActive: e.target.checked })}
                  className="w-4 h-4 cursor-pointer focus:ring-primary text-primary"
                />
                <label htmlFor="isActive" className="cursor-pointer select-none font-semibold uppercase tracking-wider">
                  Campaign status is Active and available at checkout
                </label>
              </div>

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
                  <Check className="w-4 h-4" /> Save Offer
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
