import { profile } from "@/data/portfolio-data"

export function Hero() {
  return (
    <section className="animate-fade-in">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Portfolio
        </span>
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
          Disponible
        </span>
        <span className="pill">Dakar, Sénégal</span>
      </div>
      <h2 className="mt-6 text-3xl font-medium text-foreground text-balance leading-tight lg:text-4xl">
        Des données aux produits.
        <span className="block mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
          De l&apos;idée au système en production.
        </span>
      </h2>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
        {profile.bio}
      </p>
    </section>
  )
}
