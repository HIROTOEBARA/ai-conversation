// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-white">ai-conversation-reader</h1>

      <div className="space-y-3">
        <Link
          href="/conversations"
          className="block rounded-lg border border-white/10 bg-white/5 p-4 text-white hover:bg-white/10"
        >
          会話一覧を見る
        </Link>

        <Link
          href="/admin"
          className="block rounded-lg border border-white/10 bg-white/5 p-4 text-white hover:bg-white/10"
        >
          管理画面へ
        </Link>
      </div>
    </main>
  );
}