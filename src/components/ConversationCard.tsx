// src/components/ConversationCard.tsx
import Link from "next/link";
import type { Conversation } from "@/lib/conversationRepo";

type Props = {
  conversation: Conversation;
};

export function ConversationCard({ conversation }: Props) {
  const categoryLabel = conversation.category ?? "全て";

  // ✅ 詳細→一覧に戻る時に、元のカテゴリを保持できるように付与
  // （詳細側で searchParams.category を backHref に使ってる前提）
  const href = `/conversations/${conversation.id}?category=${encodeURIComponent(
    categoryLabel
  )}`;

  return (
    <Link
      href={href}
      prefetch={false} // ✅ 重要：一覧で大量GETを出さない
      scroll={false}   // ✅ 重要：Nextの自動トップ戻しを抑制（あなたの復帰仕様と相性◎）
      className="block rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-white/70">
          {new Date(conversation.created_at).toLocaleString("ja-JP")}
        </div>

        <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-xs text-white/80">
          {categoryLabel}
        </span>
      </div>

      <div className="mt-1 text-base font-semibold text-white">
        {conversation.title}
      </div>
      <div className="text-sm text-white/80">{conversation.summary}</div>
    </Link>
  );
}