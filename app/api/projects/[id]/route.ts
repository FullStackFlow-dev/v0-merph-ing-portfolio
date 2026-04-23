import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const numeric = Number(id)
    if (!Number.isFinite(numeric)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }
    const rows = await sql`SELECT * FROM projects WHERE id = ${numeric}`
    if (rows.length === 0) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 })
    }
    return NextResponse.json({ project: rows[0] })
  } catch (err) {
    console.log("[v0] GET /api/projects/[id] erreur:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const numeric = Number(id)
    if (!Number.isFinite(numeric)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }
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
      UPDATE projects
      SET title = ${title},
          category = ${category},
          description = ${description},
          tags = ${JSON.stringify(tags)}::jsonb,
          link = ${link || null},
          display_order = ${display_order},
          updated_at = NOW()
      WHERE id = ${numeric}
      RETURNING *
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 })
    }
    return NextResponse.json({ project: rows[0] })
  } catch (err) {
    console.log("[v0] PUT /api/projects/[id] erreur:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

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
    await sql`DELETE FROM projects WHERE id = ${numeric}`
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.log("[v0] DELETE /api/projects/[id] erreur:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
