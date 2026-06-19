'use client';

import React from 'react';
import { useCart } from '@/lib/cartContext';
import Link from 'next/link';
import { X, Plus, Minus, Trash, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-serif font-medium text-stone-900">Your Basket</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-stone-400 hover:text-stone-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-stone-800 font-serif text-lg">Your cart is empty</p>
                    <p className="text-stone-500 text-sm mt-1">Start adding pure elements to your ritual.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-primary text-white text-sm tracking-wider uppercase font-medium hover:bg-stone-800 transition rounded"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-stone-100 pb-4">
                    {/* Image */}
                    <div className="w-20 h-20 bg-stone-100 rounded overflow-hidden relative flex-shrink-0 flex items-center justify-center">
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

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-stone-900 font-medium text-sm line-clamp-1">{item.name}</h4>
                        {item.sizeName && (
                          <p className="text-stone-500 text-xs mt-0.5">Size: {item.sizeName}</p>
                        )}
                        <p className="text-stone-900 text-sm mt-1 font-medium">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>

                      {/* Quantity Editor */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-stone-200 rounded">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="p-1 hover:bg-stone-50 text-stone-600 transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-mono text-stone-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="p-1 hover:bg-stone-50 text-stone-600 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="text-stone-400 hover:text-red-600 p-1 transition"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4">
                <div className="flex justify-between items-center text-stone-900 font-serif">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold text-lg">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-stone-500 text-xs">Shipping and taxes calculated at checkout.</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="py-3 border border-stone-300 hover:bg-white text-stone-700 text-center text-xs tracking-wider uppercase font-medium transition rounded"
                  >
                    View Basket
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="py-3 bg-primary text-white text-center text-xs tracking-wider uppercase font-medium hover:bg-stone-800 transition rounded"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
