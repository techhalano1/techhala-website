import { listStock } from "@/lib/orders";
import { colorLookup, getCatalogAll } from "@/lib/catalog";
import { categoryLabel, vnd } from "@/lib/admin-ui";
import { StockInForm, SyncCatalogButton } from "@/components/admin/StockForms";

export const metadata = { title: "Kho hàng" };

export default async function AdminInventoryPage() {
  const [stock, catalog] = await Promise.all([listStock(), getCatalogAll("vi")]);
  const catalogColor = colorLookup(catalog);
  const variants = stock
    .filter((v) => v.active)
    .map((v) => ({ id: v.variant_id, label: `${v.product_name}${v.color_name ? ` · ${v.color_name}` : ""} (${v.sku})` }));

  const groups = new Map<string, typeof stock>();
  for (const v of stock) {
    const list = groups.get(v.category) ?? [];
    list.push(v);
    groups.set(v.category, list);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Kho hàng</h1>
          <p className="text-sm text-muted">
            Tồn = tổng nhập − xuất. Giữ = số lượng trong đơn chờ/đã xác nhận. Khả dụng = Tồn − Giữ.
          </p>
        </div>
        <SyncCatalogButton />
      </div>

      {stock.length === 0 ? (
        <div className="kcard bg-tint-yellow p-5 text-sm">
          Chưa có sản phẩm trong cơ sở dữ liệu. Bấm &ldquo;Đồng bộ danh mục từ website&rdquo; để tạo danh mục và các
          biến thể màu, sau đó nhập kho.
        </div>
      ) : (
        <>
          <section className="kcard p-5">
            <h2 className="font-bold">Nhập kho / điều chỉnh</h2>
            <div className="mt-3">
              <StockInForm variants={variants} />
            </div>
          </section>

          {[...groups.entries()].map(([category, rows]) => (
            <section key={category} className="kcard overflow-x-auto">
              <h2 className="border-b-2 border-ink px-5 py-3 font-bold">{categoryLabel[category] ?? category}</h2>
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-5 py-2">Sản phẩm</th>
                    <th className="px-3 py-2">SKU</th>
                    <th className="px-3 py-2 text-right">Giá</th>
                    <th className="px-3 py-2 text-right">Tồn</th>
                    <th className="px-3 py-2 text-right">Giữ</th>
                    <th className="px-3 py-2 text-right">Khả dụng</th>
                    <th className="px-5 py-2 text-right">Đã bán</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((v) => {
                    const available = v.on_hand - v.reserved;
                    return (
                      <tr key={v.variant_id} className={`border-t border-border ${v.active ? "" : "opacity-50"}`}>
                        <td className="px-5 py-2">
                          <span className="font-semibold">{v.product_name}</span>
                          {v.color_name && (
                            <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted">
                              <span className="inline-block h-3 w-3 rounded-full border border-ink" style={{ background: catalogColor(v.product_slug, v.color)?.hex }} />
                              {v.color_name}
                            </span>
                          )}
                          {!v.active && <span className="ml-2 text-xs text-muted">(ngừng bán)</span>}
                        </td>
                        <td className="px-3 py-2 font-mono text-xs text-muted">{v.sku}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{vnd(v.price)}</td>
                        <td className="px-3 py-2 text-right font-bold tabular-nums">{v.on_hand}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-muted">{v.reserved}</td>
                        <td
                          className={`px-3 py-2 text-right font-bold tabular-nums ${
                            available <= 0 ? "text-accent" : available <= 2 ? "text-[#a35a00]" : "text-[#0d6b3a]"
                          }`}
                        >
                          {available}
                        </td>
                        <td className="px-5 py-2 text-right tabular-nums">{v.sold}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
