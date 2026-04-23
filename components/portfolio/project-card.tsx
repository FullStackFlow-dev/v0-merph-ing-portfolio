import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/lib/db"

export function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const Wrapper = project.link ? Link : "div"
  const wrapperProps = project.link
    ? {
        href: project.link,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {}

  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className="group flex h-full animate-fade-in flex-col rounded-md border border-border bg-card p-6 transition-colors hover:border-foreground/40"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {project.category}
        </span>
        {project.link ? (
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
            strokeWidth={1.5}
          />
        ) : null}
      </div>
      <h3 className="mt-3 text-lg font-medium text-foreground text-pretty">
        {project.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
        {project.description}
      </p>
      {Array.isArray(project.tags) && project.tags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="pill">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Wrapper>
  )
}
