// app/admin/actions.ts
"use server";

import { createConversation } from "@/lib/conversationRepo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";

export async function createConversationAction(formData: FormData) {
  // ✅ 管理者チェック
  const ok = await requireAdmin();
  if (!ok) redirect("/admin/login?error=unauthorized");

  const title = String(formData.get("title") ?? "");
  const summary = String(formData.get("summary") ?? "");
  const taggedText = String(formData.get("taggedText") ?? "");
  const category = String(formData.get("category") ?? "全て");

  try {
    await createConversation({ title, summary, taggedText, category });

    revalidatePath("/admin");
    revalidatePath("/conversations");

    redirect("/admin?created=1");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "作成に失敗しました";
    redirect(`/admin?error=${encodeURIComponent(msg)}`);
  }
}