"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, FolderKanban, Inbox } from "lucide-react"
import { profile } from "@/data/portfolio-data"

export function AdminNav() {
  const pathname = usePathname()
  const links = [
    { href: "/admin", label: "Messages", icon: Inbox },
    { href: "/admin/projects", label: "Projets", icon: FolderKanban },
  ]
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Portfolio
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-medium text-foreground">
            Admin · {profile.alias}
          </span>
        </div>
        <nav className="flex items-center gap-1.5">
          {links.map((l) => {
            const Icon = l.icon
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {l.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
