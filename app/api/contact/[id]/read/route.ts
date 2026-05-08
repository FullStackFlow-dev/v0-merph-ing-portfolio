import { NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const numeric = Number(id)
    if (!Number.isFinite(numeric)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }
    await getSql()`UPDATE contact_messages SET read = true WHERE id = ${numeric}`
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.log("[v0] PATCH /api/contact/[id]/read erreur:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
