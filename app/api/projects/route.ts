import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, title, category, description, tags, link, display_order, created_at, updated_at
      FROM projects
      ORDER BY display_order DESC, created_at DESC
    `
    return NextResponse.json({ projects: rows })
  } catch (err) {
    console.log("[v0] GET /api/projects erreur:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const title = typeof body.title === "string" ? body.title.trim() : ""
    const category = typeof body.category === "string" ? body.category.trim() : ""
    const description =
      typeof body.description === "string" ? body.description.trim() : ""
    const link = typeof body.link === "string" ? body.link.trim() : null
    const display_order = Number.isFinite(Number(body.display_order))
      ? Number(body.display_order)
      : 0
    const tags = Array.isArray(body.tags)
      ? body.tags.map((t: unknown) => String(t)).filter(Boolean)
      : []

    if (!title || !category || !description) {
      return NextResponse.json(
        { error: "Titre, catégorie et description sont requis." },
        { status: 400 },
      )
    }

    const rows = await sql`
      INSERT INTO projects (title, category, description, tags, link, display_order)
      VALUES (${title}, ${category}, ${description}, ${JSON.stringify(tags)}::jsonb, ${link || null}, ${display_order})
      RETURNING *
    `
    return NextResponse.json({ project: rows[0] }, { status: 201 })
  } catch (err) {
    console.log("[v0] POST /api/projects erreur:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
