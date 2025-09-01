import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { username?: string; password?: string } | null;
  const username = body?.username?.trim() ?? "";
  const password = body?.password?.trim() ?? "";
  if (!username || !password) {
    return NextResponse.json({ ok: false, message: "Missing credentials" }, { status: 400 });
  }
  if (username !== password) {
    return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
  }
  const value = JSON.stringify({ u: username, t: Date.now() });
  const res = NextResponse.json({ ok: true });
  const cookie = `demo_auth=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
  res.headers.append("Set-Cookie", cookie);
  return res;
}
