// proxy.ts（検証用・一時）
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(_req: NextRequest) {
  return NextResponse.next();
}