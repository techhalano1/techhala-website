import Link from "next/link";
import { notFound } from "next/navigation";
import { findProduct } from "@/lib/catalog";
import { getProductRow, listMedia } from "@/lib/products-admin";
import { siteUrl } from "@/lib/site";
import { ProductForm } from "@/components/admin/ProductForm";
import { MediaManager } from "@/components/admin/MediaManager";
import { ZipImport } from "@/components/admin/ZipImport";

export default async function AdminProductEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { slug } = await params;
  const { created } = await searchParams;
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) notFound();

  const [vi, en, row, media] = await Promise.all([findProduct("vi", slug), findProduct("en", slug), getProductRow(slug), listMedia(slug)]);
  if (!vi || !en) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin/products" className="text-xs font-bold text-muted hover:text-fg">
            ← Sản phẩm
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold">{vi.name}</h1>
          <p className="text-sm text-muted">
            <span className="font-mono">{slug}</span>
            {row ? (row.source === "admin" ? " · Admin tạo" : " · Mặc định, đã sửa") : " · Mặc định (chưa lưu — đang dùng nội dung trong code)"}
          </p>
        </div>
        <Link href={`${siteUrl}/vi/products/${slug}`} target="_blank" rel="noopener noreferrer" className="kbtn kbtn-white h-9 px-4 text-xs">
          Xem trên website ↗
        </Link>
      </div>

      {created && <div className="kcard bg-tint-green p-4 text-sm font-bold">Đã tạo sản phẩm. Tải ảnh và thêm video ở mục bên dưới.</div>}

      <section className="kcard p-5">
        <h2 className="font-bold">Nhập từ ZIP</h2>
        <p className="mt-1 text-xs text-muted">
          Cập nhật toàn bộ thông tin + ảnh của sản phẩm này bằng một file ZIP (tải mẫu đã điền sẵn → sửa trong Excel → nén lại → nhập). Kết quả
          hiện ngay ở hai mục bên dưới và vẫn sửa tay được.
        </p>
        <div className="mt-4">
          <ZipImport slug={slug} />
        </div>
      </section>

      <section className="kcard p-5">
        <h2 className="font-bold">Ảnh &amp; video</h2>
        <p className="mt-1 text-xs text-muted">
          Ảnh đầu tiên là ảnh đại diện (trang chủ, danh mục, giỏ hàng). Gán màu để ảnh tự đổi khi khách chọn màu. Video: dán link
          YouTube/TikTok hoặc tải tệp MP4 (≤ 100 MB). Chưa có ảnh thì website dùng hình minh hoạ SVG mặc định.
        </p>
        <div className="mt-4">
          <MediaManager slug={slug} media={media} colors={vi.colors ?? []} />
        </div>
      </section>

      <ProductForm mode="edit" vi={vi} en={en} row={row} />
    </div>
  );
}
