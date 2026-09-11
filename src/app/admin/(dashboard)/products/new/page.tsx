import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

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
      <ProductForm mode="create" vi={null} en={null} row={null} />
    </div>
  );
}
