// app/admin/page.tsx
import Link from "next/link";
import { listConversations } from "@/lib/conversationRepo";
import { createConversationAction } from "./actions";
import { adminLogout, requireAdmin } from "@/lib/adminAuth";
import { redirect } from "next/navigation";
import { AdminComposeBox } from "./ui/AdminComposeBox";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<{
    created?: string;
    error?: string;
  }>;
};

// 固定カテゴリ（増やすならここ）
const CATEGORIES = ["全て", "生活", "経済", "ビジネス"] as const;

export default async function AdminPage({ searchParams }: Props) {
  // ✅ ログイン必須（未ログインなら /admin/login へ）
  const ok = await requireAdmin();
  if (!ok) redirect("/admin/login");

  const conversations = await listConversations();

  async function logout() {
    "use server";
    await adminLogout();
    redirect("/admin/login");
  }

  const sp = (await searchParams) ?? {};
  const created = sp.created === "1";
  const error = sp.error ? decodeURIComponent(sp.error) : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-white">管理画面</h1>
          <p className="text-sm text-white/80">
            会話ログを貼り付けて保存します（公開側はログイン不要）。
          </p>
        </div>

        <form action={logout}>
          <button className="rounded-md bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15">
            ログアウト
          </button>
        </form>
      </header>

      {created && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          保存しました（一覧を更新しました）
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ✅ 新規作成 */}
      <section className="mb-10 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="mb-3 text-lg font-semibold text-white">新規作成</h2>

        <form action={createConversationAction} className="space-y-4">
          {/* ✅ 分類 */}
          <label className="block text-sm text-white/80">
            分類
            <select
              name="category"
              defaultValue="全て"
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <input
            name="title"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white"
            placeholder="タイトル"
            required
          />

          <input
            name="summary"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white"
            placeholder="概要（一覧・詳細に表示）"
            required
          />

          {/* ✅ 生ログ→タグ整形→追記反映のUI */}
          <AdminComposeBox />

          <button
            type="submit"
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90"
          >
            保存
          </button>
        </form>
      </section>

      {/* ✅ 保存済み */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">保存済み</h2>

        {conversations.map((c) => {
          const cat = c.category ?? "全て";
          const href = `/conversations/${c.id}?category=${encodeURIComponent(cat)}`;

          return (
            <Link
              key={c.id}
              href={href}
              scroll={false} // ✅ Nextの自動スクロール(top戻し)を止める
              className="block rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-white/70">
                  {new Date(c.created_at).toLocaleString("ja-JP")}
                </div>
                <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-xs text-white/80">
                  {cat}
                </span>
              </div>

              <div className="mt-1 text-base font-semibold text-white">{c.title}</div>
              <div className="text-sm text-white/80">{c.summary}</div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}