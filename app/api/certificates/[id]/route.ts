import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

/**
 * Update a certificate identified by `id` using fields from the request body.
 *
 * Validates required fields and returns the updated certificate record.
 *
 * @param params - A promise resolving to route parameters; must include `id`
 * @returns The updated certificate row as returned by the database. Returns a 400 JSON error when required fields are missing, a 404 JSON error when no certificate matches `id`, and a 500 JSON error on internal failure.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const title = typeof body.title === "string" ? body.title.trim() : ""
    const issuer = typeof body.issuer === "string" ? body.issuer.trim() : ""
    const domain = typeof body.domain === "string" ? body.domain.trim() : ""
    const date_obtained = body.date_obtained ? new Date(body.date_obtained).toISOString() : new Date().toISOString()
    const certificate_url = typeof body.certificate_url === "string" ? body.certificate_url.trim() : null
    const image_url = typeof body.image_url === "string" ? body.image_url.trim() : null
    const badge_url = typeof body.badge_url === "string" ? body.badge_url.trim() : null
    const display_order = Number.isFinite(Number(body.display_order)) ? Number(body.display_order) : 0

    if (!title || !issuer || !domain) {
      return NextResponse.json(
        { error: "Le titre, l'émetteur et le domaine sont requis" },
        { status: 400 }
      )
    }

    const rows = await sql`
      UPDATE certificates
      SET 
        title = ${title},
        issuer = ${issuer},
        domain = ${domain},
        date_obtained = ${date_obtained},
        certificate_url = ${certificate_url || null},
        image_url = ${image_url || null},
        badge_url = ${badge_url || null},
        display_order = ${display_order},
        updated_at = NOW()
      WHERE id = ${Number(id)}
      RETURNING *
    `
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Certificat non trouvé" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(rows[0])
  } catch (err) {
    console.error("[api/certificates/[id]] PUT error:", err)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du certificat" },
      { status: 500 }
    )
  }
}

/**
 * Delete the certificate identified by the route `id`.
 *
 * @returns A NextResponse whose JSON is `{ success: true }` on successful deletion; when no matching row exists, JSON `{ error: "Certificat non trouvé" }` with status `404`; on internal error, JSON `{ error: "Erreur lors de la suppression du certificat" }` with status `500`.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const rows = await sql`
      DELETE FROM certificates
      WHERE id = ${Number(id)}
      RETURNING id
    `
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Certificat non trouvé" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[api/certificates/[id]] DELETE error:", err)
    return NextResponse.json(
      { error: "Erreur lors de la suppression du certificat" },
      { status: 500 }
    )
  }
}
