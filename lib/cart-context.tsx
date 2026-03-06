'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/api';

export type CartItem = {
  product: Product;
  quantity: number;
  maxStock?: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity: number, maxStock?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getItemQuantity: (productId: string) => number;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const STORAGE_KEY = 'vswag-cart';
const CartContext = createContext<CartContextType | null>(null);

const getProductStock = (product: Product) => {
  const stock = (product as Product & { stock?: number }).stock;
  return typeof stock === 'number' ? Math.max(0, stock) : Number.POSITIVE_INFINITY;
};

const toSafeNumber = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = useCallback((product: Product, quantity: number, maxStock?: number) => {
    setItems((prev) => {
      const toAdd = Math.max(0, Number(quantity) || 0);
      if (toAdd <= 0) return prev;

      const productId = String(product.id);
      const cap = Math.max(0, Number(maxStock ?? (product as { stock?: number }).stock ?? Number.POSITIVE_INFINITY));
      if (cap <= 0) return prev;

      const existing = prev.find((i) => String(i.product.id) === productId);

      if (existing) {
        const effectiveCap = existing.maxStock ?? cap;
        const nextQty = Math.min(effectiveCap, existing.quantity + toAdd);
        if (nextQty <= existing.quantity) return prev;

        return prev.map((i) =>
          String(i.product.id) === productId
            ? { ...i, quantity: nextQty, maxStock: i.maxStock ?? (Number.isFinite(cap) ? cap : undefined) }
            : i
        );
      }

      return [...prev, { product, quantity: Math.min(cap, toAdd), maxStock: Number.isFinite(cap) ? cap : undefined }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => String(i.product.id) !== String(productId)));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (String(i.product.id) !== String(productId)) return i;
          const cap = i.maxStock ?? Number.POSITIVE_INFINITY;
          return { ...i, quantity: Math.min(cap, Math.max(0, Number(quantity) || 0)) };
        })
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const getItemQuantity = useCallback(
    (productId: string) => items.find((i) => i.product.id === productId)?.quantity ?? 0,
    [items]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i.product.price) || 0) * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      getItemQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, addItem, removeItem, updateQuantity, getItemQuantity, clearCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
