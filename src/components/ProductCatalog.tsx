"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ageGroups, productCategories, type AgeGroup, type Dictionary, type Product, type ProductCategory } from "@/content";
import type { Locale } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";

type SortId = "popular" | "price-asc" | "price-desc" | "rating";

function isCategory(v: string): v is ProductCategory {
  return (productCategories as readonly string[]).includes(v);
}
function isAge(v: string): v is AgeGroup {
  return (ageGroups as readonly string[]).includes(v);
}
function isSort(v: string): v is SortId {
  return ["popular", "price-asc", "price-desc", "rating"].includes(v);
}

export function ProductCatalog({
  products,
  locale,
  t,
  initialCategory,
  initialAge,
}: {
  products: Product[];
  locale: Locale;
  t: Dictionary;
  initialCategory?: string;
  initialAge?: string;
}) {
  const L = t.shop.labels;
  const [category, setCategory] = useState<ProductCategory | "all">(initialCategory && isCategory(initialCategory) ? initialCategory : "all");
  const [age, setAge] = useState<AgeGroup | "all">(initialAge && isAge(initialAge) ? initialAge : "all");
  const [price, setPrice] = useState<string>("all");
  const [sort, setSort] = useState<SortId>("popular");

  const filtered = useMemo(() => {
    const range = L.priceRanges.find((r) => r.id === price);
    const list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (age !== "all" && !p.ages.includes(age)) return false;
      if (range) {
        if (p.price < range.min) return false;
        if (range.max !== undefined && p.price >= range.max) return false;
      }
      return true;
    });
    const sorters: Record<SortId, (a: Product, b: Product) => number> = {
      popular: (a, b) => b.sold - a.sold,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating || b.sold - a.sold,
    };
    return [...list].sort(sorters[sort]);
  }, [products, category, age, price, sort, L.priceRanges]);

  const activeCount = (category !== "all" ? 1 : 0) + (age !== "all" ? 1 : 0) + (price !== "all" ? 1 : 0);
  const reset = () => {
    setCategory("all");
    setAge("all");
    setPrice("all");
  };

  const chip = (active: boolean, onClick: () => void, label: string, key: string) => (
    <button key={key} type="button" onClick={onClick} aria-pressed={active} className="kchip">
      {label}
    </button>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <FilterGroup title={L.filterCategory}>
          {chip(category === "all", () => setCategory("all"), L.filterAll, "all")}
          {productCategories.map((c) => chip(category === c, () => setCategory(c), t.shop.categories[c].name, c))}
        </FilterGroup>
        <FilterGroup title={L.filterAge}>
          {chip(age === "all", () => setAge("all"), L.filterAll, "all")}
          {ageGroups.map((a) => chip(age === a, () => setAge(a), t.shop.ages[a].name, a))}
        </FilterGroup>
        <FilterGroup title={L.filterPrice}>
          {chip(price === "all", () => setPrice("all"), L.filterAll, "all")}
          {L.priceRanges.map((r) => chip(price === r.id, () => setPrice(r.id), r.label, r.id))}
        </FilterGroup>
        {activeCount > 0 && (
          <button type="button" onClick={reset} className="text-sm font-semibold text-accent hover:underline">
            ✕ {L.clearFilters} ({activeCount})
          </button>
        )}
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            <span className="font-mono text-base font-extrabold text-fg">{filtered.length}</span> {L.results}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{L.sortBy}</span>
            <select
              value={sort}
              onChange={(e) => {
                if (isSort(e.target.value)) setSort(e.target.value);
              }}
              className="h-10 rounded-xl border-2 border-ink bg-bg-elev px-3 text-sm font-semibold outline-none"
            >
              {L.sortOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="kcard mt-6 p-10 text-center">
            <p className="text-muted">{L.noResults}</p>
            <button type="button" onClick={reset} className="kbtn kbtn-ink mt-5 h-10 px-4 text-sm">
              {L.clearFilters}
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} locale={locale} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-extrabold uppercase tracking-wider text-muted">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}
