// src/lib/adminAuth.ts
import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin";

// ✅ 互換: 既存の import が adminLogin/adminLogout でも動くように残す
export async function adminLogin() {
  await setAdminSession();
}

export async function adminLogout() {
  await clearAdminSession();
}

// ✅ セッション付与
export async function setAdminSession() {
  const cookieStore = await cookies(); // ★ここがポイント（await）
  cookieStore.set(COOKIE_NAME, "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

// ✅ セッション削除
export async function clearAdminSession() {
  const cookieStore = await cookies(); // ★ここも
  cookieStore.set(COOKIE_NAME, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}

// ✅ 認証状態
export async function isAdminAuthed() {
  const cookieStore = await cookies(); // ★ここも
  return cookieStore.get(COOKIE_NAME)?.value === "1";
}