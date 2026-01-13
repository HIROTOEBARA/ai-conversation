// app/conversations/page.tsx
import Link from "next/link";
import { listConversations } from "@/lib/conversationRepo";
import { ConversationCard } from "@/components/ConversationCard";

export const dynamic = "force-dynamic";

// 固定タブ（必要なら増やす）
const CATEGORY_TABS = ["全て", "生活", "経済", "ビジネス"] as const;

type SearchParams = {
  category?: string;
};

type Props = {
  searchParams?: Promise<SearchParams>;
};

export default async function ConversationsPage({ searchParams }: Props) {
  const conversations = await listConversations();

  const sp = (await searchParams) ?? {};
  const selected = (sp.category ?? "全て").trim() || "全て";

  const filtered =
    selected === "全て"
      ? conversations // ✅ 全件表示（未分類も含む）
      : conversations.filter((c) => c.category === selected); // ✅ 未分類は出さない

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="mb-2 text-2xl font-extrabold text-white">会話一覧</h1>
        <p className="text-sm text-white/90">
          保存された AI 会話ログを一覧で確認できます。
        </p>
      </header>

      {/* ✅ 分類タブ（prefetchを止めてログの大量GETを抑制） */}
      <nav className="mb-6 flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => {
          const active = tab === selected;
          const href =
            tab === "全て"
              ? "/conversations"
              : `/conversations?category=${encodeURIComponent(tab)}`;

          return (
            <Link
              key={tab}
              href={href}
              prefetch={false} // ✅ 重要：先読みを止める
              className={[
                "rounded-full border px-3 py-1.5 text-sm",
                active
                  ? "bg-white text-slate-900 border-white"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/15",
              ].join(" ")}
            >
              {tab}
            </Link>
          );
        })}
      </nav>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/80">
          {selected === "全て"
            ? "まだ会話がありません。管理画面から作成してください。"
            : "この分類の投稿はまだありません。"}
        </div>
      ) : (
        <section className="space-y-3">
          {/* ⚠️ ここは ConversationCard 内の Link が prefetch してる可能性あり */}
          {filtered.map((conv) => (
            <ConversationCard key={conv.id} conversation={conv} />
          ))}
        </section>
      )}
    </main>
  );
}