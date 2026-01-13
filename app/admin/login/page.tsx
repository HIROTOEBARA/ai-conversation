// app/admin/login/page.tsx
import { adminLogin } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export default function AdminLoginPage() {
  async function action(formData: FormData) {
    "use server";
    const res = await adminLogin(formData);
    if (res.ok) redirect("/admin");
    // エラーは簡易表示（MVP）
    redirect(`/admin/login?error=${encodeURIComponent(res.error ?? "ログイン失敗")}`);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-white">管理ログイン</h1>

      {/* URLのerrorを表示したいなら searchParams を使ってもOK（MVPは省略可） */}

      <form action={action} className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
        <label className="block text-sm text-white/80">
          パスワード
          <input
            name="password"
            type="password"
            className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none"
            placeholder="ADMIN_PASSWORD"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90"
        >
          ログイン
        </button>
      </form>
    </main>
  );
}