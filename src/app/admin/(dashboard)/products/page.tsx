import Link from "next/link";
import { getCatalogAll, loadCatalogSnapshot } from "@/lib/catalog";
import { categoryLabel, vnd } from "@/lib/admin-ui";
import { ProductVisual } from "@/components/ProductVisual";
import { ProductActiveToggle } from "@/components/admin/ProductForm";

export const metadata = { title: "Sản phẩm" };

export default async function AdminProductsPage() {
  const [products, snapshot] = await Promise.all([getCatalogAll("vi"), loadCatalogSnapshot()]);
  const rows = new Map((snapshot?.products ?? []).map((r) => [r.slug, r]));
  const mediaCount = new Map<string, number>();
  for (const m of snapshot?.media ?? []) mediaCount.set(m.product_slug, (mediaCount.get(m.product_slug) ?? 0) + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Sản phẩm</h1>
          <p className="text-sm text-muted">
            Sửa nội dung (VI/EN), giá, màu, ảnh và video; ẩn/hiện sản phẩm trên website. Sản phẩm chưa lưu lần nào
            đang dùng nội dung mặc định từ code.
          </p>
        </div>
        <Link href="/admin/products/new" className="kbtn kbtn-accent h-10 px-5 text-xs">
          + Thêm sản phẩm
        </Link>
      </div>

      <section className="kcard overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3">Sản phẩm</th>
              <th className="px-3 py-3">Danh mục</th>
              <th className="px-3 py-3 text-right">Giá</th>
              <th className="px-3 py-3 text-center">Ảnh / video</th>
              <th className="px-3 py-3">Nguồn</th>
              <th className="px-3 py-3">Hiển thị</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const row = rows.get(p.slug);
              const media = mediaCount.get(p.slug) ?? 0;
              return (
                <tr key={p.slug} className={`border-t border-border ${p.active === false ? "opacity-60" : ""}`}>
                  <td className="px-5 py-2">
                    <Link href={`/admin/products/${p.slug}`} className="flex items-center gap-3">
                      <span className="relative block h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 border-ink bg-bg-elev">
                        <ProductVisual product={p} sizes="64px" />
                      </span>
                      <span>
                        <span className="block font-semibold">{p.name}</span>
                        <span className="block font-mono text-xs text-muted">{p.slug}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-xs">{categoryLabel[p.category] ?? p.category}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {vnd(p.price)}
                    {p.compareAtPrice && <span className="block text-xs text-muted line-through">{vnd(p.compareAtPrice)}</span>}
                  </td>
                  <td className="px-3 py-2 text-center tabular-nums">
                    {media > 0 ? media : <span className="text-xs text-muted">SVG mặc định</span>}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {row ? (row.source === "admin" ? "Admin tạo" : "Mặc định (đã sửa)") : <span className="text-muted">Mặc định</span>}
                  </td>
                  <td className="px-3 py-2">
                    <ProductActiveToggle slug={p.slug} active={p.active !== false} inDb={Boolean(row)} />
                  </td>
                  <td className="px-5 py-2 text-right">
                    <Link href={`/admin/products/${p.slug}`} className="kbtn kbtn-white h-8 px-3 text-xs">
                      Sửa
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
