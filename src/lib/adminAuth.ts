// src/lib/adminAuth.ts
"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

export async function adminLogin(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!process.env.ADMIN_PASSWORD) {
    return { ok: false, error: "ADMIN_PASSWORD が未設定です" };
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return { ok: false, error: "パスワードが違います" };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // 必要なら maxAge: 60 * 60 * 24 * 7, // 7日
  });

  return { ok: true as const };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  // cookie を削除（maxAge:0 が確実）
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdminLoggedIn() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === "1";
}

export async function requireAdmin() {
  return await isAdminLoggedIn();
}