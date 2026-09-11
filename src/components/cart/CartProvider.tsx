"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = { slug: string; color?: string; qty: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  hydrated: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (line: { slug: string; color?: string; qty?: number }, openDrawer?: boolean) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "techhala-cart-v1";
const MAX_QTY = 10;

export function lineKey(line: { slug: string; color?: string }) {
  return line.color ? `${line.slug}:${line.color}` : line.slug;
}

function readStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        typeof l === "object" &&
        l !== null &&
        typeof (l as CartLine).slug === "string" &&
        typeof (l as CartLine).qty === "number" &&
        (l as CartLine).qty > 0,
    );
  } catch {
    return [];
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLines(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage unavailable (private mode) — cart stays in memory
    }
  }, [lines, hydrated]);

  const add = useCallback<CartContextValue["add"]>((line, openDrawer = true) => {
    const qty = Math.min(MAX_QTY, Math.max(1, line.qty ?? 1));
    setLines((prev) => {
      const key = lineKey(line);
      const existing = prev.find((l) => lineKey(l) === key);
      if (existing) {
        return prev.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
      }
      return [...prev, { slug: line.slug, color: line.color, qty }];
    });
    if (openDrawer) setOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => lineKey(l) !== key)
        : prev.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l) !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      hydrated,
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, hydrated, open, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
