import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const numeric = Number(id)
    if (!Number.isFinite(numeric)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }
    await sql`DELETE FROM contact_messages WHERE id = ${numeric}`
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.log("[v0] DELETE /api/contact/[id] erreur:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
