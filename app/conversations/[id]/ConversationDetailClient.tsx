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

// ✅ 固定するのは「戻るボタン行」だけなので高さを小さく
// (py-3 + ボタン高さ想定。合わなければ 56〜80 で微調整OK)
const FIXED_BAR_H = 64;

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
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    } catch {}

    const raw = sessionStorage.getItem(key);
    const y = raw ? parseInt(raw, 10) : 0;
    const target = Number.isFinite(y) ? y : 0;

    const restore = () => window.scrollTo(0, target);

    restore();
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
      {/* ✅ 固定バー：戻る行だけ */}
      <div
        className="border-b border-white/10 bg-black"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}
      >
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href={backHref}
              scroll={false}
              onClick={() => {
                sessionStorage.setItem(key, String(window.scrollY));
              }}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
            >
              ← 一覧に戻る
            </Link>

            <span className="text-xs text-white/70">{header.category ?? "全て"}</span>
          </div>
        </div>
      </div>

      {/* ✅ 固定バー分のスペーサー */}
      <div style={{ height: FIXED_BAR_H }} />

      {/* ✅ ここからはスクロールするヘッダー情報（固定しない） */}
      <section className="py-4">
        <p className="text-xs text-white/70">{header.formatted}</p>
        <h1 className="mt-1 text-2xl font-bold text-white">{header.title}</h1>
        <p className="mt-1 text-sm text-white/80">{header.summary}</p>

        <div className="mt-3">
          <CopyUrlButton />
        </div>
      </section>

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