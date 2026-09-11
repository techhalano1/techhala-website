"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

type Props = {
  slug: string;
  color?: string;
  qty?: number;
  label: string;
  addedLabel: string;
  className?: string;
  variant?: "accent" | "ink" | "white";
  openDrawer?: boolean;
  disabled?: boolean;
};

export function AddToCartButton({ slug, color, qty = 1, label, addedLabel, className = "", variant = "accent", openDrawer = true, disabled = false }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [added]);

  return (
    <button
      type="button"
      onClick={() => {
        add({ slug, color, qty }, openDrawer);
        setAdded(true);
      }}
      disabled={disabled}
      className={`kbtn kbtn-${variant} disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      aria-live="polite"
    >
      {added ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {addedLabel}
        </>
      ) : (
        <>
          <CartIcon />
          {label}
        </>
      )}
    </button>
  );
}

export function CartIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden>
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.5L21.5 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
    </svg>
  );
}
