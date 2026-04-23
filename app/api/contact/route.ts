import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendContactNotification } from "@/lib/send-email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const message = typeof body.message === "string" ? body.message.trim() : ""

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 },
      )
    }
    if (name.length > 100) {
      return NextResponse.json(
        { error: "Nom trop long (max 100 caractères)." },
        { status: 400 },
      )
    }
    if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Adresse e-mail invalide." },
        { status: 400 },
      )
    }
    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message trop long (max 2000 caractères)." },
        { status: 400 },
      )
    }

    const rows = await sql`
      INSERT INTO contact_messages (name, email, message)
      VALUES (${name}, ${email}, ${message})
      RETURNING id, created_at
    `
    const row = rows[0]

    // Envoi e-mail — non bloquant en cas d'erreur
    await sendContactNotification({
      name,
      email,
      message,
      createdAt: new Date(row.created_at),
    })

    return NextResponse.json({ ok: true, id: row.id }, { status: 201 })
  } catch (err) {
    console.log("[v0] POST /api/contact erreur:", err)
    return NextResponse.json(
      { error: "Erreur serveur. Réessayez plus tard." },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, name, email, message, created_at, read
      FROM contact_messages
      ORDER BY created_at DESC
    `
    return NextResponse.json({ messages: rows })
  } catch (err) {
    console.log("[v0] GET /api/contact erreur:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
