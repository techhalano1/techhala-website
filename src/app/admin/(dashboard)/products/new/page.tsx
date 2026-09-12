import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { ZipImport } from "@/components/admin/ZipImport";

export const metadata = { title: "Thêm sản phẩm" };

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="text-xs font-bold text-muted hover:text-fg">
          ← Sản phẩm
        </Link>
        <h1 className="mt-1 text-2xl font-extrabold">Thêm sản phẩm</h1>
        <p className="text-sm text-muted">Lưu xong bạn sẽ được chuyển sang trang sửa để tải ảnh và thêm video.</p>
      </div>
      <section className="kcard p-5">
        <h2 className="font-bold">Nhập từ ZIP</h2>
        <p className="mt-1 text-xs text-muted">Tải ZIP mẫu, điền product.xlsx và bỏ ảnh vào cùng thư mục, nén lại rồi chọn ở đây — sản phẩm được tạo kèm ảnh trong một lần.</p>
        <div className="mt-4">
          <ZipImport slug={null} />
        </div>
      </section>

      <div className="text-center text-xs font-bold text-muted">— hoặc điền tay —</div>

      <ProductForm mode="create" vi={null} en={null} row={null} />
    </div>
  );
}
