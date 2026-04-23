import type { Domain } from "@/data/portfolio-data"

export function DomainCard({ domain, index }: { domain: Domain; index: number }) {
  const Icon = domain.icon
  return (
    <article
      className="group animate-fade-in rounded-md border border-border bg-card p-6 transition-colors hover:border-foreground/40"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-accent">
          <Icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
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
          <span key={skill} className="pill">
            {skill}
          </span>
        ))}
      </div>
    </article>
  )
}
