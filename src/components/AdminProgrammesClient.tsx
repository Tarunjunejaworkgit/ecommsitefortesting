'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash, X, Upload, Check, AlertCircle, Calendar, Users, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  notes: string | null;
  createdAt: Date;
}

interface Programme {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage: string | null;
  startDate: Date;
  endDate: Date | null;
  location: string;
  status: string;
  maxRegistrations: number | null;
  price: number;
  registrations: Registration[];
}

export default function AdminProgrammesClient({ programmes }: { programmes: Programme[] }) {
  const router = useRouter();

  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'roster' | null>(null);
  const [editingProg, setEditingProg] = useState<Programme | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [formFields, setFormFields] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    featuredImage: '',
    startDate: '',
    endDate: '',
    location: '',
    status: 'DRAFT',
    maxRegistrations: '',
    price: '',
  });

  const handleOpenCreate = () => {
    setError(null);
    setFormFields({
      title: '',
      slug: '',
      description: '',
      content: '',
      featuredImage: '',
      startDate: '',
      endDate: '',
      location: '',
      status: 'DRAFT',
      maxRegistrations: '50',
      price: '0',
    });
    setActiveModal('create');
  };

  const handleOpenEdit = (prog: Programme) => {
    setError(null);
    setEditingProg(prog);
    
    // Format dates for datetime-local input fields (YYYY-MM-DDTHH:MM)
    const startStr = new Date(prog.startDate).toISOString().substring(0, 16);
    const endStr = prog.endDate ? new Date(prog.endDate).toISOString().substring(0, 16) : '';

    setFormFields({
      title: prog.title,
      slug: prog.slug,
      description: prog.description,
      content: prog.content,
      featuredImage: prog.featuredImage || '',
      startDate: startStr,
      endDate: endStr,
      location: prog.location,
      status: prog.status,
      maxRegistrations: prog.maxRegistrations ? prog.maxRegistrations.toString() : '',
      price: prog.price.toString(),
    });
    setActiveModal('edit');
  };

  const handleOpenRoster = (prog: Programme) => {
    setEditingProg(prog);
    setActiveModal('roster');
  };

  const handleTitleChange = (val: string) => {
    const slugVal = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormFields((prev) => ({ ...prev, title: val, slug: slugVal }));
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
      setFormFields((prev) => ({ ...prev, featuredImage: data.asset.url }));
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this programme? All registrations will be removed.')) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/actions?type=programme&id=${id}`, {
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
      const res = await fetch('/api/admin/actions?type=programme', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: editingProg?.id, ...formFields } : formFields),
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
          <h2 className="text-2xl font-serif text-stone-900 font-normal">Programmes Schedule</h2>
          <p className="text-stone-400">Schedule holistic wellness workshops, copper forging events, and retrieve reservation lists.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-accent text-accent-foreground text-xs uppercase tracking-wider font-semibold hover:bg-stone-900 transition rounded flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Programme
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-white border border-stone-200 rounded overflow-hidden shadow-sm">
        {programmes.length === 0 ? (
          <div className="p-12 text-center text-stone-450 space-y-2">
            <Calendar className="w-8 h-8 mx-auto text-stone-300" />
            <p>No programmes registered yet. Click Add Programme to schedule.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-550 uppercase text-[10px] tracking-wider font-semibold">
                <th className="p-4 pl-6">Title</th>
                <th className="p-4">Schedule Date</th>
                <th className="p-4">Location</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Fee</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150">
              {programmes.map((p) => {
                const dateStr = new Date(p.startDate).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={p.id} className="hover:bg-stone-50/50 transition">
                    <td className="p-4 pl-6">
                      <h4 className="font-semibold text-stone-900 text-sm line-clamp-1">{p.title}</h4>
                      <span className={`px-1.5 py-0.2 bg-stone-100 rounded text-[8px] font-bold tracking-wide uppercase ${
                        p.status === 'ACTIVE' ? 'text-green-700 bg-green-50' : 'text-stone-500'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-medium text-stone-850">{dateStr}</td>
                    <td className="p-4 flex items-center gap-1 mt-3.5 border-0 text-stone-500 truncate max-w-[150px]">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{p.location}</span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleOpenRoster(p)}
                        className="text-primary hover:underline font-semibold flex items-center gap-1.5"
                      >
                        <Users className="w-4 h-4 text-accent" />
                        <span>{p.registrations?.length || 0} / {p.maxRegistrations || '∞'} booked</span>
                      </button>
                    </td>
                    <td className="p-4 font-mono font-semibold text-stone-900">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-right pr-6 space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 border border-stone-200 hover:border-accent text-stone-550 rounded transition inline-flex"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 border border-stone-200 hover:border-red-500 text-stone-550 rounded transition inline-flex"
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
      {(activeModal === 'create' || activeModal === 'edit') && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-250 rounded shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
            
            <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-serif text-stone-900 text-lg font-semibold">
                {activeModal === 'edit' ? 'Edit Programme' : 'Schedule Programme'}
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
                  <label className="text-stone-700 font-semibold uppercase">Programme Title *</label>
                  <input
                    type="text"
                    required
                    value={formFields.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary text-stone-850 font-normal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formFields.slug}
                    onChange={(e) => setFormFields({ ...formFields, slug: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-mono text-stone-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formFields.startDate}
                    onChange={(e) => setFormFields({ ...formFields, startDate: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formFields.endDate}
                    onChange={(e) => setFormFields({ ...formFields, endDate: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Location *</label>
                  <input
                    type="text"
                    required
                    value={formFields.location}
                    onChange={(e) => setFormFields({ ...formFields, location: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none text-stone-850 font-normal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Max Seats (Capacity)</label>
                  <input
                    type="number"
                    value={formFields.maxRegistrations}
                    onChange={(e) => setFormFields({ ...formFields, maxRegistrations: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Admission Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formFields.price}
                    onChange={(e) => setFormFields({ ...formFields, price: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Publishing Status</label>
                  <select
                    value={formFields.status}
                    onChange={(e) => setFormFields({ ...formFields, status: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 bg-white rounded text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-700 font-semibold uppercase">Short Summary Description *</label>
                <input
                  type="text"
                  required
                  value={formFields.description}
                  onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-stone-700 font-semibold uppercase block">Cover Image *</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    required
                    value={formFields.featuredImage}
                    onChange={(e) => setFormFields({ ...formFields, featuredImage: e.target.value })}
                    className="flex-grow border border-stone-300 p-2 rounded focus:outline-none font-normal text-stone-850"
                  />
                  <label className="px-4 py-2 border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded cursor-pointer transition flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-700 font-semibold uppercase block">Full details content *</label>
                <textarea
                  required
                  rows={6}
                  value={formFields.content}
                  onChange={(e) => setFormFields({ ...formFields, content: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none resize-none font-normal text-stone-850"
                />
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
                  <Check className="w-4 h-4" /> Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Roster Modal */}
      {activeModal === 'roster' && editingProg && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-250 rounded shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            
            <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-accent font-semibold uppercase tracking-wider">Attendee Roster</span>
                <h3 className="font-serif text-stone-900 text-base font-bold">{editingProg.title}</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {editingProg.registrations?.length === 0 ? (
                <div className="p-12 text-center text-stone-400">
                  No bookings registered for this workshop yet.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-550 uppercase text-[9px] tracking-wider font-semibold">
                      <th className="p-3 pl-4">Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Registration Date</th>
                      <th className="p-3 pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-150">
                    {editingProg.registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-stone-50/50 transition">
                        <td className="p-3 pl-4 font-semibold text-stone-800">{reg.firstName} {reg.lastName}</td>
                        <td className="p-3">{reg.email}</td>
                        <td className="p-3 font-mono">{reg.phone}</td>
                        <td className="p-3">
                          {new Date(reg.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </td>
                        <td className="p-3 pr-4">
                          <span className={`px-2 py-0.5 rounded font-bold text-[8px] uppercase tracking-wide ${
                            reg.status === 'CONFIRMED' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
