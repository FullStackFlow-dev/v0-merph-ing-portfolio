import Link from "next/link"
import { getSql, type Project } from "@/lib/db"
import { Sidebar } from "@/components/portfolio/sidebar"
import { Hero } from "@/components/portfolio/hero"
import { PortfolioTabs } from "@/components/portfolio/portfolio-tabs"
import { profile } from "@/data/portfolio-data"
import { ArrowRight, Github, Linkedin, Twitter, Instagram, MessageCircle, Lock } from "lucide-react"

export const dynamic = "force-dynamic"

// Facebook icon component
function FacebookIcon({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth || 1.5} 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
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

        {/* Footer matching reference portfolio */}
        <footer className="mt-16 border-t border-border pt-12">
          <div className="flex flex-col items-center gap-8">
            {/* CTA Section */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-foreground">
                Prêt à collaborer ou un projet en tête ?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">Discutons de votre prochain projet Data, Web, mobile ou architecture.</p>
              <Link
                href={`mailto:${profile.email}`}
                className="group mt-3 inline-flex items-center gap-2 text-2xl font-medium text-foreground transition-colors hover:text-primary lg:text-3xl"
              >
                {profile.email}
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <FooterSocialLink href={profile.linkedin} icon={Linkedin} label="LinkedIn" />
              <FooterSocialLink href={profile.github} icon={Github} label="GitHub" />
              <FooterSocialLink href={profile.twitter} icon={Twitter} label="X (Twitter)" />
              <FooterSocialLink href={profile.instagram} icon={Instagram} label="Instagram" />
              <FooterSocialLink href={profile.discord} icon={MessageCircle} label="Discord" />
              <FooterSocialLink href={profile.facebook} icon={FacebookIcon} label="Facebook" />
            </div>

            {/* Copyright */}
            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <span>
                © {new Date().getFullYear()} {profile.name}. Tous droits réservés.
              </span>
              <span>Conçu & développé à Dakar, Sénégal.</span>
            </div>
          </div>
        </footer>
      </div>
      <Link href="/admin/portal" className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-xs shadow-lg backdrop-blur">
        <Lock className="h-3.5 w-3.5" /> Portail admin
      </Link>
    </main>
  )
}

function FooterSocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: typeof Github | typeof FacebookIcon
  label: string
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary hover:scale-110"
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </Link>
  )
}
