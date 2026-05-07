"use client"

import { domains } from "@/data/portfolio-data"
import type { Domain } from "@/data/portfolio-data"

export function SkillsSection() {
  return (
    <div className="space-y-8">
      {domains.map((domain, i) => (
        <SkillDomain key={domain.id} domain={domain} index={i} />
      ))}
    </div>
  )
}

function SkillDomain({ domain, index }: { domain: Domain; index: number }) {
  const Icon = domain.icon

  return (
    <article
      className={`card-glow ${domain.glowColor} animate-fade-in rounded-lg border border-border bg-card p-6 transition-all duration-300`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-border">
          <Icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-medium text-foreground">
            {domain.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {domain.description}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {domain.skills.map((skill) => (
          <SkillBar key={skill} skill={skill} domain={domain} />
        ))}
      </div>
    </article>
  )
}

const skillLevels: Record<string, number> = {
  "Python (Pandas, NumPy, Scikit-learn)": 95,
  "R & Statistiques Bayésiennes": 75,
  "Visualisation (Matplotlib, Seaborn)": 88,
  "MLOps & Model Deployment": 82,
  "SQL avancé (PostgreSQL, MySQL)": 92,
  "Power BI / Tableau": 85,
  "Excel avancé (VBA, Power Query)": 90,
  "Google Analytics, A/B Testing": 78,
  "Apache Spark / Kafka": 80,
  "Airflow / Luigi": 76,
  "Snowflake / BigQuery": 82,
  "PySpark, Dask, AWS / GCP / Azure": 78,
  "PyTorch / TensorFlow": 88,
  "Computer Vision (YOLO, ResNet)": 82,
  "NLP & Transformers": 85,
  "Fine-tuning LLMs (Llama, GPT, Gemini)": 80,
  "LangChain / RAG": 83,
  "Node.js / Express / Fastify": 90,
  "Python (Django, FastAPI)": 88,
  "REST & GraphQL": 92,
  "PostgreSQL / MongoDB / Redis": 85,
  "Docker / Kubernetes": 80,
  "React / Next.js / Vue.js": 92,
  "TypeScript / JavaScript ES6+": 94,
  "Tailwind CSS / Styled Components": 90,
  "Zustand / Redux": 82,
  "Optimisation des performances": 85,
  "React Native / Expo": 85,
  "Swift / SwiftUI (iOS)": 70,
  "Kotlin / Jetpack Compose (Android)": 68,
  "Flutter / Dart": 72,
  "CI/CD (Fastlane, App Center)": 78,
}

function SkillBar({ skill, domain }: { skill: string; domain: Domain }) {
  const level = skillLevels[skill] ?? 75

  return (
    <div className="group">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground/90">{skill}</span>
        <span className="tabular-nums text-xs text-muted-foreground transition-colors group-hover:text-foreground">
          {level}%
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${level}%`,
            background: `linear-gradient(90deg, var(--glow-color, #0F172A) 0%, var(--glow-color-light, #64748B) 100%)`,
            ["--glow-color" as string]: getGlowCSS(domain.glowColor),
            ["--glow-color-light" as string]: getGlowCSSLight(domain.glowColor),
          }}
        />
      </div>
    </div>
  )
}

function getGlowCSS(glowClass: string): string {
  const map: Record<string, string> = {
    "glow-blue": "#3B82F6",
    "glow-purple": "#8B5CF6",
    "glow-emerald": "#10B981",
    "glow-amber": "#F59E0B",
    "glow-rose": "#F43F5E",
    "glow-cyan": "#06B6D4",
    "glow-indigo": "#6366F1",
  }
  return map[glowClass] ?? "#0F172A"
}

function getGlowCSSLight(glowClass: string): string {
  const map: Record<string, string> = {
    "glow-blue": "#93C5FD",
    "glow-purple": "#C4B5FD",
    "glow-emerald": "#6EE7B7",
    "glow-amber": "#FCD34D",
    "glow-rose": "#FDA4AF",
    "glow-cyan": "#67E8F9",
    "glow-indigo": "#A5B4FC",
  }
  return map[glowClass] ?? "#64748B"
}
