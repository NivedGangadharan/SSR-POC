import { cookies } from "next/headers";

export type DemoSession = { username: string } | null;

export async function getSession(): Promise<DemoSession> {
  const c = await cookies();
  const raw = c.get("demo_auth")?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { u?: string };
    return parsed?.u ? { username: parsed.u } : null;
  } catch {
    return null;
  }
}
