"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, FolderKanban, Inbox, Award, Layers } from "lucide-react"
import { profile } from "@/data/portfolio-data"

export function AdminNav() {
  const pathname = usePathname()
  const links = [
    { href: "/admin", label: "Messages", icon: Inbox },
    { href: "/admin/projects", label: "Projets", icon: FolderKanban },
    { href: "/admin/certificates", label: "Certificats", icon: Award },
    { href: "/admin/domains", label: "Domaines", icon: Layers },
  ]
  return <header className="border-b border-border bg-card"><div className="mx-auto flex w-full max-w-6xl flex-wrap gap-2 px-4 py-4 lg:px-8">
    <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4"/>Portfolio</Link>
    <span className="text-sm font-medium">Admin · {profile.alias}</span>
    <nav className="ml-auto flex gap-1.5">{links.map((l)=>{const I=l.icon; const active=pathname===l.href; return <Link key={l.href} href={l.href} className={active?"rounded-md border border-foreground bg-foreground px-3 py-1.5 text-sm text-background":"rounded-md border border-border px-3 py-1.5 text-sm"}><I className="mr-1 inline h-4 w-4"/>{l.label}</Link>})}</nav>
  </div></header>
}
