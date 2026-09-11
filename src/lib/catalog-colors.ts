import { vi } from "@/content/vi";

const map = new Map<string, { name: string; hex: string }>();
for (const p of vi.products.items) {
  for (const c of p.colors ?? []) map.set(`${p.slug}:${c.id}`, { name: c.name, hex: c.hex });
}

export function catalogColor(slug: string, colorId: string | null) {
  return colorId ? map.get(`${slug}:${colorId}`) : undefined;
}
