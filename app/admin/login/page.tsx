// app/admin/login/page.tsx
import { adminLogin } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

type Props = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const error = sp.error ? decodeURIComponent(sp.error) : "";

  async function action(formData: FormData) {
    "use server";
    const res = await adminLogin(formData);
    if (res.ok) redirect("/admin");
    redirect(`/admin/login?error=${encodeURIComponent(res.error ?? "ログイン失敗")}`);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-white">管理者ログイン</h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form action={action} className="space-y-4">
        <input
          name="password"
          type="password"
          placeholder="管理者パスワード"
          className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white"
          required
        />
        <button
          type="submit"
          className="w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90"
        >
          ログイン
        </button>
      </form>
    </main>
  );
}