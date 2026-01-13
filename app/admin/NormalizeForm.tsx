"use client";

import { normalizeToTaggedChat } from "@/lib/normalizeToTaggedChat";

export function NormalizeForm() {
  return (
    <>
      {/* 🔽 生ログ */}
      <textarea
        id="rawText"
        rows={8}
        className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 font-mono text-sm text-white"
        placeholder="他サービスからコピペした会話ログ"
      />

      {/* 🔽 整形ボタン */}
      <button
        type="button"
        className="rounded-md bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
        onClick={() => {
          const raw = (document.getElementById("rawText") as HTMLTextAreaElement)?.value ?? "";
          const tagged = normalizeToTaggedChat(raw);
          const target = document.getElementById("taggedText") as HTMLTextAreaElement | null;
          if (target) target.value = tagged;
        }}
      >
        タグ形式に整形
      </button>
    </>
  );
}