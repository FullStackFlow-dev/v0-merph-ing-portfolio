"use client"

import type { Domain } from "@/data/portfolio-data"

export function DomainCard({ domain, index }: { domain: Domain; index: number }) {
  const Icon = domain.icon
  return (
    <article
      className={`card-lit card-glow ${domain.glowColor} group animate-fade-in cursor-pointer rounded-lg border border-border bg-card p-6 transition-all duration-300`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-border">
          <Icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-medium text-foreground text-pretty">
            {domain.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            {domain.description}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {domain.skills.map((skill) => (
          <span key={skill} className="pill group-hover:bg-primary/10 transition-colors">
            {skill}
          </span>
        ))}
      </div>
    </article>
  )
}
