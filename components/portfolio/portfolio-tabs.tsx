"use client"

import { useState } from "react"
import { BarChart3, FolderKanban, Layers, Mail, UserRound } from "lucide-react"
import { DomainCard } from "./domain-card"
import { ProjectCard } from "./project-card"
import { AnalyticsWidget } from "./analytics-widget"
import { ContactForm } from "./contact-form"
import { AboutSection } from "./about-section"
import { domains } from "@/data/portfolio-data"
import type { Project } from "@/lib/db"

type TabId = "domains" | "projects" | "analytics" | "contact" | "about"

const tabs: { id: TabId; label: string; icon: typeof Layers }[] = [
  { id: "domains", label: "Domaines", icon: Layers },
  { id: "projects", label: "Projets", icon: FolderKanban },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "about", label: "À propos", icon: UserRound },
]

export function PortfolioTabs({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<TabId>("domains")

  return (
    <section>
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={[
                "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        {active === "domains" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {domains.map((domain, i) => (
              <DomainCard key={domain.id} domain={domain} index={i} />
            ))}
          </div>
        ) : null}

        {active === "projects" ? (
          projects.length === 0 ? (
            <p className="rounded-md border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Aucun projet pour le moment.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          )
        ) : null}

        {active === "analytics" ? <AnalyticsWidget /> : null}

        {active === "contact" ? <ContactForm /> : null}

        {active === "about" ? <AboutSection /> : null}
      </div>
    </section>
  )
}
