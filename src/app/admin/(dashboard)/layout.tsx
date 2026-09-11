import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { Logo } from "@/components/Logo";
import { logout } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/orders", label: "Đơn hàng" },
  { href: "/admin/inventory", label: "Kho hàng" },
];

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  const dbReady = Boolean(getDb());

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-2 border-ink bg-bg-elev">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo />
            <span className="rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Admin</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-semibold">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-1.5 transition hover:bg-tint-peach">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <Link href="/vi" className="text-muted hover:text-fg" target="_blank" rel="noopener noreferrer">
              Xem website ↗
            </Link>
            <form action={logout}>
              <button type="submit" className="kbtn kbtn-white h-8 px-3 text-xs">
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {dbReady ? (
          children
        ) : (
          <div className="kcard bg-tint-pink p-6 text-sm">
            <p className="font-bold">Chưa kết nối cơ sở dữ liệu.</p>
            <p className="mt-1 text-muted">
              Thiết lập <code className="font-mono">SUPABASE_URL</code> và{" "}
              <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> rồi deploy lại.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
