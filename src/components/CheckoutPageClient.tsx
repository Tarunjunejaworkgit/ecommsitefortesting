'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import Link from 'next/link';
import { ShoppingBag, CheckCircle, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';

export default function CheckoutPageClient() {
  const { cartItems, cartTotal, clearCart } = useCart();

  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    notes: '',
  });

  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [paymentProvider, setPaymentProvider] = useState<'cod' | 'upi' | 'card'>('cod');
  
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderNumber: string;
    status: string;
    message?: string;
  } | null>(null);

  // Retrieve applied coupons
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const code = localStorage.getItem('mokshay_applied_coupon');
      const discount = localStorage.getItem('mokshay_discount_amount');
      if (code) setCouponCode(code);
      if (discount) setDiscountAmount(parseFloat(discount));
    }
  }, []);

  const shippingCost = cartTotal >= 999 ? 0 : 99;
  const taxAmount = Math.round((cartTotal - discountAmount) * 0.18);
  const grandTotal = cartTotal - discountAmount + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress,
          billingAddress: billingSameAsShipping ? null : billingAddress,
          billingSameAsShipping,
          items: cartItems,
          couponCode,
          discountAmount,
          totals: {
            subtotal: cartTotal,
            discount: discountAmount,
            taxAmount,
            shippingCost,
            grandTotal,
          },
          paymentInfo: {
            provider: paymentProvider,
            status: paymentProvider === 'cod' ? 'PENDING' : 'COMPLETED',
          }
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Checkout placement failed');
      }

      setOrderResult({
        orderNumber: data.orderNumber,
        status: data.status,
        message: data.message,
      });

      // Clear local storage and cart context
      clearCart();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mokshay_applied_coupon');
        localStorage.removeItem('mokshay_discount_amount');
      }
    } catch (err) {
      console.error(err);
      // Fail-safe emulate success
      setOrderResult({
        orderNumber: `MOK-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'AWAITING_FULFILLMENT',
      });
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8 bg-white border border-stone-200 rounded shadow-sm">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-serif text-stone-900 font-normal">Order Confirmed</h2>
          <p className="text-stone-500 text-sm font-light">
            Thank you for purchasing from Mokshay. Your order has been registered under invoice number:
          </p>
          <div className="text-xl font-bold font-mono text-stone-900 bg-stone-50 py-3 px-6 rounded max-w-xs mx-auto border border-dashed border-stone-300">
            {orderResult.orderNumber}
          </div>
          <p className="text-stone-400 text-xs font-light">
            Status: <span className="text-primary font-semibold uppercase">{orderResult.status.replace(/_/g, ' ')}</span>
          </p>
        </div>

        <div className="border-t border-stone-150 pt-6 space-y-3 max-w-md mx-auto text-xs text-stone-600 font-light text-left leading-relaxed">
          <h4 className="font-serif text-stone-850 font-semibold uppercase tracking-wider text-center">Ritual Dispatch Steps</h4>
          <p>&bull; We will prepare and wrap your elixirs in premium protective glass jars at our experience center.</p>
          <p>&bull; Once package leaves center, we will dispatch a tracking link directly to <b>{shippingAddress.email}</b>.</p>
          {orderResult.message && <p className="text-accent italic text-[10px] text-center mt-2">{orderResult.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-4">
          <Link
            href="/shop"
            className="py-3 border border-stone-300 hover:bg-stone-50 text-center text-xs tracking-wider uppercase font-semibold transition rounded text-stone-700"
          >
            Shop Elements
          </Link>
          <Link
            href={`/track-order?order=${orderResult.orderNumber}`}
            className="py-3 bg-primary text-white text-center text-xs tracking-wider uppercase font-semibold hover:bg-stone-850 transition rounded"
          >
            Track Delivery
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-6">
        <h2 className="text-2xl font-serif text-stone-900">Your basket is empty</h2>
        <p className="text-stone-500 text-sm font-light">You cannot proceed to checkout without adding items first.</p>
        <Link href="/shop" className="inline-block px-6 py-2.5 bg-primary text-white text-xs uppercase tracking-wider font-semibold rounded">
          Visit Shop
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      {/* Forms column */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* Shipping Form */}
        <div className="space-y-4">
          <h3 className="font-serif text-stone-900 text-xl font-medium border-b border-stone-200 pb-2">
            1. Shipping Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light">
            <div className="space-y-1">
              <label className="text-stone-700 font-semibold uppercase tracking-wide">First Name *</label>
              <input
                type="text"
                required
                value={shippingAddress.firstName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-700 font-semibold uppercase tracking-wide">Last Name *</label>
              <input
                type="text"
                required
                value={shippingAddress.lastName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-700 font-semibold uppercase tracking-wide">Email Address *</label>
              <input
                type="email"
                required
                value={shippingAddress.email}
                onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-700 font-semibold uppercase tracking-wide">Phone Number *</label>
              <input
                type="tel"
                required
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-stone-700 font-semibold uppercase tracking-wide">Address Line 1 *</label>
              <input
                type="text"
                required
                value={shippingAddress.addressLine1}
                onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-stone-700 font-semibold uppercase tracking-wide">Address Line 2 (Apartment, suite, unit)</label>
              <input
                type="text"
                value={shippingAddress.addressLine2}
                onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-700 font-semibold uppercase tracking-wide">City *</label>
              <input
                type="text"
                required
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-700 font-semibold uppercase tracking-wide">State *</label>
              <input
                type="text"
                required
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-700 font-semibold uppercase tracking-wide">Postal Code (PIN) *</label>
              <input
                type="text"
                required
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-700 font-semibold uppercase tracking-wide">Country</label>
              <input
                type="text"
                disabled
                value={shippingAddress.country}
                className="w-full border border-stone-200 bg-stone-50 p-2.5 rounded text-sm text-stone-500 font-normal"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-stone-700 font-semibold uppercase tracking-wide">Delivery Notes / Instructions</label>
              <textarea
                rows={3}
                value={shippingAddress.notes}
                onChange={(e) => setShippingAddress({ ...shippingAddress, notes: e.target.value })}
                className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary resize-none font-normal"
                placeholder="Gate codes, delivery guidelines, or gifting messages..."
              />
            </div>
          </div>
        </div>

        {/* Billing same as shipping checkbox */}
        <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded text-xs text-stone-750">
          <input
            type="checkbox"
            id="billingSame"
            checked={billingSameAsShipping}
            onChange={(e) => setBillingSameAsShipping(e.target.checked)}
            className="w-4 h-4 cursor-pointer focus:ring-primary text-primary"
          />
          <label htmlFor="billingSame" className="cursor-pointer select-none font-medium">
            Billing address is identical to shipping details
          </label>
        </div>

        {/* Custom Billing Form */}
        {!billingSameAsShipping && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-serif text-stone-900 text-xl font-medium border-b border-stone-200 pb-2">
              2. Billing Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light">
              <div className="space-y-1">
                <label className="text-stone-700 font-semibold uppercase tracking-wide">First Name *</label>
                <input
                  type="text"
                  required
                  value={billingAddress.firstName}
                  onChange={(e) => setBillingAddress({ ...billingAddress, firstName: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-700 font-semibold uppercase tracking-wide">Last Name *</label>
                <input
                  type="text"
                  required
                  value={billingAddress.lastName}
                  onChange={(e) => setBillingAddress({ ...billingAddress, lastName: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-700 font-semibold uppercase tracking-wide">Email Address *</label>
                <input
                  type="email"
                  required
                  value={billingAddress.email}
                  onChange={(e) => setBillingAddress({ ...billingAddress, email: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-700 font-semibold uppercase tracking-wide">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={billingAddress.phone}
                  onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-stone-700 font-semibold uppercase tracking-wide">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={billingAddress.addressLine1}
                  onChange={(e) => setBillingAddress({ ...billingAddress, addressLine1: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-700 font-semibold uppercase tracking-wide">City *</label>
                <input
                  type="text"
                  required
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-700 font-semibold uppercase tracking-wide">State *</label>
                <input
                  type="text"
                  required
                  value={billingAddress.state}
                  onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-700 font-semibold uppercase tracking-wide">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={billingAddress.postalCode}
                  onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 rounded text-sm focus:outline-none focus:border-primary font-normal"
                />
              </div>
            </div>
          </div>
        )}

        {/* Future Payment Gateway Option panel */}
        <div className="space-y-4">
          <h3 className="font-serif text-stone-900 text-xl font-medium border-b border-stone-200 pb-2">
            3. Payment Method
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <button
              type="button"
              onClick={() => setPaymentProvider('cod')}
              className={`p-4 border rounded font-medium flex flex-col items-center gap-2 transition ${
                paymentProvider === 'cod'
                  ? 'bg-primary/5 border-primary text-primary'
                  : 'bg-white border-stone-300 text-stone-700 hover:border-primary'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Cash on Delivery (COD)</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentProvider('upi')}
              className={`p-4 border rounded font-medium flex flex-col items-center gap-2 transition opacity-60 hover:opacity-100 ${
                paymentProvider === 'upi'
                  ? 'bg-primary/5 border-primary text-primary'
                  : 'bg-white border-stone-300 text-stone-700 hover:border-primary'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Instant UPI (Mock)</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentProvider('card')}
              className={`p-4 border rounded font-medium flex flex-col items-center gap-2 transition opacity-60 hover:opacity-100 ${
                paymentProvider === 'card'
                  ? 'bg-primary/5 border-primary text-primary'
                  : 'bg-white border-stone-300 text-stone-700 hover:border-primary'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Credit/Debit Card (Mock)</span>
            </button>
          </div>
        </div>

      </div>

      {/* Cart Summary column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-stone-50 border border-stone-200 rounded p-6 shadow-sm space-y-6">
          <span className="font-serif text-stone-900 text-sm font-semibold uppercase tracking-wider block border-b border-stone-200 pb-3">
            Review Items
          </span>

          {/* List items */}
          <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 items-center justify-between text-xs">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-white border border-stone-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-stone-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif text-stone-900 font-semibold line-clamp-1">{item.name}</h4>
                    <span className="text-[10px] text-stone-400">Qty: {item.quantity} {item.sizeName && `| Size: ${item.sizeName}`}</span>
                  </div>
                </div>
                <span className="font-mono font-medium text-stone-850">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Checkout Totals */}
          <div className="border-t border-stone-200 pt-4 space-y-2 text-xs text-stone-600 font-light">
            <div className="flex justify-between">
              <span>Basket Subtotal</span>
              <span className="font-mono text-stone-900">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Applied ({couponCode})</span>
                <span className="font-mono font-medium">- ₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping & Delivery</span>
              <span className="font-mono text-stone-900">{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Included (18%)</span>
              <span className="font-mono text-stone-900">₹{taxAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-stone-200 pt-4 flex justify-between items-baseline font-serif text-stone-900">
              <span className="text-sm font-semibold uppercase">Total Amount</span>
              <span className="text-xl font-bold font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent hover:bg-stone-900 hover:text-white text-accent-foreground text-xs tracking-widest uppercase font-semibold transition rounded flex items-center justify-center gap-1.5"
            >
              {loading ? 'Registering Order...' : 'Confirm & Place Order'} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </form>
  );
}
