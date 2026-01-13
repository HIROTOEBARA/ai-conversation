"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

export async function adminLogin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";

  if (!expected) {
    return { ok: false as const, error: "サーバー設定エラー：ADMIN_PASSWORD が未設定です" };
  }
  if (password !== expected) {
    return { ok: false as const, error: "パスワードが違います" };
  }

  cookies().set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return { ok: true as const };
}

export async function adminLogout() {
  cookies().delete(COOKIE_NAME);
  return { ok: true as const };
}