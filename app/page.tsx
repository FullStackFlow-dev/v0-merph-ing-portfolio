import Link from "next/link"
import { sql, type Project } from "@/lib/db"
import { Sidebar } from "@/components/portfolio/sidebar"
import { Hero } from "@/components/portfolio/hero"
import { PortfolioTabs } from "@/components/portfolio/portfolio-tabs"
import { profile } from "@/data/portfolio-data"
import { ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

async function getProjects(): Promise<Project[]> {
  try {
    const rows = await sql`
      SELECT id, title, category, description, tags, link, display_order, created_at, updated_at
      FROM projects
      ORDER BY display_order DESC, created_at DESC
    `
    return rows as Project[]
  } catch (err) {
    console.log("[v0] getProjects erreur:", err)
    return []
  }
}

export default async function Home() {
  const projects = await getProjects()

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
          <Sidebar />

          <div className="space-y-10">
            <Hero />
            <PortfolioTabs projects={projects} />
          </div>
        </div>

        <footer className="mt-16 border-t border-border pt-8">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Un projet en tête ?
              </p>
              <Link
                href={`mailto:${profile.email}`}
                className="group mt-2 inline-flex items-center gap-2 text-2xl font-medium text-foreground transition-colors hover:text-muted-foreground lg:text-3xl"
              >
                {profile.email}
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
            <div className="flex flex-col items-start gap-1 text-xs text-muted-foreground lg:items-end">
              <span>
                © {new Date().getFullYear()} {profile.name}. Tous droits réservés.
              </span>
              <span>Conçu & développé à Dakar, Sénégal.</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
