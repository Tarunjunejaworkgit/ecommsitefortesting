'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Phone, 
  Mail, 
  Building, 
  Inbox, 
  CheckCircle2, 
  Clock, 
  User, 
  AlertCircle, 
  FileEdit, 
  Trash2, 
  ChevronRight, 
  X,
  Package
} from 'lucide-react';

interface BulkPurchaseLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string | null;
  quantity: number;
  productOfInterest: string;
  enquiryType: string;
  message: string;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminLeadsClient({ leads }: { leads: BulkPurchaseLead[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  
  // Selection/Detail View state
  const [selectedLead, setSelectedLead] = useState<BulkPurchaseLead | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Note/Status fields for editing
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const handleOpenLead = (lead: BulkPurchaseLead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditNotes(lead.notes || '');
    setError(null);
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/actions?type=lead', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLead.id,
          status: editStatus,
          notes: editNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update lead');

      // Update selected state locally and refresh server component
      setSelectedLead({
        ...selectedLead,
        status: editStatus,
        notes: editNotes,
        updatedAt: new Date(),
      });
      
      setIsUpdating(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error updating lead');
      setIsUpdating(false);
    }
  };

  // Filter & Search computation
  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      (lead.companyName && lead.companyName.toLowerCase().includes(query)) ||
      lead.productOfInterest.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || lead.enquiryType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate status statistics
  const totalCount = leads.length;
  const newCount = leads.filter(l => l.status === 'NEW').length;
  const inProgressCount = leads.filter(l => l.status === 'IN_PROGRESS').length;
  const contactedCount = leads.filter(l => l.status === 'CONTACTED').length;
  const closedCount = leads.filter(l => l.status === 'CLOSED').length;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CONTACTED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'CLOSED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'SPAM':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-stone-200 pb-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-serif text-stone-900 font-normal">B2B & Wholesale Leads</h2>
          <p className="text-stone-400">Manage incoming bulk purchases, custom corporate gifting inquiries, and wholesale distribution requests.</p>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-stone-200 p-4 rounded shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-stone-100 text-stone-700 rounded">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-stone-400 uppercase font-semibold">Total Leads</div>
            <div className="text-lg font-serif text-stone-900 font-semibold">{totalCount}</div>
          </div>
        </div>
        <div className="bg-white border border-stone-250 p-4 rounded shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-stone-400 uppercase font-semibold">New Enquiries</div>
            <div className="text-lg font-serif text-blue-700 font-semibold">{newCount}</div>
          </div>
        </div>
        <div className="bg-white border border-stone-250 p-4 rounded shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-stone-400 uppercase font-semibold">In Progress</div>
            <div className="text-lg font-serif text-amber-700 font-semibold">{inProgressCount}</div>
          </div>
        </div>
        <div className="bg-white border border-stone-250 p-4 rounded shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-700 rounded">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-stone-400 uppercase font-semibold">Contacted</div>
            <div className="text-lg font-serif text-purple-700 font-semibold">{contactedCount}</div>
          </div>
        </div>
        <div className="bg-white border border-stone-250 p-4 rounded shadow-sm flex items-center gap-3 col-span-2 lg:col-span-1">
          <div className="p-2.5 bg-green-50 text-green-700 rounded">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-stone-400 uppercase font-semibold">Closed Deals</div>
            <div className="text-lg font-serif text-green-700 font-semibold">{closedCount}</div>
          </div>
        </div>
      </div>

      {/* Control panel & Table */}
      <div className="bg-white border border-stone-200 rounded overflow-hidden shadow-sm">
        
        {/* Filters */}
        <div className="p-4 border-b border-stone-200 bg-stone-50/55 flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search leads by name, email, company, product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-300 pl-10 pr-4 py-2 rounded text-xs focus:outline-none focus:border-primary text-stone-850"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-stone-300 px-3 py-2 rounded">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-[11px] font-medium text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CONTACTED">Contacted</option>
                <option value="CLOSED">Closed</option>
                <option value="SPAM">Spam</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-stone-300 px-3 py-2 rounded">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent text-[11px] font-medium text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="WHOLESALE">Wholesale</option>
                <option value="CORPORATE">Corporate Gifting</option>
                <option value="BULK_REQUEST">Bulk Request</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lead Table */}
        <div className="overflow-x-auto">
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-stone-450 space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-stone-300" />
              <p>No business leads match your filter parameters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-550 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="p-4 pl-6">Company / Enquirer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Desired Product</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-stone-50/50 transition">
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-stone-900 text-sm">{lead.name}</div>
                      {lead.companyName ? (
                        <div className="flex items-center gap-1 text-[10px] text-stone-400 font-light mt-0.5">
                          <Building className="w-3 h-3" />
                          <span>{lead.companyName}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-stone-400 font-light italic mt-0.5">Individual</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-stone-700 flex items-center gap-1 font-mono text-[11px]">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="text-stone-400 flex items-center gap-1 font-mono text-[10px] mt-0.5">
                        <Phone className="w-3 h-3 text-stone-350" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-stone-850 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                        {lead.productOfInterest}
                      </span>
                      <div className="text-[9px] text-accent uppercase font-bold tracking-wide mt-1">
                        {lead.enquiryType}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-stone-800">
                      {lead.quantity} units
                    </td>
                    <td className="p-4 text-stone-500 font-medium">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wide font-bold ${getStatusBadgeClass(lead.status)}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button
                        onClick={() => handleOpenLead(lead)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-primary hover:text-white rounded border border-stone-250 hover:border-primary text-stone-750 text-[10px] font-semibold tracking-wider uppercase transition inline-flex items-center gap-1"
                      >
                        Details <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Details / Review Drawer Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-250 rounded shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            
            <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between sticky top-0 z-10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-accent block">Lead Details</span>
                <h3 className="font-serif text-stone-900 text-lg font-semibold">{selectedLead.name}</h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="m-5 p-4 bg-red-50 text-red-700 border rounded flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-6 space-y-6 text-xs text-stone-600 font-light flex-1">
              
              {/* Primary Grid info */}
              <div className="grid grid-cols-2 gap-4 border-b border-stone-150 pb-5">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">Company Profile</span>
                  <div className="flex items-center gap-2 text-stone-850 text-sm font-semibold">
                    <Building className="w-4 h-4 text-stone-400" />
                    <span>{selectedLead.companyName || 'Individual Buyer'}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">Enquiry Type</span>
                  <div className="text-stone-850 text-sm font-semibold uppercase tracking-wider text-accent">
                    {selectedLead.enquiryType}
                  </div>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">Email Address</span>
                  <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 text-primary font-mono text-[11px] hover:underline">
                    <Mail className="w-4 h-4 text-stone-400" />
                    <span>{selectedLead.email}</span>
                  </a>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">Phone Connection</span>
                  <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2 text-stone-800 font-mono text-[11px] hover:underline">
                    <Phone className="w-4 h-4 text-stone-400" />
                    <span>{selectedLead.phone}</span>
                  </a>
                </div>
              </div>

              {/* Product and quantities */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-stone-200 text-stone-700 rounded">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">Product Requested</div>
                    <div className="font-semibold text-stone-900 text-sm">{selectedLead.productOfInterest}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Target Quantity</div>
                  <div className="font-mono text-sm font-bold text-stone-800">{selectedLead.quantity} Units</div>
                </div>
              </div>

              {/* Message content */}
              <div className="space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Customer Message / Inquiry Scope</span>
                <div className="bg-stone-50 border border-stone-200 p-4 rounded text-stone-800 leading-relaxed font-normal whitespace-pre-wrap">
                  {selectedLead.message}
                </div>
              </div>

              {/* Actions Form */}
              <form onSubmit={handleSaveLead} className="border-t border-stone-200 pt-5 space-y-4">
                <h4 className="font-serif text-stone-900 text-sm font-semibold">Staff Administrative Actions</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-700 font-semibold uppercase">Lead pipeline Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full border border-stone-300 p-2.5 bg-white rounded text-sm focus:outline-none cursor-pointer text-stone-850 font-normal"
                    >
                      <option value="NEW">New Enquirer</option>
                      <option value="IN_PROGRESS">In Progress (Evaluating)</option>
                      <option value="CONTACTED">Contacted (Emailed/Called)</option>
                      <option value="CLOSED">Closed (Converted / Signed)</option>
                      <option value="SPAM">Spam (Mark / Disregard)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-700 font-semibold uppercase">Last Updated Time</label>
                    <div className="bg-stone-100 p-2.5 border rounded text-stone-500 font-mono text-sm">
                      {new Date(selectedLead.updatedAt).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase">Internal Staff Notes</label>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full border border-stone-300 p-3 rounded text-sm focus:outline-none text-stone-850 font-normal"
                    placeholder="Write details of conversations, price quotes, discount offers, or follow-up schedules..."
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t">
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="px-5 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold uppercase rounded tracking-wider"
                  >
                    Close Panel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2.5 bg-primary hover:bg-stone-850 text-white font-semibold uppercase rounded tracking-wider disabled:bg-stone-300 flex items-center gap-1.5 transition"
                  >
                    Save Modifications
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
