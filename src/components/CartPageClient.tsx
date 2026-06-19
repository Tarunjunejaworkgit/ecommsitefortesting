'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import Link from 'next/link';
import { ShoppingBag, Trash, Plus, Minus, ArrowRight, Tag, Percent } from 'lucide-react';

export default function CartPageClient() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    
    const code = couponCode.trim().toUpperCase();
    if (code === 'MOKSHAY15') {
      const discount = Math.round(cartTotal * 0.15);
      setDiscountAmount(discount);
      setActiveCoupon('MOKSHAY15');
      setCouponCode('');
    } else {
      setCouponError('Invalid promo code. Check active codes on our Offers page.');
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setActiveCoupon(null);
  };

  const shippingCost = cartTotal >= 999 || cartTotal === 0 ? 0 : 99;
  const taxAmount = Math.round((cartTotal - discountAmount) * 0.18); // 18% GST included or added
  const grandTotal = cartTotal - discountAmount + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif text-stone-900 font-normal">Your Basket is Empty</h2>
          <p className="text-stone-500 text-sm font-light max-w-sm mx-auto leading-relaxed">
            You have not added any pure heritage elements to your shopping basket yet.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-block px-8 py-3.5 bg-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-stone-850 transition rounded"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  // Save applied coupon to localStorage so checkout can read it
  if (typeof window !== 'undefined') {
    if (activeCoupon) {
      localStorage.setItem('mokshay_applied_coupon', activeCoupon);
      localStorage.setItem('mokshay_discount_amount', discountAmount.toString());
    } else {
      localStorage.removeItem('mokshay_applied_coupon');
      localStorage.removeItem('mokshay_discount_amount');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
      
      {/* Items List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="border border-stone-250 rounded bg-white overflow-hidden">
          <div className="p-5 border-b border-stone-200 bg-stone-50 text-xs font-semibold text-stone-550 uppercase tracking-wider grid grid-cols-12 gap-4">
            <span className="col-span-6">Product Details</span>
            <span className="col-span-2 text-center">Price</span>
            <span className="col-span-2 text-center">Quantity</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          <div className="divide-y divide-stone-200">
            {cartItems.map((item) => (
              <div key={item.id} className="p-5 grid grid-cols-12 gap-4 items-center text-xs">
                
                {/* Product Detail image + title */}
                <div className="col-span-6 flex gap-4 items-center">
                  <div className="w-16 h-16 bg-stone-50 border border-stone-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-stone-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif text-stone-900 font-semibold text-sm line-clamp-2">
                      <Link href={`/product/${item.productId}`} className="hover:text-primary transition">
                        {item.name}
                      </Link>
                    </h4>
                    {item.sizeName && (
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5 block">Size: {item.sizeName}</span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <span className="col-span-2 text-center text-stone-600 font-mono text-sm">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>

                {/* Quantity */}
                <div className="col-span-2 flex justify-center">
                  <div className="flex items-center border border-stone-200 rounded bg-white">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="p-1 hover:bg-stone-50 text-stone-500 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-mono text-xs font-semibold text-stone-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="p-1 hover:bg-stone-50 text-stone-500 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-2 flex justify-between items-center text-stone-900 font-semibold font-mono text-sm pl-2">
                  <span className="text-right flex-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                    className="text-stone-300 hover:text-red-600 transition ml-4 p-1"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Free Shipping Alert banner */}
        {cartTotal < 999 && (
          <div className="bg-accent/5 border border-accent/20 rounded p-4 text-xs text-stone-700 flex justify-between items-center">
            <span>Add <b>₹{(999 - cartTotal).toLocaleString('en-IN')}</b> more to unlock <b>Free Delivery</b>.</span>
            <Link href="/shop" className="underline font-semibold hover:text-primary transition uppercase tracking-wider text-[10px]">
              Add Items
            </Link>
          </div>
        )}
      </div>

      {/* Summary Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Promo code entry */}
        <div className="bg-white border border-stone-200 rounded p-5 space-y-4 shadow-sm text-xs">
          <span className="font-serif text-stone-900 text-sm font-semibold uppercase tracking-wider block">Apply Promo Code</span>
          {activeCoupon ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded flex items-center justify-between font-light">
              <div className="flex items-center gap-1.5 font-mono font-semibold">
                <Percent className="w-4 h-4 text-accent" />
                <span>{activeCoupon} (15% Off Applied)</span>
              </div>
              <button onClick={handleRemoveCoupon} className="text-xs underline hover:text-stone-950 font-medium">
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 border border-stone-300 px-3 py-2 text-stone-800 focus:outline-none focus:border-primary rounded text-xs uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs tracking-wider uppercase font-semibold transition rounded"
              >
                Apply
              </button>
            </form>
          )}
          {couponError && <p className="text-red-500 text-[10px] font-light mt-1">{couponError}</p>}
        </div>

        {/* Totals Box */}
        <div className="bg-white border border-stone-200 rounded p-5 space-y-5 shadow-sm text-xs text-stone-600 font-light">
          <span className="font-serif text-stone-900 text-sm font-semibold uppercase tracking-wider block border-b border-stone-150 pb-3">
            Order Summary
          </span>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Basket Subtotal</span>
              <span className="font-mono text-stone-900 font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span className="font-mono font-medium">- ₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST Tax (18% included)</span>
              <span className="font-mono text-stone-950">₹{taxAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Charges</span>
              <span className="font-mono text-stone-900">
                {shippingCost === 0 ? <span className="text-green-600 uppercase text-[10px] font-semibold">Free</span> : `₹${shippingCost}`}
              </span>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-4 flex justify-between items-baseline font-serif text-stone-900">
            <span className="text-sm font-medium">Grand Total</span>
            <span className="text-xl font-bold font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="pt-2">
            <Link
              href="/checkout"
              className="w-full py-4 bg-primary text-white text-center text-xs tracking-widest uppercase font-semibold hover:bg-stone-850 transition rounded flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
