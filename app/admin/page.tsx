import { sql, type ContactMessage } from "@/lib/db"
import { AdminNav } from "@/components/admin/admin-nav"
import { MessagesDashboard } from "@/components/admin/messages-dashboard"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Admin · Messages — Merph-dev",
  robots: { index: false, follow: false },
}

async function getMessages(): Promise<ContactMessage[]> {
  try {
    const rows = await sql`
      SELECT id, name, email, message, created_at, read
      FROM contact_messages
      ORDER BY created_at DESC
    `
    return rows as ContactMessage[]
  } catch (err) {
    console.log("[v0] getMessages erreur:", err)
    return []
  }
}

export default async function AdminPage() {
  const messages = await getMessages()
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-foreground lg:text-3xl">
            Messages de contact
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les demandes reçues depuis le formulaire du portfolio.
          </p>
        </div>
        <MessagesDashboard initialMessages={messages} />
      </div>
    </div>
  )
}
