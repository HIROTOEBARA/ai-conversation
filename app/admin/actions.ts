// app/admin/actions.ts
"use server";

import { createConversation, deleteConversation } from "@/lib/conversationRepo";
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

export async function deleteConversationAction(formData: FormData) {
  // ✅ 管理者チェック
  const ok = await requireAdmin();
  if (!ok) redirect("/admin/login?error=unauthorized");

  const id = String(formData.get("id") ?? "").trim();

  // ✅ ログ（切り分け用：終わったら消してOK）
  console.log("[deleteConversationAction] id=", id);

  if (!id) redirect(`/admin?error=${encodeURIComponent("削除対象IDが不正です")}`);

  try {
    await deleteConversation(id);

    revalidatePath("/admin");
    revalidatePath("/conversations");

    redirect("/admin?deleted=1");
  } catch (e) {
    console.error("[deleteConversationAction] error=", e);
    const msg = e instanceof Error ? e.message : "削除に失敗しました";
    redirect(`/admin?error=${encodeURIComponent(msg)}`);
  }
}