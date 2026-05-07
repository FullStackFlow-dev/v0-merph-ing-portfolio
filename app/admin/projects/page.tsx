import { getSql, type Project } from "@/lib/db"
import { AdminNav } from "@/components/admin/admin-nav"
import { ProjectsManager } from "@/components/admin/projects-manager"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Admin · Projets — Merph-dev",
  robots: { index: false, follow: false },
}

async function getProjects(): Promise<Project[]> {
  try {
    const rows = await getSql()`
      SELECT id, title, category, description, tags, link, display_order, created_at, updated_at
      FROM projects
      ORDER BY display_order DESC, created_at DESC
    `
    return rows as Project[]
  } catch (err) {
    console.log("[v0] admin/projects getProjects erreur:", err)
    return []
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects()
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-foreground lg:text-3xl">
            Gestion des projets
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Créez, modifiez et organisez les projets affichés sur le portfolio.
          </p>
        </div>
        <ProjectsManager initialProjects={projects} />
      </div>
    </div>
  )
}
