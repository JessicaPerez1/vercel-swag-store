'use client';

import { createContext, useContext, useCallback, useSyncExternalStore } from 'react';
import type { Product } from '@/lib/api';

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  totalItems: number
  subtotal: number
  clearCart: () => void
}

const STORAGE_KEY = 'shop-cart';

function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_error) {
    // Ignore sessionStorage access errors (e.g. private browsing)
  }
  return [];
}

let listeners: Array<() => void> = [];
let cartSnapshot: CartItem[] = getStoredCart();

function emitChange() {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cartSnapshot));
  }
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): CartItem[] {
  return cartSnapshot;
}

const SERVER_SNAPSHOT: CartItem[] = [];
function getServerSnapshot(): CartItem[] {
  return SERVER_SNAPSHOT;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((product: Product, quantity: number) => {
    const existing = cartSnapshot.find((item) => item.product.id === product.id);
    if (existing) {
      cartSnapshot = cartSnapshot.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      cartSnapshot = [...cartSnapshot, { product, quantity }];
    }
    emitChange();
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      cartSnapshot = cartSnapshot.filter((item) => item.product.id !== productId);
    } else {
      cartSnapshot = cartSnapshot.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    }
    emitChange();
  }, []);

  const removeItem = useCallback((productId: string) => {
    cartSnapshot = cartSnapshot.filter((item) => item.product.id !== String(productId));
    emitChange();
  }, []);

  const clearCart = useCallback(() => {
    cartSnapshot = [];
    emitChange();
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        totalItems,
        subtotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
