// src/lib/parseTaggedChat.ts
export type Message = {
  role: "assistant" | "user";
  body: string; // Markdown本文（改行保持）
};

export type ParseResult =
  | { ok: true; messages: Message[] }
  | { ok: false; error: string };

const TAGS = [
  { open: "[ASSISTANT]", close: "[/ASSISTANT]", role: "assistant" as const },
  { open: "[USER]", close: "[/USER]", role: "user" as const },
] as const;

export function parseTaggedChat(input: string): ParseResult {
  // ✅ 防御：undefined/null/非文字列が来たら落とさずエラーにする
  if (typeof input !== "string") {
    return { ok: false, error: "変換エラー：入力テキストが不正です" };
  }

  const messages: Message[] = [];
  let i = 0;

  while (i < input.length) {
    // 次に出てくる開始タグを探す（タグ外テキストは無視）
    let nextIndex = -1;
    let nextTag: (typeof TAGS)[number] | null = null;

    for (const tag of TAGS) {
      const idx = input.indexOf(tag.open, i);
      if (idx !== -1 && (nextIndex === -1 || idx < nextIndex)) {
        nextIndex = idx;
        nextTag = tag;
      }
    }

    if (nextIndex === -1 || !nextTag) break;

    const bodyStart = nextIndex + nextTag.open.length;
    const closeIndex = input.indexOf(nextTag.close, bodyStart);

    if (closeIndex === -1) {
      return { ok: false, error: "変換エラー：タグが正しく閉じられていません" };
    }

    const rawBody = input.slice(bodyStart, closeIndex);
    const body = rawBody.trim(); // 前後の不要な改行だけ落とす（中身は改変しない）

    messages.push({ role: nextTag.role, body });
    i = closeIndex + nextTag.close.length;
  }

  return { ok: true, messages };
}