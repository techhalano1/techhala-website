import Image from "next/image";
import type { Product } from "@/content";
import { ProductArt } from "@/components/ProductArt";

/** First uploaded photo (matching the colour when possible); the SVG illustration when none was uploaded yet. */
export function primaryImage(product: Product, color?: string) {
  const imgs = product.images ?? [];
  if (imgs.length === 0) return undefined;
  return (color && imgs.find((i) => i.color === color)) ?? imgs.find((i) => !i.color) ?? imgs[0];
}

export function ProductVisual({
  product,
  color,
  className = "",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: {
  product: Product;
  color?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const img = primaryImage(product, color);
  if (!img) {
    const shell = color ? product.colors?.find((c) => c.id === color)?.hex : undefined;
    return <ProductArt variant={product.art} tint={product.tint} shell={shell} title={product.name} className={className} />;
  }
  return (
    <Image
      src={img.url}
      alt={img.alt || product.name}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
