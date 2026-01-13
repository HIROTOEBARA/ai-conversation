"use client";

import { useRef, useState } from "react";

type WrapMode = "assistant" | "user";

export default function AdminComposer() {
  const [wrapMode, setWrapMode] = useState<WrapMode>("assistant");

  const rawRef = useRef<HTMLTextAreaElement | null>(null);
  const taggedRef = useRef<HTMLTextAreaElement | null>(null);

  const applyTagged = () => {
    const raw = (rawRef.current?.value ?? "").trim();
    if (!raw) return;

    const block =
      wrapMode === "assistant"
        ? `[ASSISTANT]\n${raw}\n[/ASSISTANT]\n\n`
        : `[USER]\n${raw}\n[/USER]\n\n`;

    // ✅ 追記（append）する。上書きしない
    if (taggedRef.current) {
      const current = taggedRef.current.value ?? "";
      const needsGap = current.length > 0 && !current.endsWith("\n");
      taggedRef.current.value = current + (needsGap ? "\n\n" : "") + block;
      taggedRef.current.focus();
      taggedRef.current.scrollTop = taggedRef.current.scrollHeight; // 末尾へ
    }

    // ✅ rawText を消す
    if (rawRef.current) {
      rawRef.current.value = "";
      rawRef.current.focus();
    }
  };

  return (
    <div className="space-y-4">
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

      {/* raw */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-white">
          他サービスからコピペした会話ログ
        </div>

        <textarea
          ref={rawRef}
          id="rawText"
          rows={8}
          className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 font-mono text-sm text-white"
          placeholder="ここに他サービスの会話ログを貼り付け"
        />

        <div className="flex flex-wrap items-center gap-2">
          {/* ✅ 囲み方を選べる */}
          <select
            value={wrapMode}
            onChange={(e) => setWrapMode(e.target.value as WrapMode)}
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          >
            <option value="assistant">[ASSISTANT]...[/ASSISTANT] で囲む</option>
            <option value="user">[USER]...[/USER] で囲む</option>
          </select>

          <button
            type="button"
            onClick={applyTagged}
            className="rounded-md bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
          >
            タグ形式に整形して反映（追記）
          </button>
        </div>
      </div>

      {/* tagged */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-white">
          投稿される内容（タグ形式）
        </div>

        <textarea
          ref={taggedRef}
          id="taggedText"
          name="taggedText"
          rows={12}
          className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-white"
          placeholder="[ASSISTANT]...[/ASSISTANT]"
          required
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90"
      >
        保存
      </button>
    </div>
  );
}