// src/lib/conversationRepo.ts
import { put, list, head, del } from "@vercel/blob";

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
    // ローカルで token 無しなら空（必要なら旧JSON実装に差し替えてOK）
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
    throw new Error(
      "BLOB_READ_WRITE_TOKEN が未設定です（VercelのStorage/Blobを作成して環境変数を追加してください）"
    );
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
    access: "public", // 公開側が誰でも閲覧OKなら public でOK
    contentType: "application/json",
    addRandomSuffix: false,
  });

  return conv;
}

/**
 * ✅ 管理者削除用：Blob上の conversation/{id}.json を削除
 */
export async function deleteConversation(id: string) {
  if (!hasBlob) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN が未設定です（VercelのStorage/Blobを作成して環境変数を追加してください）"
    );
  }

  // 存在しなくても del が通る場合がありますが、挙動を安定させたいなら head を挟む
  const h = await head(keyOf(id)).catch(() => null);
  if (!h) {
    // 既に消えている/存在しない → 404扱いにしてもいいが、管理画面では「何もしない」でもOK
    return;
  }

  await del(keyOf(id));
}