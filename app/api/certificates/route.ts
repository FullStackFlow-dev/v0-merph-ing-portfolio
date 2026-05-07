import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

/**
 * Fetches all certificates ordered by domain, display order, and date obtained and returns them as JSON.
 *
 * @returns A JSON response containing an array of certificate objects (each with `id`, `title`, `issuer`, `domain`, `date_obtained`, `certificate_url`, `image_url`, `badge_url`, `display_order`, `created_at`, and `updated_at`) on success; on failure returns a JSON error object and HTTP status 500.
 */
export async function GET() {
  try {
    const rows = await sql`
      SELECT 
        id, 
        title, 
        issuer, 
        domain, 
        date_obtained, 
        certificate_url, 
        image_url, 
        badge_url, 
        display_order, 
        created_at, 
        updated_at
      FROM certificates
      ORDER BY domain ASC, display_order ASC, date_obtained DESC
    `
    return NextResponse.json(rows)
  } catch (err) {
    console.error("[api/certificates] GET error:", err)
    return NextResponse.json(
      { error: "Erreur lors du chargement des certificats" },
      { status: 500 }
    )
  }
}

/**
 * Create a new certificate from the JSON request body and return the created row.
 *
 * Expects the request body to be a JSON object with the following fields:
 * - `title` (string, required) — certificate title
 * - `issuer` (string, required) — issuing organization
 * - `domain` (string, required) — associated domain or category
 * - `date_obtained` (string | date, optional) — ISO date or parsable date string; defaults to now
 * - `certificate_url`, `image_url`, `badge_url` (string, optional) — URLs or omitted/null
 * - `display_order` (number, optional) — display priority; defaults to 0
 *
 * Returns the newly inserted certificate record as JSON.
 *
 * @param request - HTTP request whose JSON body contains the certificate fields described above
 * @returns The created certificate row
 *
 * Possible HTTP responses:
 * - 201: created — returns the inserted certificate row
 * - 400: bad request — missing `title`, `issuer`, or `domain`
 * - 500: internal server error — database or unexpected failure
 */
export async function POST(request: Request) {
  try {
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
      INSERT INTO certificates (
        title, 
        issuer, 
        domain, 
        date_obtained, 
        certificate_url, 
        image_url, 
        badge_url, 
        display_order
      )
      VALUES (
        ${title},
        ${issuer},
        ${domain},
        ${date_obtained},
        ${certificate_url || null},
        ${image_url || null},
        ${badge_url || null},
        ${display_order}
      )
      RETURNING *
    `
    
    return NextResponse.json(rows[0], { status: 201 })
  } catch (err) {
    console.error("[api/certificates] POST error:", err)
    return NextResponse.json(
      { error: "Erreur lors de la création du certificat" },
      { status: 500 }
    )
  }
}
