import Link from "next/link"
import { sql, type Project } from "@/lib/db"
import { Sidebar } from "@/components/portfolio/sidebar"
import { Hero } from "@/components/portfolio/hero"
import { PortfolioTabs } from "@/components/portfolio/portfolio-tabs"
import { CollaborationSection } from "@/components/portfolio/collaboration-section"
import { AdminButton } from "@/components/admin-button"
import { profile } from "@/data/portfolio-data"
import { ArrowRight, Github, Linkedin, Twitter, Instagram, MessageCircle } from "lucide-react"

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
    <>
      <main className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
            <Sidebar />

            <div className="space-y-10">
              <Hero />
              <PortfolioTabs projects={projects} />
            </div>
          </div>

          {/* Collaboration Section */}
          <CollaborationSection />

          {/* Footer matching reference portfolio */}
          <footer className="mt-16 border-t border-border pt-12">
            <div className="flex flex-col items-center gap-8">
              {/* CTA Section */}
              <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-muted-foreground">
                  Un projet en tête ?
                </p>
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
      </main>

      {/* Floating Admin Button */}
      <AdminButton />
    </>
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
