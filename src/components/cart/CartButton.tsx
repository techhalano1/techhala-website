"use client";

import { useCart } from "@/components/cart/CartProvider";
import { CartIcon } from "@/components/cart/AddToCartButton";

export function CartButton({ label, className = "" }: { label: string; className?: string }) {
  const { count, setOpen, hydrated } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`${label}${hydrated && count > 0 ? ` (${count})` : ""}`}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-bg-elev transition hover:-translate-y-0.5 hover:shadow-hard-sm ${className}`}
    >
      <CartIcon />
      {hydrated && count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-bg bg-accent px-1 font-mono text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
