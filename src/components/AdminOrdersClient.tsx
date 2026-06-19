'use client';

import React, { useState } from 'react';
import { X, Search, FileText, CheckCircle2, Truck, Ban, Printer, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku: string | null;
}

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  orderNumber: string;
  guestEmail: string | null;
  status: string;
  totalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  couponCode: string | null;
  notes: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  createdAt: Date;
  shippingAddress: Address;
  items: OrderItem[];
}

export default function AdminOrdersClient({ orders }: { orders: Order[] }) {
  const router = useRouter();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Form parameters for status update
  const [statusVal, setStatusVal] = useState('');
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setStatusVal(order.status);
    setCarrier(order.carrier || '');
    setTrackingNumber(order.trackingNumber || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/actions?type=order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: statusVal,
          carrier,
          trackingNumber,
        }),
      });

      if (!res.ok) throw new Error('Failed to update order');
      
      const updatedOrder = { ...selectedOrder, status: statusVal, carrier, trackingNumber };
      setSelectedOrder(updatedOrder);
      router.refresh();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  // Filters
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-4 space-y-1">
        <h2 className="text-2xl font-serif text-stone-900 font-normal">Orders Fulfillment</h2>
        <p className="text-stone-400">Track shipments, dispatch parcel airway bills, and issue invoices.</p>
      </div>

      {/* Filter and Search Panel */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white border border-stone-200 p-4 rounded shadow-sm text-xs">
        <div className="flex flex-wrap gap-2 uppercase tracking-wider font-semibold">
          {['ALL', 'AWAITING_FULFILLMENT', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 border rounded transition ${
                filterStatus === st
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-stone-300 text-stone-700 hover:border-primary'
              }`}
            >
              {st === 'ALL' ? 'All Orders' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-white border border-stone-300 rounded overflow-hidden">
          <input
            type="text"
            placeholder="Search invoice or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 text-xs focus:outline-none w-48 font-normal"
          />
          <span className="p-2 border-l text-stone-400"><Search className="w-4 h-4" /></span>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="bg-white border border-stone-200 rounded overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-stone-450 space-y-2">
            <Receipt className="w-8 h-8 mx-auto text-stone-300" />
            <p>No orders matched your filters.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-550 uppercase text-[10px] tracking-wider font-semibold">
                <th className="p-4 pl-6">Order Number</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/50 transition">
                  <td className="p-4 pl-6 font-mono font-bold text-stone-900">{order.orderNumber}</td>
                  <td className="p-4 font-semibold text-stone-800">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </td>
                  <td className="p-4">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </td>
                  <td className="p-4 font-mono font-semibold text-stone-900">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                      order.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'SHIPPED'
                        ? 'bg-blue-50 text-blue-600'
                        : order.status === 'CANCELLED'
                        ? 'bg-red-50 text-red-650'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button
                      onClick={() => handleOpenDetail(order)}
                      className="text-primary hover:underline font-semibold uppercase text-[10px] tracking-wider inline-flex items-center gap-1"
                    >
                      Open Detail &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details drawer overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-end">
          <div className="bg-white w-full max-w-2xl h-full flex flex-col justify-between shadow-2xl animate-slide-left">
            
            {/* Header */}
            <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-accent font-semibold uppercase tracking-wider">Invoice Details</span>
                <h3 className="font-serif text-stone-900 text-lg font-bold font-mono">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 border border-stone-200 rounded hover:bg-stone-100 text-stone-500"
                  title="Print Invoice"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button onClick={() => setSelectedOrder(null)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-stone-600 font-light">
              
              {/* Status form updater */}
              <form onSubmit={handleUpdateStatus} className="bg-stone-50 border border-stone-200 rounded p-4 space-y-4">
                <h4 className="font-serif text-stone-900 text-xs font-semibold uppercase tracking-wider">Update Dispatch Status</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-stone-500">Status</label>
                    <select
                      value={statusVal}
                      onChange={(e) => setStatusVal(e.target.value)}
                      className="w-full border border-stone-300 p-2 bg-white rounded text-stone-850 font-normal focus:outline-none"
                    >
                      <option value="AWAITING_FULFILLMENT">Awaiting Fulfillment</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-stone-500">Carrier Partner</label>
                    <input
                      type="text"
                      placeholder="e.g. BlueDart"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full border border-stone-300 p-2 rounded text-stone-850 font-normal focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-stone-500">Waybill / Tracking ID</label>
                    <input
                      type="text"
                      placeholder="e.g. BD98210398"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full border border-stone-300 p-2 rounded text-stone-850 font-normal focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-white text-[10px] uppercase tracking-wider font-semibold rounded hover:bg-stone-850 transition"
                  >
                    {loading ? 'Saving...' : 'Update status'}
                  </button>
                </div>
              </form>

              {/* Items Table */}
              <div className="space-y-3">
                <h4 className="font-serif text-stone-900 text-xs font-semibold uppercase tracking-wider border-b pb-1">Line Items</h4>
                <div className="border border-stone-200 rounded overflow-hidden divide-y divide-stone-150">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-serif font-semibold text-stone-900">{item.name}</span>
                        <span className="text-[9px] text-stone-400 block mt-0.5">Qty: {item.quantity} | SKU: {item.sku || 'N/A'}</span>
                      </div>
                      <span className="font-mono text-stone-900 font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination Address */}
              <div className="space-y-3">
                <h4 className="font-serif text-stone-900 text-xs font-semibold uppercase tracking-wider border-b pb-1">Shipping Destination</h4>
                <div className="space-y-1 bg-stone-50 p-4 border rounded leading-relaxed">
                  <p className="font-semibold text-stone-850">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                  <p>{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}</p>
                  <p className="text-[10px] text-stone-400 pt-1">Phone: {selectedOrder.shippingAddress.phone} | Email: {selectedOrder.shippingAddress.email}</p>
                </div>
              </div>

              {/* Customer Notes */}
              {selectedOrder.notes && (
                <div className="space-y-2">
                  <h4 className="font-serif text-stone-900 text-xs font-semibold uppercase tracking-wider">Customer Delivery Notes</h4>
                  <div className="p-3 bg-amber-50/50 border border-amber-100 text-stone-700 italic rounded">
                    &ldquo;{selectedOrder.notes}&rdquo;
                  </div>
                </div>
              )}

              {/* Invoicing summary details */}
              <div className="space-y-3 pt-2">
                <h4 className="font-serif text-stone-900 text-xs font-semibold uppercase tracking-wider border-b pb-1">Invoice Receipt Summary</h4>
                <div className="space-y-2 text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-stone-900">₹{(selectedOrder.totalAmount + selectedOrder.discountAmount - selectedOrder.shippingAmount).toLocaleString('en-IN')}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount ({selectedOrder.couponCode})</span>
                      <span className="font-mono">- ₹{selectedOrder.discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span className="font-mono text-stone-900">₹{selectedOrder.shippingAmount}</span>
                  </div>
                  <div className="border-t border-stone-250 pt-3 flex justify-between items-baseline font-serif text-stone-900">
                    <span className="font-semibold text-xs">Grand Total</span>
                    <span className="text-lg font-bold font-mono">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
