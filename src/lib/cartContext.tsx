'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: string; // unique combination key or db id
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  sizeName?: string;
  sku?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, qty: number) => void;
  clearCart: () => void;
  
  // Wishlist
  wishlist: string[]; // array of product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Recently Viewed
  recentlyViewed: string[]; // array of product slugs
  addRecentlyViewed: (slug: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('mokshay_cart');
      if (storedCart) setCartItems(JSON.parse(storedCart));

      const storedWishlist = localStorage.getItem('mokshay_wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedRecent = localStorage.getItem('mokshay_recently_viewed');
      if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('mokshay_cart', JSON.stringify(cartItems));
  }, [cartItems, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('mokshay_wishlist', JSON.stringify(wishlist));
  }, [wishlist, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('mokshay_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed, isLoaded]);

  const addToCart = useCallback((newItem: Omit<CartItem, 'id'>) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
      );

      if (existingIndex !== -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }

      const id = `${newItem.productId}-${newItem.variantId || 'default'}`;
      return [...prevItems, { ...newItem, id }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, variantId?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  }, []);

  const updateQuantity = useCallback((productId: string, variantId: string | undefined, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity: qty }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const addRecentlyViewed = useCallback((slug: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      // Keep up to 6 products
      return [slug, ...filtered].slice(0, 6);
    });
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        recentlyViewed,
        addRecentlyViewed,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
