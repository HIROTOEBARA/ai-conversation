// src/lib/normalizeToTaggedChat.ts
export type TagMode = "assistant" | "user";

/**
 * 他サービスの生ログを、[ASSISTANT]...[/ASSISTANT] / [USER]...[/USER] 形式に整形する
 *
 * mode の意味:
 * - "assistant" or "user" を指定すると、役割行が無いテキストは「全体をそのタグで囲む」
 * - ただし、入力内に "Assistant:" / "User:" 等の役割行が含まれる場合は自動で分割してタグ化（従来仕様）
 */
export function normalizeToTaggedChat(input: string, mode: TagMode = "assistant"): string {
  const raw = (input ?? "").replace(/\r\n/g, "\n").trim();
  if (!raw) return "";

  const lines = raw.split("\n");

  const isAssistantLine = (line: string) => /^(AI|Assistant|ASSISTANT)\s*[:：]/i.test(line);
  const isUserLine = (line: string) => /^(User|USER)\s*[:：]/i.test(line);

  // ✅ 役割行が1つも無いなら「全体を mode のタグで囲む」
  const hasRoleMarkers = lines.some((l) => isAssistantLine(l) || isUserLine(l));
  if (!hasRoleMarkers) {
    const tag = mode === "assistant" ? "ASSISTANT" : "USER";
    return `[${tag}]\n${raw}\n[/${tag}]`;
  }

  // ✅ 役割行がある場合は、従来通り role ベースで分割してタグ化
  let result: string[] = [];
  let currentRole: "assistant" | "user" | null = null;
  let buffer: string[] = [];

  function flush() {
    if (!currentRole) return;

    const body = buffer.join("\n").trim();
    if (!body) {
      buffer = [];
      return;
    }

    const tag = currentRole === "assistant" ? "ASSISTANT" : "USER";
    result.push(`[${tag}]\n${body}\n[/${tag}]`);
    buffer = [];
  }

  for (const line of lines) {
    if (isAssistantLine(line)) {
      flush();
      currentRole = "assistant";
      buffer.push(line.replace(/^(AI|Assistant|ASSISTANT)\s*[:：]/i, "").trim());
      continue;
    }
    if (isUserLine(line)) {
      flush();
      currentRole = "user";
      buffer.push(line.replace(/^(User|USER)\s*[:：]/i, "").trim());
      continue;
    }
    buffer.push(line);
  }

  flush();
  return result.join("\n\n").trim();
}