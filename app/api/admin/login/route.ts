import { NextResponse } from "next/server"
import { createAdminSession, SESSION_COOKIE, verifyAdminPassword } from "@/lib/admin-auth"

export async function POST(request: Request) {
  const body = await request.json()
  const password = String(body?.password ?? "")
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, createAdminSession(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  })
  return response
}
