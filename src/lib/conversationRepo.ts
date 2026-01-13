// src/lib/conversationRepo.ts
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export type Conversation = {
  id: string;
  title: string;
  summary: string;
  taggedText: string;
  created_at: string; // ISO
  category?: string; // ✅ 追加（未分類は undefined）
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "conversations.json");

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]\n", "utf8"); // 末尾改行つき
  }
}

async function readAll(): Promise<Conversation[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw) as Conversation[];

  // ✅ 後方互換：古いデータ（categoryなし）でもOK
  const normalized = parsed.map((c) => ({
    ...c,
    category: c.category && c.category !== "全て" ? c.category : undefined,
  }));

  return normalized.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

async function writeAll(conversations: Conversation[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(conversations, null, 2) + "\n", "utf8");
}

export async function listConversations(): Promise<Conversation[]> {
  return readAll();
}

export async function getConversationById(id: string): Promise<Conversation | undefined> {
  const all = await readAll();
  return all.find((c) => c.id === id);
}

export async function createConversation(input: {
  title: string;
  summary: string;
  taggedText: string;
  category?: string; // ✅ 追加
}): Promise<Conversation> {
  const title = input.title.trim();
  const summary = input.summary.trim();
  const taggedText = input.taggedText.trim();
  const categoryRaw = String(input.category ?? "").trim();

  if (!title) throw new Error("タイトルが空です");
  if (!summary) throw new Error("概要が空です");
  if (!taggedText) throw new Error("本文（タグ付き）が空です");

  // ✅ 「全て」 or 空は未分類扱い（= category undefined）
  const category = categoryRaw && categoryRaw !== "全て" ? categoryRaw : undefined;

  const id = `c-${crypto.randomUUID().slice(0, 8)}`;
  const created_at = new Date().toISOString();

  const newConv: Conversation = { id, title, summary, taggedText, created_at, category };

  const all = await readAll();
  all.unshift(newConv);
  await writeAll(all);

  return newConv;
}