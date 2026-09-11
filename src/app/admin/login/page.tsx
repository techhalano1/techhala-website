import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="kdots flex min-h-screen items-center justify-center p-6">
      <div className="kcard w-full max-w-sm p-8">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xs font-bold uppercase tracking-wider text-muted">Admin</span>
        </div>
        <h1 className="mt-6 text-2xl font-extrabold">Đăng nhập quản trị</h1>
        {adminConfigured() ? (
          <LoginForm next={next} />
        ) : (
          <p className="mt-4 rounded-xl border-2 border-accent bg-tint-pink p-4 text-sm">
            Chưa cấu hình <code className="font-mono">ADMIN_PASSWORD</code>. Thêm biến môi trường này (và{" "}
            <code className="font-mono">ADMIN_SESSION_SECRET</code>) trên Vercel rồi deploy lại.
          </p>
        )}
      </div>
    </main>
  );
}
