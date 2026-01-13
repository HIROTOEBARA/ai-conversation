// app/conversations/[id]/ConversationDetailClient.tsx
"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CopyUrlButton } from "@/components/CopyUrlButton";
import { ChatThread } from "@/components/ChatThread";

type Props = {
  id: string;
  backHref: string;
  header: {
    formatted: string;
    title: string;
    summary: string;
    category?: string | null;
  };
  parsedOk: boolean;
  parsedError?: string;
  messages?: any[];
};

const HEADER_H = 220;

export default function ConversationDetailClient({
  id,
  backHref,
  header,
  parsedOk,
  parsedError,
  messages,
}: Props) {
  const key = `conv_scroll_${id}`;
  const saveTimer = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  // ✅ 復帰（Nextの自動scrollに負けないよう useLayoutEffect）
  useLayoutEffect(() => {
    try {
      // ブラウザ標準の復元と競合しないようにする（保険）
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    } catch {}

    const raw = sessionStorage.getItem(key);
    const y = raw ? parseInt(raw, 10) : 0;
    const target = Number.isFinite(y) ? y : 0;

    const restore = () => window.scrollTo(0, target);

    // まず即時
    restore();

    // Next側の処理に上書きされることがあるので最後にもう一発（重要）
    const t = window.setTimeout(restore, 0);

    setReady(true);

    return () => {
      window.clearTimeout(t);
    };
  }, [key]);

  // ✅ 保存（スクロール中に間引いて保存）
  useEffect(() => {
    const onScroll = () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        sessionStorage.setItem(key, String(window.scrollY));
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [key]);

  return (
    <main className="mx-auto max-w-3xl px-4">
      {/* 固定ヘッダー（黒・不透明） */}
      <header
        className="border-b border-white/10 bg-black"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}
      >
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <Link
              href={backHref}
              scroll={false} // ✅ 戻る時の自動スクロールも止める（保険）
              onClick={() => {
                sessionStorage.setItem(key, String(window.scrollY));
              }}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
            >
              ← 一覧に戻る
            </Link>

            <span className="text-xs text-white/70">{header.category ?? "全て"}</span>
          </div>

          <p className="text-xs text-white/70">{header.formatted}</p>
          <h1 className="text-2xl font-bold text-white">{header.title}</h1>
          <p className="text-sm text-white/80">{header.summary}</p>

          <div className="mt-3">
            <CopyUrlButton />
          </div>
        </div>
      </header>

      {/* ヘッダー分スペーサー */}
      <div style={{ height: HEADER_H }} />

      {/* 本文 */}
      <div className={ready ? "opacity-100" : "opacity-0"}>
        {!parsedOk ? (
          <div className="bg-red-50 p-4 text-red-700">{parsedError}</div>
        ) : (
          <ChatThread messages={messages ?? []} />
        )}
      </div>
    </main>
  );
}