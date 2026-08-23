"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  variantId: string | null;
  slug: string;
  title: string;
  variantName: string | null;
  unitPrice: number;
  currency: string;
  imageUrl: string | null;
  quantity: number;
  weightGrams: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  clear: () => void;
  subtotal: number;
  totalWeightGrams: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "conceptly-cart";

function sameLine(a: { productId: string; variantId: string | null }, b: typeof a) {
  return a.productId === b.productId && a.variantId === b.variantId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage doesn't exist during SSR, so the cart can only be read
    // after mount — an unavoidable one-time setState-in-effect here.
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // corrupted/blocked storage — start with an empty cart
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (private mode, quota) — cart just won't persist
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((line) => sameLine(line, item));
      if (existing) {
        return prev.map((line) =>
          sameLine(line, item) ? { ...line, quantity: line.quantity + quantity } : line,
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, variantId: string | null, quantity: number) => {
      setItems((prev) =>
        prev
          .map((line) => (sameLine(line, { productId, variantId }) ? { ...line, quantity } : line))
          .filter((line) => line.quantity > 0),
      );
    },
    [],
  );

  const removeItem = useCallback((productId: string, variantId: string | null) => {
    setItems((prev) => prev.filter((line) => !sameLine(line, { productId, variantId })));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items],
  );
  const totalWeightGrams = useMemo(
    () => items.reduce((sum, i) => sum + i.weightGrams * i.quantity, 0),
    [items],
  );
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clear, subtotal, totalWeightGrams, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart muss innerhalb von <CartProvider> verwendet werden.");
  return ctx;
}
