import { profile } from "@/data/portfolio-data"

export function Hero() {
  return (
    <section className="animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="pill">Portfolio</span>
        <span className="pill">Dakar, Sénégal</span>
      </div>
      <h2 className="mt-4 text-3xl font-medium text-foreground text-balance leading-tight lg:text-4xl">
        Des données aux produits.
        <span className="block text-muted-foreground">
          De l&apos;idée au système en production.
        </span>
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
        {profile.bio}
      </p>
    </section>
  )
}
