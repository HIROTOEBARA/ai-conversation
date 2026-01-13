// src/lib/conversationRepo.ts
import { put, list, head } from "@vercel/blob";

export type Conversation = {
  id: string;
  title: string;
  summary: string;
  taggedText: string;
  category?: string | null;
  created_at: string; // ISO
};

const PREFIX = "conversations/";

// Vercel Blob を使えるか（ローカルでも token があれば使える）
const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

// 既存のID形式に合わせる（例: c-xxxx）
function newId() {
  return `c-${Math.random().toString(16).slice(2, 10)}`;
}

function keyOf(id: string) {
  return `${PREFIX}${id}.json`;
}

export async function listConversations(): Promise<Conversation[]> {
  if (!hasBlob) {
    // ここに「ローカル用の旧JSON実装」を残したいなら残してOK
    // ただしVercel本番では必ず hasBlob = true にする
    return [];
  }

  const { blobs } = await list({ prefix: PREFIX });

  const items: Conversation[] = [];
  for (const b of blobs) {
    const res = await fetch(b.url, { cache: "no-store" });
    if (!res.ok) continue;
    const json = (await res.json()) as Conversation;
    items.push(json);
  }

  // 新しい順
  items.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return items;
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  if (!hasBlob) return null;

  // 存在確認（なくても fetch でも良いが、エラー分岐が綺麗）
  const h = await head(keyOf(id)).catch(() => null);
  if (!h) return null;

  const res = await fetch(h.url, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as Conversation;
}

export async function createConversation(input: {
  title: string;
  summary: string;
  taggedText: string;
  category?: string;
}) {
  if (!hasBlob) {
    throw new Error("BLOB_READ_WRITE_TOKEN が未設定です（VercelのStorage/Blobを作成して環境変数を追加してください）");
  }

  const now = new Date().toISOString();
  const conv: Conversation = {
    id: newId(),
    title: input.title,
    summary: input.summary,
    taggedText: input.taggedText,
    category: input.category ?? "全て",
    created_at: now,
  };

  await put(keyOf(conv.id), JSON.stringify(conv, null, 2), {
    access: "public", // 会話詳細を誰でも見れる仕様なら public でOK
    contentType: "application/json",
    addRandomSuffix: false,
  });

  return conv;
}