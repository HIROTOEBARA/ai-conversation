// app/admin/ui/AdminComposeBox.tsx
"use client";

import { useRef, useState } from "react";
import { normalizeToTaggedChat, type TagMode } from "@/lib/normalizeToTaggedChat";

const WRAPPERS: { label: string; value: TagMode }[] = [
  { label: "[ASSISTANT]…[/ASSISTANT]", value: "assistant" },
  { label: "[USER]…[/USER]", value: "user" },
];

export function AdminComposeBox() {
  const [mode, setMode] = useState<TagMode>("assistant");

  const rawRef = useRef<HTMLTextAreaElement | null>(null);
  const taggedRef = useRef<HTMLTextAreaElement | null>(null);

  const apply = () => {
    const raw = rawRef.current?.value ?? "";
    if (!raw.trim()) return;

    // ✅ 2引数対応した normalizeToTaggedChat を呼ぶ
    const chunk = normalizeToTaggedChat(raw, mode);
    if (!chunk.trim()) return;

    const prev = taggedRef.current?.value ?? "";
    const next = (prev ? prev.replace(/\s*$/, "\n\n") : "") + chunk.trim() + "\n";

    if (taggedRef.current) taggedRef.current.value = next;

    // ✅ 反映した瞬間に生ログを消す（要件）
    if (rawRef.current) rawRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm text-white/80">
        他サービスからコピペした会話ログ
        <textarea
          ref={rawRef}
          rows={8}
          className="mt-2 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 font-mono text-sm text-white"
          placeholder="他サービスからコピペした会話ログをここに貼る"
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as TagMode)}
          className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
        >
          {WRAPPERS.map((w) => (
            <option key={w.value} value={w.value}>
              {w.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={apply}
          className="rounded-md bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
        >
          タグ形式に整形して追記
        </button>

        <p className="text-xs text-white/60">※ 追記なので、既存のタグ本文は消えません（要件どおり）</p>
      </div>

      <label className="block text-sm text-white/80">
        投稿される内容（タグ形式）
        <textarea
          ref={taggedRef}
          id="taggedText"
          name="taggedText"
          rows={12}
          className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-white"
          placeholder="[ASSISTANT]...[/ASSISTANT]"
          required
        />
      </label>
    </div>
  );
}