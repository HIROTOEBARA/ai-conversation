// app/admin/actions.ts
"use server";

import { createConversation } from "@/lib/conversationRepo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createConversationAction(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const summary = String(formData.get("summary") ?? "");
  const taggedText = String(formData.get("taggedText") ?? "");
  const category = String(formData.get("category") ?? "全て"); // ✅ 追加

  try {
    await createConversation({ title, summary, taggedText, category });

    // 一覧も更新したいので revalidate（保険）
    revalidatePath("/admin");
    revalidatePath("/conversations");

    // ✅ 管理画面に戻す（UX）
    redirect("/admin?created=1");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "作成に失敗しました";
    redirect(`/admin?error=${encodeURIComponent(msg)}`);
  }
}