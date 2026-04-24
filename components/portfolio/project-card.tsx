"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/lib/db"
import { categoryGlowColors } from "@/data/portfolio-data"

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

  // Get glow color based on category
  const glowColor = categoryGlowColors[project.category] || "glow-blue"

  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className={`card-glow ${glowColor} group flex h-full animate-fade-in cursor-pointer flex-col rounded-lg border border-border bg-card p-6 transition-all duration-300`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {project.category}
        </span>
        {project.link ? (
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
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
            <span key={tag} className="pill group-hover:bg-primary/10 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Wrapper>
  )
}
